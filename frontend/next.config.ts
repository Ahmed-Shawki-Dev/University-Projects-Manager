import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.loca.lt",
    "*.ngrok-free.app",
    "fancy-chicken-show.loca.lt",
    "*.trycloudflare.com",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
