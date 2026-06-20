import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:4000/api/:path*",
    },
  ],
};

export default nextConfig;
