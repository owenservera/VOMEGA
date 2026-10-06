// Reflection Graph (MP21-P3): the inventory and the extracted facts assembled into one
// self-contained, serializable descriptor. It is a derived build artifact pinned to a
// commit — consumers load it and query it; they never parse source or run this module.
//
// The graph is descriptive only. It grants nothing, proves no behavior, and carries each
// edge's claim class so a consumer can always tell a declared fact from an inferred one.
import { digest, type Json } from "../../ratchet/src/canonical.ts";
import { anchorId, byString, type SourceAnchor } from "./anchor.ts";
import type { Extraction, PluginParity } from "./extract.ts";
import { kindOfRef, ref, type ClaimClass, type Fact } from "./facts.ts";
import type { Inventory, Unknown } from "./inventory.ts";

export const GRAPH_SCHEMA = "vomega-reflection-graph/1";

/** A statement about one node that has no second node (a version, a doc string, a shape). */
export interface Claim {
  predicate: string;
  claimClass: ClaimClass;
  rule?: string;
  value?: Json;
  anchors: string[];
}

export interface GraphNode {
  /** The EntityRef: `<kind>:<name>`. Stable across commits for as long as the thing keeps its declared name. */
  ref: string;
  kind: string;
  /** Anchors that locate the node itself (a file, a declaration). Relations carry their own. */
  anchors: string[];
  claims: Claim[];
}

export interface GraphEdge {
  id: string;
  from: string;
  relation: string;
  to: string;
  claimClass: ClaimClass;
  rule?: string;
  value?: Json;
  anchors: string[];
}

export interface ReflectionGraph {
  schema: typeof GRAPH_SCHEMA;
  repository: string;
  commit: string;
  scope: string;
  inventoryDigest: string;
  extractionDigest: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Every anchor a node or edge cites, by id, so the graph resolves to source without another file. */
  anchors: Record<string, SourceAnchor>;
  parity: PluginParity[];
  unknowns: Unknown[];
  notExtracted: Extraction["notExtracted"];
  counts: Record<string, number>;
  digest: string;
}

function claimOf(f: Fact): Claim {
  const claim: Claim = { predicate: f.predicate, claimClass: f.claimClass, anchors: f.anchors };
  if (f.rule !== undefined) claim.rule = f.rule;
  if (f.value !== undefined) claim.value = f.value;
  return claim;
}

export function buildGraph(inventory: Inventory, extraction: Extraction): ReflectionGraph {
  if (extraction.inventoryDigest !== inventory.digest) throw new Error("extraction was not built from this inventory");
  const nodes = new Map<string, GraphNode>();
  const node = (entity: string): GraphNode => {
    let n = nodes.get(entity);
    if (!n) nodes.set(entity, (n = { ref: entity, kind: kindOfRef(entity), anchors: [], claims: [] }));
    return n;
  };
  const edges: GraphEdge[] = [];

  for (const f of inventory.files) {
    const n = node(ref.file(f.path));
    n.anchors.push(anchorId("file", f.path));
    n.claims.push({ predicate: "classified-as", claimClass: "INFERRED_SAFE", rule: "path-classification", value: { role: f.role, surface: f.surface }, anchors: [anchorId("file", f.path)] });
  }
  for (const a of inventory.anchors) {
    if (a.extractionKind !== "declaration" || a.symbol === undefined) continue;
    const symbol = ref.symbol(a.path, a.symbol);
    const n = node(symbol);
    n.anchors.push(a.id);
    const declared = inventory.declarations[a.id];
    if (declared) n.claims.push({ predicate: "declared-as", claimClass: "PROVEN_STRUCTURAL", value: { exported: declared.exported, declKinds: declared.declKinds }, anchors: [a.id] });
    edges.push({ id: `declares(${ref.file(a.path)} -> ${symbol})`, from: ref.file(a.path), relation: "declares", to: symbol, claimClass: "PROVEN_STRUCTURAL", anchors: [a.id] });
  }
  for (const f of extraction.facts) {
    const subject = node(f.subject);
    if (f.object === undefined) {
      subject.claims.push(claimOf(f));
      continue;
    }
    node(f.object);
    const { predicate, ...rest } = claimOf(f);
    edges.push({ id: f.id, from: f.subject, relation: predicate, to: f.object, ...rest });
  }

  const all = new Map([...inventory.anchors, ...extraction.anchors].map((a) => [a.id, a]));
  const anchors: Record<string, SourceAnchor> = {};
  const cite = (ids: string[]) => {
    for (const id of ids) {
      const a = all.get(id);
      if (!a) throw new Error(`graph cites an anchor that does not exist: ${id}`);
      anchors[id] = a;
    }
  };
  const nodeList = [...nodes.values()].sort((a, b) => byString(a.ref, b.ref));
  for (const n of nodeList) {
    n.anchors.sort(byString);
    n.claims.sort((a, b) => byString(a.predicate, b.predicate));
    cite(n.anchors);
    for (const c of n.claims) cite(c.anchors);
  }
  edges.sort((a, b) => byString(a.id, b.id));
  for (const e of edges) cite(e.anchors);

  const counts: Record<string, number> = { nodes: nodeList.length, edges: edges.length, anchors: Object.keys(anchors).length };
  const bump = (key: string) => (counts[key] = (counts[key] ?? 0) + 1);
  for (const n of nodeList) bump(`node:${n.kind}`);
  for (const e of edges) bump(`edge:${e.relation}`);

  const body = {
    schema: GRAPH_SCHEMA as typeof GRAPH_SCHEMA,
    repository: inventory.repository, commit: inventory.commit, scope: inventory.scope,
    inventoryDigest: inventory.digest, extractionDigest: extraction.digest,
    nodes: nodeList, edges, anchors,
    parity: extraction.parity, unknowns: [...inventory.unknowns, ...extraction.unknowns], notExtracted: extraction.notExtracted, counts,
  };
  return { ...body, digest: digest(body) };
}
