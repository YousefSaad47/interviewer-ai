const LATEX_ESCAPE_MAP: Record<string, string> = {
  "\\": "\\textbackslash{}",
  "&": "\\&",
  "%": "\\%",
  $: "\\$",
  "#": "\\#",
  _: "\\_",
  "{": "\\{",
  "}": "\\}",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}",
};

export function escapeLatex(value: unknown): string {
  const text = value == null ? "" : String(value);
  let result = "";
  for (const char of text) {
    result += LATEX_ESCAPE_MAP[char] ?? char;
  }
  return result;
}

const SAFE_URL_PROTOCOLS = /^https?:\/\/|^mailto:/i;

export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (!SAFE_URL_PROTOCOLS.test(trimmed)) return "";
  return trimmed.replace(/[\\{}%#]/g, "");
}

export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
