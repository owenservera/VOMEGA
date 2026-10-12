// Run A / source-first instrument.
//
// PURPOSE: extract only CODE-DERIVED facts from the pinned fixture, using the real
// TypeScript compiler API. Author doc-comments are captured but tagged as a
// DIFFERENT evidence class, because this run's whole question is whether a
// comment and a mechanically-established constraint ever agree.
//
// This is deliberately not a semantic analyzer. It reports what the compiler can
// prove from the source, plus what it explicitly cannot.
//
// Usage: node extract-facts.mjs [file.ts]
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

const require = createRequire(import.meta.url);
const TS_PATHS = [
  'C:/Users/VIVIM.inc/AppData/Local/npm-cache/_npx/da912b5ea09ad757/node_modules/typescript',
  'C:/Users/VIVIM.inc/AppData/Local/npm-cache/_npx/f011020c10869b43/node_modules/typescript',
];
let ts;
for (const p of TS_PATHS) {
  try { ts = require(p); break; } catch { /* try next */ }
}
if (!ts) {
  console.error('typescript compiler API not found; cannot derive facts mechanically');
  process.exit(2);
}

const file = process.argv[2] || 'baseline.ts';
const text = readFileSync(file, 'utf8');
const sha = createHash('sha256').update(text).digest('hex');

// The SourceFile and the TypeChecker must come from the SAME Program, otherwise
// the checker cannot resolve symbols and getSignatureFromDeclaration throws.
const program = ts.createProgram([file], {
  strict: true,
  target: ts.ScriptTarget.ES2020,
  noEmit: true,
});
const checker = program.getTypeChecker();
const sf = program.getSourceFile(file);
if (!sf) {
  console.error(`program did not load ${file}`);
  process.exit(2);
}

// A call/mutation is a side effect for our purposes: emitting to a callback,
// assigning outside the function, throwing, or touching a global.
function effectKind(node) {
  const kinds = new Set();
  const walk = (n) => {
    if (ts.isCallExpression(n)) {
      const callee = n.expression.getText(sf);
      if (callee === 'emit') kinds.add('calls-injected-callback');
      else if (/^(console|process|globalThis|window)$/.test(callee)) kinds.add('global-io');
      else kinds.add(`calls:${callee}`);
    }
    if (ts.isThrowStatement(n)) kinds.add('throws');
    if (ts.isAwaitExpression(n)) kinds.add('awaits');
    if (ts.isNewExpression(n)) kinds.add('allocates');
    ts.forEachChild(n, walk);
  };
  walk(node);
  return [...kinds];
}

function paramFacts(fn) {
  return fn.parameters.map((p) => {
    const t = checker.getTypeAtLocation(p);
    const d = checker.getSymbolAtLocation(p.name);
    return {
      name: p.name.getText(sf),
      declaredType: checker.typeToString(t),
      optional: !!p.questionToken || !!p.initializer,
      hasDefault: !!p.initializer,
      // A parameter type is a COMPILE-TIME constraint only. Whether it holds at
      // runtime is a separate question this instrument does not answer.
      note: 'type constraint is compile-time only',
    };
  });
}

const hasExportModifier = (node) =>
  !!(node.modifiers || []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword);

const derived = {
  evidenceClass: 'CODE_DERIVED',
  tool: `typescript@${ts.version} compiler API (typeChecker)`,
  source: file,
  sha256: sha,
  bytes: Buffer.byteLength(text),
  exports: [],
  topLevelStatements: [],
  authorAssertions: [],
  compilerCannotEstablish: [],
};

for (const stmt of sf.statements) {
  if (ts.isFunctionDeclaration(stmt) && stmt.name) {
    const sig = checker.getSignatureFromDeclaration(stmt);
    const retType = checker.getReturnTypeOfSignature(sig);
    derived.exports.push({
      kind: 'function',
      name: stmt.name.getText(sf),
      // Export status comes from the statement modifier. Reading it off the
      // symbol flags instead reports every ESM export as private, which is a
      // false fact -- verified against the source text.
      exported: hasExportModifier(stmt),
      params: paramFacts(stmt),
      declaredReturnType: checker.typeToString(retType),
      returnTypeIsUnionOfStringLiterals: !!retType.isUnion() && retType.types.every((t) => t.isStringLiteral()),
      observedEffects: effectKind(stmt),
      bodyLineCount: stmt.body ? stmt.body.statements.length : 0,
    });
  } else if (ts.isVariableStatement(stmt)) {
    for (const d of stmt.declarationList.declarations) {
      derived.exports.push({
        kind: 'const',
        name: d.name.getText(sf),
        exported: hasExportModifier(stmt),
        inferredType: checker.typeToString(checker.getTypeAtLocation(d.name)),
        literalValue: d.initializer && ts.isNumericLiteral(d.initializer) ? d.initializer.text : null,
      });
    }
  } else if (ts.isInterfaceDeclaration(stmt) || ts.isTypeAliasDeclaration(stmt)) {
    derived.exports.push({kind: ts.SyntaxKind[stmt.kind], name: stmt.name.getText(sf), exported: hasExportModifier(stmt)});
  }
}

// Author assertions: doc comments. Deliberately a SEPARATE bucket.
// getLeadingCommentRanges returns the SAME range for several nested nodes, so
// dedupe by absolute position or one comment is reported many times over.
const seenCommentPos = new Set();
const visitDocs = (n) => {
  const ranges = ts.getLeadingCommentRanges(text, n.pos) || [];
  for (const r of ranges) {
    if (seenCommentPos.has(r.pos)) continue;
    const body = text.slice(r.pos, r.end).trim();
    if (body.startsWith('/**') || body.startsWith('//')) {
      seenCommentPos.add(r.pos);
      derived.authorAssertions.push({
        attachedTo: n.name?.getText?.(sf) ?? '<file-level>',
        kind: body.startsWith('/**') ? 'jsdoc-block' : 'line-comment',
        line: sf.getLineAndCharacterOfPosition(r.pos).line + 1,
        text: body,
        evidenceClass: 'AUTHOR_ASSERTION',
        enforceableByCompiler: false,
      });
    }
  }
  ts.forEachChild(n, visitDocs);
};
visitDocs(sf);

derived.compilerCannotEstablish = [
  'That repeat() enforces its documented "nonnegative safe integer" precondition.',
  'That any exported function is total, pure, or side-effect free in the presence of a hostile caller.',
  'That classify() is exhaustive over all inputs, including NaN and +/-Infinity.',
  'That accumulate() has any documented contract at all (it carries no doc comment).',
  'The intent, business purpose or correctness of any declaration.',
];

console.log(JSON.stringify(derived, null, 2));
