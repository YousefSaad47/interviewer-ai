import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginFaker } from "@kubb/plugin-faker";
import { pluginMsw } from "@kubb/plugin-msw";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";

export default defineConfig({
  root: ".",
  input: {
    path: "http://localhost:3000/api/openapi.json",
    // path: "openapi.yml",
  },
  output: {
    path: "./__generated__",
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: { path: "models" },
    }),
    pluginClient({
      output: { path: "clients" },
    }),
    pluginReactQuery({
      output: { path: "hooks" },
    }),
    pluginZod({
      output: { path: "zod" },
    }),
    pluginFaker({
      output: { path: "mocks" },
    }),
    pluginMsw({
      output: { path: "msw" },
    }),
  ],
});
