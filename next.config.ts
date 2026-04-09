import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 圧縮有効化
  compress: true,
  
  // 画像最適化
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // CORSの問題を回避するためのリライト設定
  async rewrites() {
    return [
      {
        source: '/api/gemini/:path*',
        destination: 'http://120.75.187.71:2048/:path*',
      },
    ];
  },
};

export default nextConfig;
