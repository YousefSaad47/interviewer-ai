import type { NextConfig } from "next";

// biome-ignore lint/complexity/useLiteralKeys: bracket notation required for tsconfig index signatures
const apiUrl = process.env["NEXT_PUBLIC_API_URL"] || "http://localhost:8000";

const nextConfig: NextConfig = {
  reactCompiler: true,
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `${apiUrl}/api/:path*`,
    },
  ],
};

export default nextConfig;
