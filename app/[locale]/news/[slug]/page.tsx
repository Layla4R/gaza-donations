import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { getSupabase } from "@/lib/supabase";
import {
  LOCALES,
  loadTranslations,
} from "@/lib/i18n";

export const revalidate = 300;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://forrelief.org";

function cleanText(
  value: unknown
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getPostWithTranslation(
  slug: string,
  locale: string
) {
  const supabase =
    getSupabase();

  const {
    data: post,
  } = await supabase
    .from("NewsPost")
    .select("*")
    .eq("slug", slug)
    .eq(
      "isPublished",
      true
    )
    .maybeSingle();

  if (!post) {
    return null;
  }

  let displayTitle =
    post.title;

  let displayExcerpt =
    post.excerpt;

  let displayBody =
    post.body;

  if (locale !== "ar") {
    const {
      data: translation,
    } = await supabase
      .from(
        "NewsPostTranslation"
      )
      .select(
        "title, excerpt, body"
      )
      .eq(
        "postId",
        post.id
      )
      .eq(
        "locale",
        locale
      )
      .maybeSingle();

    if (translation) {
      displayTitle =
        translation.title ||
        post.title;

      displayExcerpt =
        translation.excerpt ||
        post.excerpt;

      displayBody =
        translation.body ||
        post.body;
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
  const post =
    await getPostWithTranslation(
      params.slug,
      params.locale
    );

  if (!post) {
    return {};
  }

  const url =
    `${SITE_URL}/${params.locale}/news/${post.slug}`;

  const image =
    post.coverImage ||
    `${SITE_URL}/brand/og-image.png`;

  const title =
    cleanText(
      post.displayTitle
    );

  const description =
    cleanText(
      post.displayExcerpt
    ) ||
    cleanText(
      post.displayBody
    ).slice(0, 160);

  return {
    title,

    description,

    alternates: {
      canonical: url,

      languages: Object.fromEntries(
        LOCALES.map(
          (locale) => [
            locale,
            `${SITE_URL}/${locale}/news/${post.slug}`,
          ]
        )
      ),
    },

    openGraph: {
      type: "article",

      url,

      siteName: "4Relief",

      title,

      description,

      publishedTime:
        post.publishedAt,

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
      card:
        "summary_large_image",

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
  const {
    slug,
    locale,
  } = params;

  const [
    post,
    dict,
  ] = await Promise.all([
    getPostWithTranslation(
      slug,
      locale
    ),

    loadTranslations(
      locale
    ),
  ]);

  if (!post) {
    notFound();
  }

  const displayTitle =
    cleanText(
      post.displayTitle
    );

  const displayExcerpt =
    cleanText(
      post.displayExcerpt
    );

  const displayBody =
    post.displayBody || "";

  const p =
    locale === "ar"
      ? ""
      : `/${locale}`;

  const dateLocale =
    locale === "ar"
      ? "ar-EG"
      : locale === "tr"
      ? "tr-TR"
      : locale === "fr"
      ? "fr-FR"
      : "en-GB";

  const pageUrl =
    `${SITE_URL}/${locale}/news/${post.slug}`;

  const breadcrumbSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    "@id":
      `${pageUrl}/#breadcrumb`,

    itemListElement: [
      {
        "@type":
          "ListItem",

        position: 1,

        name:
          locale === "ar"
            ? "الرئيسية"
            : locale === "tr"
            ? "Ana Sayfa"
            : locale === "fr"
            ? "Accueil"
            : "Home",

        item:
          `${SITE_URL}/${locale}`,
      },

      {
        "@type":
          "ListItem",

        position: 2,

        name:
          locale === "ar"
            ? "الأخبار"
            : locale === "tr"
            ? "Haberler"
            : locale === "fr"
            ? "Actualités"
            : "News",

        item:
          `${SITE_URL}/${locale}/news`,
      },

      {
        "@type":
          "ListItem",

        position: 3,

        name:
          displayTitle,

        item:
          pageUrl,
      },
    ],
  };

  const articleSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "Article",

    "@id":
      `${pageUrl}/#article`,

    headline:
      displayTitle,

    description:
      displayExcerpt ||
      cleanText(
        displayBody
      ).slice(0, 160),

    image:
      post.coverImage
        ? [post.coverImage]
        : [
            `${SITE_URL}/brand/og-image.png`,
          ],

    datePublished:
      post.publishedAt,

    dateModified:
      post.updatedAt ||
      post.publishedAt,

    inLanguage:
      locale,

    mainEntityOfPage: {
      "@type":
        "WebPage",

      "@id":
        pageUrl,
    },

    author: {
      "@type":
        "Organization",

      "@id":
        `${SITE_URL}/#organization`,

      name:
        "4Relief Humanitarian Foundation",
    },

    publisher: {
      "@type":
        "Organization",

      "@id":
        `${SITE_URL}/#organization`,

      name:
        "4Relief Humanitarian Foundation",

      logo: {
        "@type":
          "ImageObject",

        url:
          `${SITE_URL}/logo.png`,
      },
    },

    about: {
      "@id":
        `${SITE_URL}/#organization`,
    },

    breadcrumb: {
      "@id":
        `${pageUrl}/#breadcrumb`,
    },
  };

  const safeJsonLd = (
    data: unknown
  ) =>
    JSON.stringify(data)
      .replace(
        /</g,
        "\\u003c"
      );

  return (
    <article className="mx-auto max-w-screen-xl px-6 py-16">

      {/* Article Schema */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            safeJsonLd(
              articleSchema
            ),
        }}
      />

      {/* Breadcrumb Schema */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            safeJsonLd(
              breadcrumbSchema
            ),
        }}
      />

      {post.coverImage && (
        <div className="relative mb-8 h-64 overflow-hidden rounded-2xl bg-beige shadow-xl sm:h-96">

          <Image
            src={
              post.coverImage
            }
            alt={
              displayTitle
            }
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority
          />

        </div>
      )}

      <time
        dateTime={
          new Date(
            post.publishedAt
          ).toISOString()
        }
        className="mb-3 block text-sm text-muted"
      >
        {new Date(
          post.publishedAt
        ).toLocaleDateString(
          dateLocale,
          {
            year:
              "numeric",

            month:
              "long",

            day:
              "numeric",
          }
        )}
      </time>

      <h1 className="mb-6 font-display text-3xl font-extrabold leading-snug text-ink sm:text-4xl">
        {displayTitle}
      </h1>

      {displayExcerpt && (
        <p className="mb-8 border-s-4 border-brand ps-4 text-lg italic leading-relaxed text-muted">
          {displayExcerpt}
        </p>
      )}

      <div
        className="prose prose-lg max-w-none leading-loose text-ink/80"
        dangerouslySetInnerHTML={{
          __html:
            displayBody
              .split("\n")
              .join("<br/>"),
        }}
      />

      <div className="mt-12 border-t border-line pt-8">

        <Link
          href={`${p}/news`}
          className="font-semibold text-brand hover:underline"
        >
          {dict[
            "news.back"
          ]}
        </Link>

      </div>

    </article>
  );
}