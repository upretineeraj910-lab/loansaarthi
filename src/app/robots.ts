import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1. Aggressive scrapers aur commercial SEO bots ko completely block karein
      {
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "DotBot",
          "PetalBot",
          "Bytespider",
          "ClaudeBot",
          "GPTBot",
          "CCBot",
          "meta-externalagent",
          "Meta-ExternalAgent",
        ],
        disallow: "/",
      },
      // 2. Legitimate search engines (Google, Bing, etc.) ke liye rules
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",            // Next.js internal static assets & prefetch chunks
          "/crm/",
          "/lead/",
          "/dashboard/",
          "/shared-form/",
          "/*?*",               // Query parameters crawl karne se roke (reduces 50%+ duplicate hits)
        ],
        crawlDelay: 5,         // Aggressive requests par throttle lagaye
      },
    ],
    sitemap: "https://www.loansaarthi.com/sitemap.xml",
  };
}