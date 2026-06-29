import { ApiClientError } from "@/services/api-client";

import type { ResumeData } from "../types";

export async function exportResumePdf(
  content: ResumeData,
): Promise<{ blob: Blob; filename: string }> {
  const response = await fetch("/api/resumes/export", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/pdf",
    },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    let errorMessage = "Resume export failed.";
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === "string") {
        errorMessage = errorBody.message;
      }
    } catch {
      // response body was not JSON
    }
    throw new ApiClientError(errorMessage, response.status, null);
  }

  const blob = await response.blob();

  const disposition = response.headers.get("Content-Disposition");
  let filename = "resume.pdf";
  if (disposition) {
    const match = disposition.match(/filename="?([^";\n]+)"?/);
    if (match?.[1]) {
      filename = match[1];
    }
  }

  return { blob, filename };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
