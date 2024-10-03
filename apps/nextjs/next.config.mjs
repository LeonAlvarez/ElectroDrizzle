/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      serverComponentsExternalPackages: ["@electric-sql/pglite"],
    },
  },
  reactStrictMode: false,
};

export default nextConfig;
