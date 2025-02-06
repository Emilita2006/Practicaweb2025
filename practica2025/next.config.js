/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images : {
    domains:["images.unsplash.com"]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias = false,
    };
    return config;
  },
}

module.exports = nextConfig
