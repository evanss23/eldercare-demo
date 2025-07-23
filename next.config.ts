import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['framer-motion'],
  experimental: {
    esmExternals: 'loose'
  }
};

export default nextConfig;
