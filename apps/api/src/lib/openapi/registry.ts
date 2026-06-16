/** biome-ignore-all lint/suspicious/noExplicitAny: <> */

import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";

export const registry = new OpenAPIRegistry();

const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

type Method =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "head"
  | "options"
  | "trace";

type Options = {
  tags: string[];
  method: Method;
  path: string;
  summary: string;
  bodySchema?: any;
  paramsSchema?: any;
  querySchema?: any;
  headersSchema?: any;
  authType?: "bearerAuth";
  statusCode: number;
  responseDescription: string;
};

export const registerPath = (options: Options) => {
  const {
    tags,
    method,
    path,
    summary,
    bodySchema,
    paramsSchema,
    querySchema,
    headersSchema,
    authType,
    statusCode,
    responseDescription,
  } = options;

  let security: [{ [key: string]: string[] }] | undefined;

  if (authType === "bearerAuth") {
    security = [{ [bearerAuth.name]: [] }];
  }

  registry.registerPath({
    tags,
    method,
    path,
    summary,
    ...(security && { security }),
    request: {
      ...(bodySchema && {
        body: { content: { "application/json": { schema: bodySchema } } },
      }),
      ...(paramsSchema && { params: paramsSchema }),
      ...(querySchema && { query: querySchema }),
      ...(headersSchema && { headers: headersSchema }),
    },
    responses: {
      [statusCode]: {
        description: responseDescription,
      },
    },
  });
};

export const createOpenAPIDocument = () => {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Interviewer AI API",
      version: "1.0.0",
      description: "API documentation for Interviewer AI",
    },
    servers: [{ url: "/api", description: "API server" }],
  });
};
