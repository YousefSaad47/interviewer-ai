export function encodeCursor(id: string, createdAt: string): string {
  return Buffer.from(JSON.stringify({ id, createdAt })).toString("base64url");
}

export function decodeCursor(cursor: string): {
  id: string;
  createdAt: string;
} {
  const decoded = Buffer.from(cursor, "base64url").toString("utf-8");
  const parsed = JSON.parse(decoded) as { id: string; createdAt: string };
  if (!parsed.id || !parsed.createdAt) {
    throw new Error(`Invalid cursor: ${cursor}`);
  }
  return parsed;
}
