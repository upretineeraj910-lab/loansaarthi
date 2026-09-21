import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/crm",
          "/crm/",
          "/crm/*",
          "/lead",
          "/lead/",
          "/lead/*",
          "/dashboard",
          "/dashboard/",
          "/dashboard/*",
          "/shared-form",
          "/shared-form/",
          "/shared-form/*",
        ],
      },
    ],
    sitemap: "https://www.loansaarthi.com/sitemap.xml",
  };
}

