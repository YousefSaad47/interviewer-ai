import { PrismaPg } from "@prisma/adapter-pg";
import chalk from "chalk";

import { env } from "../core/env";
import { PrismaClient } from "../generated/client";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

prisma.$connect().then(() => {
  console.log(chalk.green("Connected to database"));
});
