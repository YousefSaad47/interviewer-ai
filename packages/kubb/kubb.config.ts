import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import dotenv from "dotenv";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname || "", "../..");
dotenv.config({ path: path.resolve(rootDir, "apps/www/.env") });
dotenv.config({ path: path.resolve(rootDir, "apps/api/.env") });

const apiUrl = process.env["NEXT_PUBLIC_API_URL"] || `http://localhost:${process.env["PORT"] || 8000}`;

export default defineConfig({
  root: ".",
  input: {
    path: `${apiUrl}/api/openapi.json`,
  },
  output: {
    path: "./generated",
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: { path: "models" },
    }),
    pluginClient({
      output: { path: "clients" },
      importPath: "../../client.ts",
    }),
    pluginReactQuery({
      output: { path: "hooks" },
      override: [
        {
          type: "operationId",
          pattern: /^getApiProblems$/,
          options: {
            infinite: {
              queryParam: "cursor",
              initialPageParam: "" as never,
              nextParam: "nextCursor",
            },
          },
        },
      ],
    }),
  ],
});
