/** @type {import('next').NextConfig} */
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://identitytoolkit.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://*.googleusercontent.com https://avatars.githubusercontent.com https://maps.googleapis.com https://maps.gstatic.com",
      "connect-src 'self' https://openrouter.ai https://*.firebaseio.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://fcmregistrations.googleapis.com https://*.algolia.net https://*.algolianet.com https://*.ingest.sentry.io https://vision.googleapis.com https://safebrowsing.googleapis.com https://translation.googleapis.com",
      "frame-src 'self' https://docs.google.com https://www.google.com https://accounts.google.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ]
      .join("; ")
      .replace(/\s{2,}/g, " ")
      .trim(),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // ─── Performance / Efficiency ────────────────────────────────────────────────
  compress: true,                          // gzip responses
  swcMinify: true,                         // SWC-based minifier (faster + smaller)

  // Tree-shake large icon/UI libraries to only include used exports
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}",
      skipDefaultConversion: true,
    },
  },

  // Optimise Next.js image handling
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lqbualpzgkdqizugkqsz.supabase.co" },
    ],
    minimumCacheTTL: 3600,
  },

  // Experiment: app directory, optimised CSS, server actions
  experimental: {
    optimizeCss: false,                    // off for now — requires critters peer dep
    serverComponentsExternalPackages: [
      "@prisma/client",
      "pdf-parse",
      "mammoth",
      "@react-pdf/renderer",
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Cache static assets aggressively
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Cache public assets
      {
        source: "/(.*)\\.(ico|png|svg|jpg|jpeg|webp|avif|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },

  webpack: (config) => {
    // Binary / canvas fallbacks for pdf-parse
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
