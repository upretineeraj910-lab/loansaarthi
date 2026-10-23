import type { MetadataRoute } from "next";

/**
 * Robots.txt configuration
 * Directs search engine indexers while protecting private and administrative endpoints.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1. Block aggressive commercial crawlers and AI scraping bots
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
      // 2. Indexing rules for search engines (Google, Bing, etc.)
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
          "/*?*",               // Prevent crawling URL query parameters to avoid duplicate hits
        ],
        crawlDelay: 5,         // Throttle rapid crawl requests
      },
    ],
    sitemap: "https://www.loansaarthi.com/sitemap.xml",
  };
}
