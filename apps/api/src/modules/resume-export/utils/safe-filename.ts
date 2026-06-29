export function safeFilename(fullName: string): string {
  const sanitized = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return sanitized ? `${sanitized}-resume.pdf` : "resume.pdf";
}
