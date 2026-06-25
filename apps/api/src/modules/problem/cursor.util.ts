import { z } from "zod";

import { BadRequestException } from "@/common/exceptions";

const cursorPayloadSchema = z.object({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
});

export function encodeCursor(id: string, createdAt: string): string {
  return Buffer.from(JSON.stringify({ id, createdAt })).toString("base64url");
}

export function decodeCursor(cursor: string): {
  id: string;
  createdAt: string;
} {
  try {
    const decoded = Buffer.from(cursor, "base64url").toString("utf-8");
    return cursorPayloadSchema.parse(JSON.parse(decoded));
  } catch {
    throw new BadRequestException(`Invalid cursor: ${cursor}`);
  }
}
