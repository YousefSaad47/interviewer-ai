import type { PrismaClient } from "@/generated/client";

export abstract class AbstractService {
  public constructor(protected readonly prisma: PrismaClient) {}
}
