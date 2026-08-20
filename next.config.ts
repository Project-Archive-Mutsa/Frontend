import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBaseUrl = process.env.API_BASE_URL?.replace(/\/+$/, "");

    if (!apiBaseUrl) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "attcpbgmbomcmybhsxuh.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/project-archive-assets/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
