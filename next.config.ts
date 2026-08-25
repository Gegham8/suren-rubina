import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.20.10.3', '192.168.14.86'],
  images: {
    // Serve AVIF where supported, WebP otherwise.
    formats: ['image/avif', 'image/webp'],
    // Phone-first invite: no need for desktop-monitor variants.
    deviceSizes: [360, 414, 640, 750, 828, 1080],
    imageSizes: [64, 96, 128, 256, 384],
    // Wedding assets never change once shipped — cache for 30 days.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
