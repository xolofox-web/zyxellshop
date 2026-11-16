/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "api.cashi.id",
      },
      {
        protocol: "https",
        hostname: "cashi.id",
      },
    ],
  },
};

module.exports = nextConfig;