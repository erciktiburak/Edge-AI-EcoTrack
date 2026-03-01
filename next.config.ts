import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["@tremor/react", "recharts"],
  },
};

export default nextConfig;
