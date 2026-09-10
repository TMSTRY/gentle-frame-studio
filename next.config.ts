import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@react-pdf/renderer"],
  // pdfkit loads its built-in font data through computed paths that
  // file tracing can't follow; ship the whole package with the PDF routes.
  outputFileTracingIncludes: {
    "/admin/documents/[id]/pdf": ["./node_modules/pdfkit/**/*", "./node_modules/@react-pdf/**/*", "./node_modules/fontkit/**/*"],
    "/portal/documents/[id]/pdf": ["./node_modules/pdfkit/**/*", "./node_modules/@react-pdf/**/*", "./node_modules/fontkit/**/*"],
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];
    return [
      { source: "/(.*)", headers: security },
      // Private zones are never cached by anything in between.
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
      { source: "/portal/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
    ];
  },
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
