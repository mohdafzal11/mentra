/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "porta-id.xyz",
      },
    ],
  },
};

export default nextConfig;
