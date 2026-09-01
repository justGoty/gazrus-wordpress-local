import type { NextConfig } from "next";
import redirectsData from "./content/catalog/redirects.json";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return redirectsData.redirects;
  },
};

export default nextConfig;
