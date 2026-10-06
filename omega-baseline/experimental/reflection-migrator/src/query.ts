// Query API over a serialized Reflection Graph (MP21-P3). This module is what MP-54, MP-55
// and MP-60 import. It depends only on the graph's types: no parser, no Git, no file system.
// Give it a parsed graph.json and it answers from that alone.
//
// Every answer is a description of the commit the graph was built from. It never
// authorizes, ranks or schedules anything.
import type { SourceAnchor } from "./anchor.ts";
import type { Claim, GraphEdge, GraphNode, ReflectionGraph } from "./graph.ts";

/**
 * Which end of a relation is affected when the other end changes. `from` means the edge's
 * source depends on its target (A imports B: A depends on B). Traversal uses only relations
 * marked `from` or `to`; `none` records that a relation is known and deliberately not a
 * dependency (a test file sits in a plugin's directory without the plugin depending on it).
 * A test fails if the graph contains a relation this table does not name.
 */
export const DEPENDENT_END: Record<string, "from" | "to" | "none"> = {
  imports: "from",
  "calls-port": "from",
  "depends-on": "from",
  "requests-port": "from",
  "requests-capability": "from",
  "mentions-op": "from",
  "frames-op": "from",
  "entry-module": "from",
  "declared-in": "from",
  "part-of": "to",
  "located-in": "none",
  declares: "to",
  contributes: "to",
  "has-field": "to",
  "declares-op": "to",
  "registers-op": "to",
};

export interface Step { ref: string; depth: number; via?: GraphEdge }

export interface Resolved {
  node: GraphNode;
  anchors: SourceAnchor[];
  outgoing: GraphEdge[];
  incoming: GraphEdge[];
}

export interface TraverseOptions {
  /** Restrict traversal to these relations. Default: every relation in DEPENDENT_END. */
  relations?: string[];
  maxDepth?: number;
}

const byString = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

export class ReflectionIndex {
  private readonly nodes = new Map<string, GraphNode>();
  private readonly out = new Map<string, GraphEdge[]>();
  private readonly into = new Map<string, GraphEdge[]>();

  constructor(readonly graph: ReflectionGraph) {
    for (const n of graph.nodes) this.nodes.set(n.ref, n);
    for (const e of graph.edges) {
      (this.out.get(e.from) ?? this.out.set(e.from, []).get(e.from)!).push(e);
      (this.into.get(e.to) ?? this.into.set(e.to, []).get(e.to)!).push(e);
    }
  }

  /** The revision every answer describes. Compare with the caller's HEAD to detect staleness. */
  get describes(): { repository: string; commit: string; scope: string } {
    return { repository: this.graph.repository, commit: this.graph.commit, scope: this.graph.scope };
  }

  isCurrent(headCommit: string): boolean {
    return headCommit === this.graph.commit;
  }

  /**
   * Accepts an EntityRef, or the two bare spellings people actually type: a repository
   * path (`plugins/x/src/index.ts`, with or without the scope prefix) and an op (`vault.get@1`).
   */
  normalize(input: string): string | undefined {
    if (this.nodes.has(input)) return input;
    const scope = this.graph.scope ? `${this.graph.scope}/` : "";
    for (const candidate of [`file:${input}`, `file:${scope}${input}`, `op:${input}`, `plugin:${input}`]) {
      if (this.nodes.has(candidate)) return candidate;
    }
    return undefined;
  }

  has(entity: string): boolean {
    return this.nodes.has(entity);
  }

  node(entity: string): GraphNode | undefined {
    return this.nodes.get(entity);
  }

  resolve(entity: string): Resolved | undefined {
    const node = this.nodes.get(entity);
    if (!node) return undefined;
    return { node, anchors: this.anchorsOf(entity), outgoing: this.out.get(entity) ?? [], incoming: this.into.get(entity) ?? [] };
  }

  find(filter: { kind?: string; contains?: string } = {}): GraphNode[] {
    return this.graph.nodes.filter((n) => (filter.kind === undefined || n.kind === filter.kind) && (filter.contains === undefined || n.ref.includes(filter.contains)));
  }

  edges(filter: { from?: string; to?: string; relation?: string } = {}): GraphEdge[] {
    const pool = filter.from !== undefined ? this.out.get(filter.from) ?? [] : filter.to !== undefined ? this.into.get(filter.to) ?? [] : this.graph.edges;
    return pool.filter((e) => (filter.to === undefined || e.to === filter.to) && (filter.relation === undefined || e.relation === filter.relation));
  }

  claims(entity: string, predicate?: string): Claim[] {
    return (this.nodes.get(entity)?.claims ?? []).filter((c) => predicate === undefined || c.predicate === predicate);
  }

  /** Every anchor that locates the node or supports a claim or relation it takes part in. */
  anchorsOf(entity: string): SourceAnchor[] {
    const node = this.nodes.get(entity);
    if (!node) return [];
    const ids = new Set<string>(node.anchors);
    for (const c of node.claims) for (const a of c.anchors) ids.add(a);
    for (const e of [...(this.out.get(entity) ?? []), ...(this.into.get(entity) ?? [])]) for (const a of e.anchors) ids.add(a);
    return [...ids].sort(byString).map((id) => this.graph.anchors[id]!);
  }

  /** Repository paths behind an entity, sorted. The basis for a deterministic bundle file set. */
  filesOf(entity: string): string[] {
    return [...new Set(this.anchorsOf(entity).map((a) => a.path))].sort(byString);
  }

  private traverse(start: string, direction: "dependents" | "dependencies", options: TraverseOptions): Step[] {
    if (!this.nodes.has(start)) return [];
    const allowed = new Set(options.relations ?? Object.keys(DEPENDENT_END));
    const seen = new Map<string, Step>([[start, { ref: start, depth: 0 }]]);
    let frontier = [start];
    for (let depth = 1; frontier.length > 0 && depth <= (options.maxDepth ?? Infinity); depth++) {
      const next: string[] = [];
      for (const current of frontier) {
        const candidates: Array<[GraphEdge, string]> = [
          ...(this.into.get(current) ?? []).map((e): [GraphEdge, string] => [e, e.from]),
          ...(this.out.get(current) ?? []).map((e): [GraphEdge, string] => [e, e.to]),
        ];
        for (const [edge, other] of candidates) {
          const dependentEnd = DEPENDENT_END[edge.relation];
          if (dependentEnd === undefined || dependentEnd === "none" || !allowed.has(edge.relation)) continue;
          const dependent = dependentEnd === "from" ? edge.from : edge.to;
          const follows = direction === "dependents" ? dependent === other : dependent === current;
          if (!follows || other === current || seen.has(other)) continue;
          seen.set(other, { ref: other, depth, via: edge });
          next.push(other);
        }
      }
      frontier = next.sort(byString);
    }
    return [...seen.values()].filter((s) => s.depth > 0).sort((a, b) => a.depth - b.depth || byString(a.ref, b.ref));
  }

  /** What is affected if `entity` changes: the transitive dependents, nearest first, each with the edge that reached it. */
  impact(entity: string, options: TraverseOptions = {}): Step[] {
    return this.traverse(entity, "dependents", options);
  }

  /** What `entity` relies on: the transitive dependencies, nearest first. */
  dependencies(entity: string, options: TraverseOptions = {}): Step[] {
    return this.traverse(entity, "dependencies", options);
  }

  /** Test files among the entities affected by a change to `entity`. */
  affectedTests(entity: string, options: TraverseOptions = {}): string[] {
    return this.impact(entity, options).filter((s) => this.roleOf(s.ref) === "test").map((s) => s.ref);
  }

  roleOf(entity: string): string | undefined {
    const value = this.claims(entity, "classified-as")[0]?.value;
    return value && typeof value === "object" && !Array.isArray(value) ? (value["role"] as string) : undefined;
  }

  /** The chain of edges from `start` to an entity returned by impact() or dependencies(). */
  explain(steps: Step[], target: string): GraphEdge[] {
    const byRef = new Map(steps.map((s) => [s.ref, s]));
    const chain: GraphEdge[] = [];
    for (let s = byRef.get(target); s?.via; s = byRef.get(s.via.from === s.ref ? s.via.to : s.via.from)) chain.unshift(s.via);
    return chain;
  }
}

export function loadGraph(json: string): ReflectionIndex {
  const graph = JSON.parse(json) as ReflectionGraph;
  if (graph.schema !== "vomega-reflection-graph/1") throw new Error(`not a Reflection Graph this API reads: schema ${String(graph.schema)}`);
  return new ReflectionIndex(graph);
}
