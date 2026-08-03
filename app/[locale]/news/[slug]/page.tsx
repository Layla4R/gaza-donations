import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { loadTranslations } from "@/lib/i18n";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = getSupabase();
  const { data: post } = await supabase
    .from("NewsPost")
    .select("title, excerpt, coverImage, slug, publishedAt")
    .eq("slug", params.slug)
    .eq("isPublished", true)
    .maybeSingle();
  if (!post) return {};

  const url = `${siteUrl}/${params.locale}/news/${post.slug}`;
  const image = post.coverImage || `${siteUrl}/brand/og-image.png`;

  return {
    title: post.title,
    description: post.excerpt || "",
    alternates: {
      canonical: url,
      languages: {
        "ar": `${siteUrl}/ar/news/${post.slug}`,
        "en": `${siteUrl}/en/news/${post.slug}`,
        "fr": `${siteUrl}/fr/news/${post.slug}`,
        "tr": `${siteUrl}/tr/news/${post.slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      url,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: [image],
    },
  };
}

export default async function NewsPostPage({ params }: { params: { slug: string; locale: string } }) {
  const { slug, locale } = params;
  const supabase = getSupabase();
  const [postRes, dict] = await Promise.all([
    supabase.from("NewsPost").select("*").eq("slug", slug).eq("isPublished", true).maybeSingle(),
    loadTranslations(locale),
  ]);
  const post = postRes.data;
  if (!post) notFound();

  let displayTitle = post.title;
  let displayExcerpt = post.excerpt;
  let displayBody = post.body;

  if (locale !== "ar") {
    const { data: trans } = await supabase
      .from("NewsPostTranslation")
      .select("title, excerpt, body")
      .eq("postId", post.id)
      .eq("locale", locale)
      .maybeSingle();
    if (trans) {
      displayTitle = trans.title;
      displayExcerpt = trans.excerpt;
      displayBody = trans.body;
    }
  }

  const p = locale === "ar" ? "" : `/${locale}`;
  const dateLocale = locale === "ar" ? "ar-EG" : locale === "tr" ? "tr-TR" : locale === "fr" ? "fr-FR" : "en-GB";

  return (
    <article className="max-w-screen-xl mx-auto px-6 py-16">
      {post.coverImage && (
        <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-beige mb-8 shadow-xl">
          <Image src={post.coverImage} alt={displayTitle} fill className="object-cover" />
        </div>
      )}
      <p className="text-muted text-sm mb-3">{new Date(post.publishedAt).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })}</p>
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-ink mb-6 leading-snug">{displayTitle}</h1>
      <p className="text-lg text-muted leading-relaxed mb-8 border-s-4 border-brand ps-4 italic">{displayExcerpt}</p>
      <div className="prose prose-lg max-w-none text-ink/80 leading-loose" dangerouslySetInnerHTML={{ __html: displayBody.split("\n").join("<br/>") }} />
      <div className="mt-12 pt-8 border-t border-line">
        <Link href={`${p}/news`} className="text-brand hover:underline font-semibold">{dict["news.back"]}</Link>
      </div>
    </article>
  );
}
