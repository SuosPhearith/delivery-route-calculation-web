/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows all HTTPS hostnames
      },
      {
        protocol: "http",
        hostname: "**", // Allows all HTTP hostnames
      },
    ],
  },
};

export default nextConfig;
