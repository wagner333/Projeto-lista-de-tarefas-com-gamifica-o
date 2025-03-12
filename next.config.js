/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["randomuser.me"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://taskmaster.hsyst.xyz/api/:path*", // Proxy to API
      },
    ];
  },
};

module.exports = nextConfig;
