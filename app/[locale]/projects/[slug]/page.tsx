import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSupabaseOrNull } from "@/lib/supabase";
import { LOCALES, loadTranslations } from "@/lib/i18n";
import ProjectArticleLayout from "@/components/site/ProjectArticleLayout";

export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://forrelief.org";

function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parseGalleryImages(galleryData: any): string[] {
  if (!galleryData) return [];
  if (Array.isArray(galleryData)) {
    return galleryData.filter((item) => typeof item === "string" && item.trim() !== "");
  }
  if (typeof galleryData === "string") {
    try {
      const parsed = JSON.parse(galleryData);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === "string" && item.trim() !== "");
      }
    } catch {
      if (galleryData.startsWith("http")) return [galleryData];
    }
  }
  return [];
}

async function getProjectData(slug: string, locale: string) {
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;

  // تنظيف الـ slug للبحث المرن بوجود البادئة أو بدونها
  const cleanSlug = slug.replace(/^projects\//, "");
  const possibleSlugs = [cleanSlug, `projects/${cleanSlug}`];

  // 1. البحث بجدول الصفحات Page
  const { data: page } = await supabase
    .from("Page")
    .select("*")
    .in("slug", possibleSlugs)
    .maybeSingle();

  let project: any = null;
  let isCampaign = false;

  if (page) {
    project = {
      id: page.id,
      slug: page.slug,
      title: page.title,
      excerpt: page.description || page.excerpt || "",
      body: page.body || page.content || "",
      body2: page.body2 || "",
      coverImage: page.coverImage || page.image || null,
      secondaryImage: page.secondaryImage || null,
      gallery: parseGalleryImages(page.gallery),
      videoUrl: page.videoUrl || null,
      publishedAt: page.createdAt || page.created_at || new Date().toISOString(),
      updatedAt: page.updatedAt || page.updated_at || new Date().toISOString(),
    };
  } else {
    // 2. البحث بجدول الحملات Campaign كبديل
    const { data: campaign } = await supabase
      .from("Campaign")
      .select("*")
      .in("slug", possibleSlugs)
      .maybeSingle();

    if (campaign) {
      isCampaign = true;
      project = {
        id: campaign.id,
        slug: campaign.slug,
        title: campaign.title,
        excerpt: campaign.description || campaign.excerpt || "",
        body: campaign.body || campaign.description || "",
        body2: campaign.body2 || "",
        coverImage: campaign.coverImage || campaign.image || null,
        secondaryImage: campaign.secondaryImage || null,
        gallery: parseGalleryImages(campaign.gallery),
        videoUrl: campaign.videoUrl || null,
        publishedAt: campaign.createdAt || campaign.created_at || new Date().toISOString(),
        updatedAt: campaign.updatedAt || campaign.updated_at || new Date().toISOString(),
      };
    }
  }

  if (!project) return null;

  // 3. جلب الترجمات إن كانت اللغة غير العربية
  if (locale !== "ar") {
    const table = isCampaign ? "CampaignTranslation" : "PageTranslation";
    const foreignKey = isCampaign ? "campaignId" : "pageId";

    const { data: translation } = await supabase
      .from(table)
      .select("*")
      .eq(foreignKey, project.id)
      .eq("locale", locale)
      .maybeSingle();

    if (translation) {
      if (translation.title) project.title = translation.title;
      if (translation.description || translation.excerpt) {
        project.excerpt = translation.description || translation.excerpt;
      }
      if (translation.body || translation.content) {
        project.body = translation.body || translation.content;
      }
      if (translation.body2) project.body2 = translation.body2;
      if (translation.videoUrl) project.videoUrl = translation.videoUrl;
    }
  }

  return { project, isCampaign };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const data = await getProjectData(params.slug, params.locale);
  if (!data) return {};

  const { project } = data;
  const title = `${cleanText(project.title)} | 4Relief`;
  const description = cleanText(project.excerpt) || cleanText(project.body).slice(0, 160);
  const cleanSlug = project.slug.replace(/^projects\//, "");
  const url = `${SITE_URL}/${params.locale}/projects/${cleanSlug}`;
  const image = project.coverImage || `${SITE_URL}/brand/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${SITE_URL}/${l}/projects/${cleanSlug}`])
      ),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "4Relief",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const { slug, locale } = params;

  const [data, dict] = await Promise.all([
    getProjectData(slug, locale),
    loadTranslations(locale),
  ]);

  if (!data) {
    notFound();
  }

  const { project, isCampaign } = data;
  const isAr = locale === "ar";
  const p = isAr ? "" : `/${locale}`;
  const cleanSlug = project.slug.replace(/^projects\//, "");
  const pageUrl = `${SITE_URL}/${locale}/projects/${cleanSlug}`;

  // Schema.org Structured Data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict["nav.home"] || (isAr ? "الرئيسية" : "Home"),
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict["nav.projects"] || (isAr ? "المشاريع الإنسانية" : "Projects"),
        item: `${SITE_URL}/${locale}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      <ProjectArticleLayout
        data={{
          title: project.title,
          excerpt: project.excerpt,
          body: project.body,
          body2: project.body2,
          coverImage: project.coverImage,
          secondaryImage: project.secondaryImage,
          gallery: project.gallery,
          videoUrl: project.videoUrl,
          publishedAtISO: project.publishedAt,
          updatedAtISO: project.updatedAt,
          authorName: isAr ? "فريق المتابعة والتوثيق الميداني" : "Field Monitoring Team",
          trustBadge: isAr ? "مشروع إغاثي موثق ميدانياً | شفافية 100%" : "Verified Field Project | 100% Audited",
        }}
        context={{
          locale,
          dict,
          isAr,
          brandName: "4Relief",
          backLink: `${p}/projects`,
          backText: dict["projects.back"] || (isAr ? "العودة إلى المشاريع" : "Back to Projects"),
          categoryLabel: isAr ? "مشروع إغاثي تنموي" : "Relief Project",
          donateUrl: isCampaign ? `${p}/donate?campaign=${cleanSlug}` : `${p}/donate`,
        }}
      />
    </>
  );
}