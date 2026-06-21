import { createHash } from "node:crypto";
import path from "node:path";

import Parser from "web-tree-sitter";

import { logger } from "@/lib/logger";

let isParserInitialized = false;
const wasmParsersCache = new Map<string, Parser.Language>();

const LANGUAGE_TO_WASM_FILE: Record<string, string> = {
  javascript: "tree-sitter-javascript.wasm",
  typescript: "tree-sitter-typescript.wasm",
  python: "tree-sitter-python.wasm",
  python2: "tree-sitter-python.wasm",
  java: "tree-sitter-java.wasm",
  cpp: "tree-sitter-cpp.wasm",
  "cpp-clang": "tree-sitter-cpp.wasm",
  c: "tree-sitter-c.wasm",
  "c-clang": "tree-sitter-c.wasm",
  csharp: "tree-sitter-c_sharp.wasm",
  go: "tree-sitter-go.wasm",
  ruby: "tree-sitter-ruby.wasm",
  rust: "tree-sitter-rust.wasm",
  php: "tree-sitter-php.wasm",
  swift: "tree-sitter-swift.wasm",
};

async function ensureParserInitialized(): Promise<void> {
  if (!isParserInitialized) {
    await Parser.init();
    isParserInitialized = true;
  }
}

async function getOrLoadLanguage(
  language: string,
  wasmFile: string,
): Promise<Parser.Language | null> {
  if (wasmParsersCache.has(language)) {
    return wasmParsersCache.get(language) as Parser.Language;
  }

  try {
    const wasmPath = path.resolve(
      process.cwd(),
      "node_modules",
      "tree-sitter-wasms",
      "out",
      wasmFile,
    );
    const lang = await Parser.Language.load(wasmPath);
    wasmParsersCache.set(language, lang);
    return lang;
  } catch (err) {
    logger.error({ err, language }, "Failed to load AST WASM");
    return null;
  }
}

async function getParserForLanguage(language: string): Promise<Parser | null> {
  const wasmFile = LANGUAGE_TO_WASM_FILE[language];
  if (!wasmFile) return null;

  await ensureParserInitialized();

  const lang = await getOrLoadLanguage(language, wasmFile);
  if (!lang) return null;

  const parser = new Parser();
  parser.setLanguage(lang);
  return parser;
}

const IDENTIFIER_NODE_TYPES = new Set([
  "identifier",
  "property_identifier",
  "shorthand_property_identifier",
  "shorthand_property_identifier_pattern",
  "type_identifier",
]);

function getCanonicalString(
  node: Parser.SyntaxNode,
  idMap = new Map<string, string>(),
): string {
  if (node.type === "comment") return "";

  if (node.childCount === 0) {
    if (IDENTIFIER_NODE_TYPES.has(node.type)) {
      const name = node.text;
      if (!idMap.has(name)) {
        idMap.set(name, `_${idMap.size}`);
      }
      return idMap.get(name) as string;
    }
    return node.text;
  }

  return node.children
    .map((child) => getCanonicalString(child, idMap))
    .join("");
}

export async function computeAstHash(
  code: string,
  language: string,
): Promise<string | null> {
  const parser = await getParserForLanguage(language);
  if (!parser) return null;

  try {
    const tree = parser.parse(code);
    const canonical = getCanonicalString(tree.rootNode);

    return createHash("sha256").update(canonical).digest("hex");
  } catch (err) {
    logger.error({ err }, "Error computing AST hash");
    return null;
  }
}
