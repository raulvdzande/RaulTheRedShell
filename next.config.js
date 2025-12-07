/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix source map issues in Bun + Turbopack
  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
  },

  // Activates empty turbopack config so it doesn't complain
  turbopack: {},

  // Make sure source maps are disabled completely
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;