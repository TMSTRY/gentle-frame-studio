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
    ];
  },
};

export default nextConfig;
