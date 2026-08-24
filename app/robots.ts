import type { MetadataRoute } from "next";

const SITE_URL = "https://forrelief.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",

        allow: "/",

        disallow: [
          "/admin/",
          "/api/",
          "/account/",
          "/login/",
          "/forgot-password/",
          "/reset-password/",
          "/verify-email/",
          "/cart/",
        ],
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" }, // Common Crawl (بيغذي كتير AI models)
    ],

    sitemap:
      `${SITE_URL}/sitemap.xml`,

    host: SITE_URL,
  };
}