/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  // Set server-only modules so they don't get included in client bundles
  experimental: {
    serverComponentsExternalPackages: ["mysql2"],
  },
  // Set webpack config to ignore Node.js modules in client-side code
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to load these server-only modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        dns: false,
        child_process: false,
        path: false,
        stream: false,
        crypto: false
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
