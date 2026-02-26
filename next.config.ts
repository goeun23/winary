import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@toss/tds-mobile",
    "@toss/tds-mobile-ait",
    "@toss/tds-colors",
  ],
};

export default nextConfig;
