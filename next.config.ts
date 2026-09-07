import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Canonical host: the bare domain. www carries a certificate
      // of its own but always hands visitors over, permanently.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.gentleframestudio.com" }],
        destination: "https://gentleframestudio.com/:path*",
        permanent: true,
      },
      // The original Vercel address keeps working but hands over too.
      {
        source: "/:path*",
        has: [{ type: "host", value: "gentle-frame-studio.vercel.app" }],
        destination: "https://gentleframestudio.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
