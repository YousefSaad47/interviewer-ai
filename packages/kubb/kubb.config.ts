import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";

export default defineConfig({
  root: ".",
  input: {
    path: "http://localhost:4000/api/openapi.json",
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
      infinite: {
        queryParam: "cursor",
        initialPageParam: "" as never,
        nextParam: "nextCursor",
      },
      override: [
        {
          type: "operationId",
          pattern: "getApiProblemsSlug",
          options: {
            infinite: false,
          },
        },
      ],
    }),
  ],
});
