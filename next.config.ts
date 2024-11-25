import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Disable client-side features since we're only doing API
    typescript: {
        ignoreBuildErrors: true, // Optional: if you want to ignore TS errors during build
    },
    experimental: {
        optimizeCss: false,
        scrollRestoration: false,
    },
    // Disable page optimization since we're only serving API routes
    optimizeFonts: false,
    images: {
        unoptimized: true,
    },
    // Disable unnecessary features
    compress: false,
    poweredByHeader: false,

    webpack: (config: any) => {
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            '@': path.resolve(__dirname, 'src'), // Map `@` to the `src` directory
        };
        return config;
    },
};

module.exports = nextConfig;
