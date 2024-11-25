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
};

module.exports = nextConfig;
