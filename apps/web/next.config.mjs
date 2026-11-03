/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@foodlens/core'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.openfoodfacts.org' },
      { protocol: 'https', hostname: 'static.openfoodfacts.org' },
      { protocol: 'https', hostname: 'world.openfoodfacts.org' },
    ],
  },
};

export default nextConfig;

