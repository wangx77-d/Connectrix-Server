import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    experimental: {},
    // Disable file-system caching
    generateEtags: false,
    // Configure webpack for Lambda
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals = ['aws-sdk'];
        }
        return config;
    },
};

export default nextConfig;
