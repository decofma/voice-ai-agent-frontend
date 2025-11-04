// frontend/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... outras configurações

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8000/api/v1/:path*', // ESTE DEVE SER O DESTINO!
      },
    ];
  },
};

export default nextConfig;