import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // picsum.photos was allowed here so the seeded placeholder thumbnails would
    // render. Those rows are gone and no real content points at it, so the host
    // is no longer permitted — an accidental placeholder now fails loudly.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
