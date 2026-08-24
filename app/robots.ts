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
    ],

    sitemap:
      `${SITE_URL}/sitemap.xml`,

    host: SITE_URL,
  };
}