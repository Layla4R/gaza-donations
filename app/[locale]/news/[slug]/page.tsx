import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { getSupabase } from "@/lib/supabase";
import { LOCALES, loadTranslations } from "@/lib/i18n";
import Icon from "@/components/icons";

export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://forrelief.org";

function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseAdminDateToISO(dateVal: any): string {
  if (!dateVal) return new Date().toISOString();

  const parsed = new Date(dateVal);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  try {
    const str = String(dateVal).trim();
    const match = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (match) {
      const [, month, day, year] = match;
      return new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`).toISOString();
    }
  } catch {
    // Fallback
  }

  return new Date().toISOString();
}

async function getPostWithTranslation(slug: string, locale: string) {
  const supabase = getSupabase();

  const { data: post } = await supabase
    .from("NewsPost")
    .select("*")
    .eq("slug", slug)
    .eq("isPublished", true)
    .maybeSingle();

  if (!post) {
    return null;
  }

  let displayTitle = post.title;
  let displayExcerpt = post.excerpt;
  let displayBody = post.body;

  if (locale !== "ar") {
    const { data: translation } = await supabase
      .from("NewsPostTranslation")
      .select("title, excerpt, body")
      .eq("postId", post.id)
      .eq("locale", locale)
      .maybeSingle();

    if (translation) {
      displayTitle = translation.title || post.title;
      displayExcerpt = translation.excerpt || post.excerpt;
      displayBody = translation.body || post.body;
    }
  }

  return {
    ...post,
    displayTitle,
    displayExcerpt,
    displayBody,
  };
}

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
    locale: string;
  };
}): Promise<Metadata> {
  const post = await getPostWithTranslation(params.slug, params.locale);

  if (!post) {
    return {};
  }

  const url = `${SITE_URL}/${params.locale}/news/${post.slug}`;
  const image = post.coverImage || `${SITE_URL}/brand/og-image.png`;
  const title = cleanText(post.displayTitle);
  const description =
    cleanText(post.displayExcerpt) ||
    cleanText(post.displayBody).slice(0, 160);

  // 🌟 فصل تاريخ النشر المخصص عن تاريخ التحديث
  const rawPublishedDate = post.publishedAt || post.published_at || post.createdAt || post.created_at;
  const publishedDateISO = parseAdminDateToISO(rawPublishedDate);

  const rawUpdatedDate = post.updatedAt || post.updated_at;
  const updatedDateISO = rawUpdatedDate
    ? parseAdminDateToISO(rawUpdatedDate)
    : new Date().toISOString(); // يعتمد تاريخ اليوم في حال التعديل

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        LOCALES.map((locale) => [
          locale,
          `${SITE_URL}/${locale}/news/${post.slug}`,
        ])
      ),
    },
    openGraph: {
      type: "article",
      url,
      siteName: "4Relief",
      title,
      description,
      publishedTime: publishedDateISO,
      modifiedTime: updatedDateISO,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function NewsPostPage({
  params,
}: {
  params: {
    slug: string;
    locale: string;
  };
}) {
  const { slug, locale } = params;

  const [post, dict] = await Promise.all([
    getPostWithTranslation(slug, locale),
    loadTranslations(locale),
  ]);

  if (!post) {
    notFound();
  }

  const displayTitle = cleanText(post.displayTitle);
  const displayExcerpt = cleanText(post.displayExcerpt);
  const displayBody = post.displayBody || "";

  const p = locale === "ar" ? "" : `/${locale}`;

  const isAr = locale === "ar";
  const isEn = locale === "en";
  const isTr = locale === "tr";
  const isFr = locale === "fr";

  // 🌟 تاريخ النشر المالي المحدد من الأدمن
  const rawPublishedDate = post.publishedAt || post.published_at || post.createdAt || post.created_at;
  const publishedDateISO = parseAdminDateToISO(rawPublishedDate);

  // 🌟 تاريخ التحديث: يُقرأ من DB أو يُحدد بتاريخ اليوم التلقائي
  const rawUpdatedDate = post.updatedAt || post.updated_at;
  const updatedDateISO = rawUpdatedDate
    ? parseAdminDateToISO(rawUpdatedDate)
    : new Date().toISOString();

  const txtWrittenBy = isEn
    ? "Written & Verified by:"
    : isTr
    ? "Yazan & Doğrulayan:"
    : isFr
    ? "Rédigé et vérifié par:"
    : "حرره ووثّقه:";

  const txtAuthorName =
    post.authorName ||
    post.author_name ||
    (isEn
      ? "4Relief Field Editorial Team"
      : isTr
      ? "4Relief Saha Editör Ekibi"
      : isFr
      ? "Équipe de Rédaction 4Relief"
      : "فريق التحرير الميداني — 4Relief");

  const txtTrustBadge =
    post.authorRole ||
    post.author_role ||
    (isEn
      ? "Registered Independent NGO | Verified Field Report"
      : isTr
      ? "Kayıtlı Bağımsız STK | Doğrulanmış Saha Raporu"
      : isFr
      ? "ONG indépendante enregistrée | Rapport de terrain vérifié"
      : "منظمة إنسانية مسجلة ومستقلة | تقرير ميداني موثق 100%");

  const txtPublishedAt = isEn
    ? "Published:"
    : isTr
    ? "Yayınlanma:"
    : isFr
    ? "Publié:"
    : "تاريخ النشر:";

  const txtUpdatedAt = isEn
    ? "Last Updated:"
    : isTr
    ? "Son Güncelleme:"
    : isFr
    ? "Dernière mise à jour:"
    : "آخر تحديث:";

  const pageUrl = `${SITE_URL}/${locale}/news/${post.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}/#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isAr ? "الرئيسية" : isTr ? "Ana Sayfa" : isFr ? "Accueil" : "Home",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isAr ? "الأخبار" : isTr ? "Haberler" : isFr ? "Actualités" : "News",
        item: `${SITE_URL}/${locale}/news`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: displayTitle,
        item: pageUrl,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${pageUrl}/#article`,
    headline: displayTitle,
    description: displayExcerpt || cleanText(displayBody).slice(0, 160),
    image: post.coverImage ? [post.coverImage] : [`${SITE_URL}/brand/og-image.png`],
    datePublished: publishedDateISO,
    dateModified: updatedDateISO,
    inLanguage: locale,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    author: {
      "@type": "Organization",
      name: txtAuthorName,
      url: `${SITE_URL}/${locale}/about`,
    },
    publisher: {
      "@type": "NGO",
      "@id": `${SITE_URL}/#organization`,
      name: "4Relief Humanitarian Foundation",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand/logo.png`,
      },
    },
    about: {
      "@id": `${SITE_URL}/#organization`,
    },
    breadcrumb: {
      "@id": `${pageUrl}/#breadcrumb`,
    },
  };

  const safeJsonLd = (data: unknown) =>
    JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <article className="mx-auto max-w-screen-xl px-6 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-700"
      >
        <Link href={`${p}/`} className="transition hover:text-brand">
          {dict["nav.home"] || (isAr ? "الرئيسية" : "Home")}
        </Link>
        <span>/</span>
        <Link href={`${p}/news`} className="transition hover:text-brand">
          {dict["nav.news"] || (isAr ? "الأخبار" : "News")}
        </Link>
        <span>/</span>
        <span className="max-w-xs truncate text-slate-700">{displayTitle}</span>
      </nav>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative mb-8 h-64 overflow-hidden rounded-3xl bg-slate-100 shadow-xl sm:h-[450px]">
          <Image
            src={post.coverImage}
            alt={displayTitle}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Title */}
      <h1 className="mb-6 font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
        {displayTitle}
      </h1>

      {/* 🌟 E-E-A-T Visible Dates & Author Block */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 font-bold text-brand">
            <Icon name="file-text" size={18} />
          </div>
          <div>
            <p className="font-bold text-slate-900">
              {txtWrittenBy} <span className="text-brand">{txtAuthorName}</span>
            </p>
            <p className="text-s text-slate-700">{txtTrustBadge}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-s font-medium text-slate-700">
          <span>
            {txtPublishedAt}{" "}
            <time dateTime={publishedDateISO}>
              {new Date(publishedDateISO).toLocaleDateString(locale)}
            </time>
          </span>
          <span>
            {txtUpdatedAt}{" "}
            <time dateTime={updatedDateISO}>
              {new Date(updatedDateISO).toLocaleDateString(locale)}
            </time>
          </span>
        </div>
      </div>

      {/* Direct Answer / AI Summary Box */}
      {displayExcerpt && (
        <section
          aria-label="News summary"
          className="mb-10 border-s-4 border-brand bg-brand/5 p-5 rounded-r-2xl text-base leading-relaxed text-slate-800"
        >
          <strong className="block mb-1 text-xs uppercase tracking-wider text-brand font-bold">
            {isEn ? "Summary & Key Highlights" : "ملخص التقرير الميداني"}
          </strong>
          <p className="font-medium italic">{displayExcerpt}</p>
        </section>
      )}

      {/* Article Body */}
      <div
        className="prose prose-lg max-w-none leading-loose text-slate-800"
        dangerouslySetInnerHTML={{
          __html: displayBody.split("\n").join("<br/>"),
        }}
      />

      {/* Back Link */}
      <div className="mt-12 border-t border-slate-100 pt-8">
        <Link
          href={`${p}/news`}
          className="inline-flex items-center gap-2 font-bold text-brand hover:underline text-sm"
        >
          ← {dict["news.back"] || (isAr ? "العودة إلى الأخبار" : "Back to News")}
        </Link>
      </div>
    </article>
  );
}