// Symbol location via the TypeScript parser (MP21-P1; the REF-01 parser choice).
//
// Syntax only: `createSourceFile` / `parseJsonText` build an AST without a Program or type
// checker, so a scan needs no tsconfig and cannot be changed by what else is installed.
// The same AST is what P2 walks for op registration and schemas, so nothing here is a
// text-scan shortcut that P2 would have to replace.
import ts from "typescript";
import { byString, hashText } from "./anchor.ts";

export interface LocatedSymbol {
  symbol: string;
  spanHash: string;
  range: { startLine: number; endLine: number };
}

export interface Declaration extends LocatedSymbol {
  exported: boolean;
  /** Sorted syntax kinds that declare this name in the file (a name may be declared more than once). */
  declKinds: string[];
}

export interface Located<T> {
  items: T[];
  /** Reasons the result may be incomplete. Reported, never hidden. */
  problems: string[];
}

interface Span { start: number; end: number }

function located(sf: ts.SourceFile, symbol: string, spans: Span[]): LocatedSymbol {
  const ordered = [...spans].sort((a, b) => a.start - b.start);
  const first = ordered[0]!;
  const last = ordered[ordered.length - 1]!;
  return {
    symbol,
    spanHash: hashText(ordered.map((s) => sf.text.slice(s.start, s.end)).join("\n")),
    range: {
      startLine: sf.getLineAndCharacterOfPosition(first.start).line + 1,
      endLine: sf.getLineAndCharacterOfPosition(last.end).line + 1,
    },
  };
}

function syntaxProblems(sf: ts.SourceFile): string[] {
  // parseDiagnostics is not in the public typings; it is the only syntax-error channel
  // that needs no Program.
  const diagnostics = (sf as unknown as { parseDiagnostics?: readonly ts.Diagnostic[] }).parseDiagnostics ?? [];
  return diagnostics.length > 0 ? [`${diagnostics.length} syntax error(s); declarations may be incomplete`] : [];
}

const SCRIPT_KINDS: Record<string, ts.ScriptKind> = {
  ".ts": ts.ScriptKind.TS, ".mts": ts.ScriptKind.TS, ".cts": ts.ScriptKind.TS, ".tsx": ts.ScriptKind.TSX,
  ".js": ts.ScriptKind.JS, ".mjs": ts.ScriptKind.JS, ".cjs": ts.ScriptKind.JS, ".jsx": ts.ScriptKind.JSX,
};

export function scriptKindOf(path: string): ts.ScriptKind | undefined {
  return SCRIPT_KINDS[path.slice(path.lastIndexOf("."))];
}

function bindingNames(name: ts.BindingName): string[] {
  if (ts.isIdentifier(name)) return [name.text];
  return name.elements.flatMap((e) => (ts.isOmittedExpression(e) ? [] : bindingNames(e.name)));
}

function isExported(node: ts.Node): boolean {
  return ts.canHaveModifiers(node) && (ts.getModifiers(node) ?? []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
}

/** Top-level declarations and export statements of one module, one entry per declared name. */
export function locateDeclarations(path: string, text: string): Located<Declaration> {
  const sf = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, false, scriptKindOf(path));
  const found = new Map<string, { spans: Span[]; kinds: Set<string>; exported: boolean }>();
  const add = (symbol: string, node: ts.Node, exported: boolean) => {
    const entry = found.get(symbol) ?? { spans: [], kinds: new Set<string>(), exported: false };
    entry.spans.push({ start: node.getStart(sf), end: node.end });
    entry.kinds.add(ts.SyntaxKind[node.kind]!);
    entry.exported ||= exported;
    found.set(symbol, entry);
  };

  for (const node of sf.statements) {
    if (ts.isVariableStatement(node)) {
      for (const d of node.declarationList.declarations) {
        for (const name of bindingNames(d.name)) add(name, d, isExported(node));
      }
    } else if (
      ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node) || ts.isEnumDeclaration(node) || ts.isModuleDeclaration(node)
    ) {
      const isDefault = (ts.getModifiers(node) ?? []).some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
      add(node.name?.text ?? "default", node, isExported(node));
      if (isDefault && node.name) add("default", node, true);
    } else if (ts.isExportAssignment(node)) {
      add(node.isExportEquals ? "export=" : "default", node, true);
    } else if (ts.isExportDeclaration(node)) {
      const from = node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier) ? node.moduleSpecifier.text : undefined;
      if (!node.exportClause) add(`*:${from}`, node, true);
      else if (ts.isNamespaceExport(node.exportClause)) add(node.exportClause.name.text, node, true);
      else for (const e of node.exportClause.elements) add(e.name.text, e, true);
    }
  }

  const items = [...found.entries()]
    .map(([symbol, e]) => ({ ...located(sf, symbol, e.spans), exported: e.exported, declKinds: [...e.kinds].sort(byString) }))
    .sort((a, b) => byString(a.symbol, b.symbol));
  return { items, problems: syntaxProblems(sf) };
}

function property(obj: ts.ObjectLiteralExpression, key: string): ts.Expression | undefined {
  for (const p of obj.properties) {
    if (ts.isPropertyAssignment(p) && ts.isStringLiteral(p.name) && p.name.text === key) return p.initializer;
  }
  return undefined;
}

function stringAt(obj: ts.ObjectLiteralExpression, key: string): string | undefined {
  const v = property(obj, key);
  return v && ts.isStringLiteral(v) ? v.text : undefined;
}

export interface ManifestSymbols extends Located<LocatedSymbol> {
  pluginId?: string;
  entry?: string;
}

/**
 * The identity-bearing parts of a plugin.json: the plugin itself and each contribution.
 * Symbols are the declared ids (`plugin:<id>`, `<kind>:<id>@<version>`), never array
 * positions, so reordering contributions does not change an identity. Anything that
 * cannot be named from the file's own fields is a problem, not a guess.
 */
export function locateManifestSymbols(path: string, text: string): ManifestSymbols {
  const sf = ts.parseJsonText(path, text);
  const problems = syntaxProblems(sf);
  const root = sf.statements[0]?.expression;
  if (!root || !ts.isObjectLiteralExpression(root)) return { items: [], problems: [...problems, "root is not a JSON object"] };

  const out = new Map<string, Span[]>();
  const pluginId = stringAt(root, "id");
  if (pluginId === undefined) problems.push("manifest has no string `id`");
  else out.set(`plugin:${pluginId}`, [{ start: root.getStart(sf), end: root.end }]);

  const contributions = property(root, "contributions");
  if (contributions && ts.isObjectLiteralExpression(contributions)) {
    for (const group of contributions.properties) {
      if (!ts.isPropertyAssignment(group) || !ts.isStringLiteral(group.name)) continue;
      const kind = group.name.text;
      if (!ts.isArrayLiteralExpression(group.initializer)) {
        problems.push(`contributions.${kind} is not an array`);
        continue;
      }
      group.initializer.elements.forEach((element, index) => {
        const id = ts.isObjectLiteralExpression(element) ? stringAt(element, "id") : undefined;
        const version = ts.isObjectLiteralExpression(element) ? stringAt(element, "version") : undefined;
        if (id === undefined || version === undefined) {
          problems.push(`contributions.${kind}[${index}] has no string id/version`);
          return;
        }
        const symbol = `${kind}:${id}@${version}`;
        if (out.has(symbol)) problems.push(`contribution ${symbol} is declared more than once`);
        out.set(symbol, [...(out.get(symbol) ?? []), { start: element.getStart(sf), end: element.end }]);
      });
    }
  } else if (contributions) {
    problems.push("`contributions` is not an object");
  }

  const items = [...out.entries()].map(([symbol, spans]) => located(sf, symbol, spans)).sort((a, b) => byString(a.symbol, b.symbol));
  return { items, problems, pluginId, entry: stringAt(root, "entry") };
}
