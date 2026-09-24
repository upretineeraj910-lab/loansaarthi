import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@google-cloud/storage'],

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self';",
          },
        ],
      },
    ];
  },

 async redirects() {
    return [
      {
        source: '/education-loan',
        destination: '/personal-loan',
        permanent: true,
      },
      {
        source: '/overdraft-facility',
        destination: '/dropline-overdraft',
        permanent: true,
      },
      {
        source: '/Contact_Us',
        destination: '/contact-us',
        permanent: true,
      },
      {
        source: '/Credit_card',
        destination: '/credit-card',
        permanent: true,
      },
      // {
      //   source: '/Career',
      //   destination: '/career',
      //   permanent: true,
      // },
    ];
  },

  // Rewrites for clean, SEO-friendly lowercase URLs to existing folders
  async rewrites() {
    return [
      {
        source: '/contact-us',
        destination: '/Contact_Us',
      },
      {
        source: '/credit-card',
        destination: '/Credit_card',
      },
      // {
      //   source: '/career',
      //   destination: '/Career',
      // },
    ];
  },
};

export default nextConfig;