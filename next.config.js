/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_HUGGING_FACE_API_KEY: process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY,
    NEXT_PUBLIC_AI_FEATURES_ENABLED: process.env.NEXT_PUBLIC_AI_FEATURES_ENABLED || 'true',
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https: wss: https://api-inference.huggingface.co https://huggingface.co",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "frame-src 'self' https:",
              "media-src 'self' data: blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/ai/:path*',
        destination: '/api/ai/:path*',
      },
    ]
  },
}

module.exports = nextConfig