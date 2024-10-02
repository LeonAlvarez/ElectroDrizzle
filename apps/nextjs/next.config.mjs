/** @type {import('next').NextConfig} */
const nextConfig = {
  //swcMinify: false,
  transpilePackages: [
    "@electric-sql/pglite-react",
    "@electric-sql/pglite-repl",
    "@electric-sql/pglite",
  ],
  reactStrictMode: false,
};

export default nextConfig;
