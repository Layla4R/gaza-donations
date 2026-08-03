import type { MetadataRoute } from "next";
import { getSupabaseOrNull } from "@/lib/supabase";

export const revalidate = 3600; // revalidate every hour

const LOCALES = ["ar", "en", "fr", "tr"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Static routes — all locales
  const staticPaths = ["", "/campaigns", "/donate", "/news", "/contact"];
  const staticRoutes: MetadataRoute.Sitemap = staticPaths.flatMap(path =>
    LOCALES.map(l => ({
      url: `${siteUrl}/${l}${path}`,
      changeFrequency: path === "" || path === "/campaigns" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1.0 : path === "/campaigns" || path === "/donate" ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map(lang => [lang, `${siteUrl}/${lang}${path}`])
        ),
      },
    }))
  );

  const supabase = getSupabaseOrNull();
  if (!supabase) return staticRoutes;

  try {
    const [pagesRes, campaignsRes, postsRes] = await Promise.all([
      supabase.from("Page").select("slug, updatedAt").eq("isPublished", true),
      supabase.from("Campaign").select("slug, updatedAt").eq("isActive", true),
      supabase.from("NewsPost").select("slug, publishedAt").eq("isPublished", true),
    ]);

    const pageRoutes: MetadataRoute.Sitemap = (pagesRes.data || [])
      .filter((p: any) => p.slug !== "home")
      .flatMap((p: any) =>
        LOCALES.map(l => ({
          url: `${siteUrl}/${l}/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
          changeFrequency: "weekly" as const,
          priority: 0.6,
          alternates: {
            languages: Object.fromEntries(
              LOCALES.map(lang => [lang, `${siteUrl}/${lang}/${p.slug}`])
            ),
          },
        }))
      );

    const campaignRoutes: MetadataRoute.Sitemap = (campaignsRes.data || [])
      .flatMap((c: any) =>
        LOCALES.map(l => ({
          url: `${siteUrl}/${l}/campaigns/${c.slug}`,
          lastModified: c.updatedAt ? new Date(c.updatedAt) : undefined,
          changeFrequency: "daily" as const,
          priority: 0.85,
          alternates: {
            languages: Object.fromEntries(
              LOCALES.map(lang => [lang, `${siteUrl}/${lang}/campaigns/${c.slug}`])
            ),
          },
        }))
      );

    const newsRoutes: MetadataRoute.Sitemap = (postsRes.data || [])
      .flatMap((p: any) =>
        LOCALES.map(l => ({
          url: `${siteUrl}/${l}/news/${p.slug}`,
          lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
          changeFrequency: "weekly" as const,
          priority: 0.65,
          alternates: {
            languages: Object.fromEntries(
              LOCALES.map(lang => [lang, `${siteUrl}/${lang}/news/${p.slug}`])
            ),
          },
        }))
      );

    return [...staticRoutes, ...pageRoutes, ...campaignRoutes, ...newsRoutes];
  } catch {
    return staticRoutes;
  }
}
