import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://forrelief.org";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/ar/account/", "/en/account/", "/fr/account/", "/tr/account/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
