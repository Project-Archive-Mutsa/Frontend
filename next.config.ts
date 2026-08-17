import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
