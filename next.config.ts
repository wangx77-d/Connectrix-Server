import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Disable client-side features since we're only doing API
    typescript: {
        ignoreBuildErrors: true, // Optional: if you want to ignore TS errors during build
    },
    // Disable page optimization since we're only serving API routes
    optimizeFonts: false,
    images: {
        unoptimized: true,
    },
    // Disable unnecessary features
    compress: false,
    poweredByHeader: false,

    // Set a static BUILD_ID
    generateBuildId: async () => {
        return 'static-build-id'; // Replace with a unique but static ID
    },

    webpack: (config: any) => {
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            '@': path.resolve(__dirname, 'src'), // Map `@` to the `src` directory
        };
        return config;
    },
};

module.exports = nextConfig;
