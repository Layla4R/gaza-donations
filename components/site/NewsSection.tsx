"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/icons";

interface Post {
  id: string; slug: string; title: string;
  excerpt: string; coverImage?: string | null; publishedAt: string;
}

interface NewsSectionProps {
  posts: Post[];
  locale: string;
  dict: Record<string, string>;
  data?: any;
}

function cleanMarkdown(text: string) {
  if (!text) return "";
  return text.replace(/\*\*(.*?)\*\*/g, '$1');
}

function CardMedia({ videoUrl, image, title }: { videoUrl?: string; image?: string; title: string }) {
  // 1. إذا وُجد فيديو مرفوع أو رابط فيديو
  if (videoUrl) {
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      const embedId = videoUrl.includes("v=")
        ? videoUrl.split("v=")[1]?.split("&")[0]
        : videoUrl.split("/").pop();
      return (
        <iframe
          src={`https://www.youtube.com/embed/${embedId}`}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    // فيديو مرفوع من جهازك (محتوى محلي)
    return (
      <video
        src={videoUrl}
        poster={image || undefined}
        controls
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />
    );
  }

  // 2. إذا وُجدت صورة فقط
  if (image) {
    return (
      <Image
        src={image}
        alt={title || ""}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
    );
  }

  // 3. افتراضي
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-brand/20">
      <Icon name="file-text" size={32} />
    </div>
  );
}

export default function NewsSection({ posts, locale, dict, data }: NewsSectionProps) {
  const p = locale === "ar" ? "" : `/${locale}`;
  const isRTL = locale === "ar";
  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);

  const sectionTitle = data?.title || t("news.title","قصص الأثر والأخبار","Stories of Impact & News","Impact & Actualités","Etki Hikayeleri ve Haberler");
  const sectionEyebrow = data?.subtitle || data?.eyebrow || t("news.eyebrow","من ميدان العمل","From the Field","Du Terrain","Sahadan");

  const adminStories = data?.items || [];
  const hasAdminStories = adminStories.length > 0;
  const displayItems = hasAdminStories ? adminStories : posts;

  const [active, setActive] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (displayItems.length === 0) return null;

  const total = displayItems.length;
  const maxIdx = Math.max(0, total - visibleCount);
  const cardWidthPct = 100 / visibleCount;
  const translateX = -1 * active * cardWidthPct;

  return (
    <section className="py-12 bg-white border-t border-slate-100">
      <div className="max-w-screen-xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-brand font-semibold text-xs tracking-widest uppercase mb-2 px-3 py-1 bg-brand/5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              {sectionEyebrow}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {sectionTitle}
            </h2>
          </div>

          {total > visibleCount && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActive(a => Math.max(0, a - 1))}
                disabled={active === 0}
                className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-brand hover:text-white hover:border-brand disabled:opacity-30 transition-all shadow-sm">
                <Icon name={isRTL ? "arrow-up" : "arrow-down"} size={14} className={isRTL ? "-rotate-90" : "rotate-90"} />
              </button>
              <button
                onClick={() => setActive(a => Math.min(maxIdx, a + 1))}
                disabled={active >= maxIdx}
                className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-brand hover:text-white hover:border-brand disabled:opacity-30 transition-all shadow-sm">
                <Icon name={isRTL ? "arrow-down" : "arrow-up"} size={14} className={isRTL ? "-rotate-90" : "rotate-90"} />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div className="overflow-hidden p-1 -m-1">
          <div
            className="flex transition-transform duration-500 ease-out items-stretch"
            style={{ transform: `translateX(${translateX}%)`, gap: "20px" }}
          >
            {displayItems.map((item: any, i: number) => {
              const key = item.id || i;
              const title = item.title || item.name;
              const rawDesc = hasAdminStories ? (item.body || item.text) : item.excerpt;
              const description = cleanMarkdown(rawDesc);
              const image = hasAdminStories ? (item.image || item.photo) : item.coverImage;
              const videoUrl = item.videoUrl;

              return (
                <div
                  key={key}
                  style={{
                    width: `calc(${cardWidthPct}% - ${(visibleCount - 1) * 20 / visibleCount}px)`,
                    flexShrink: 0,
                  }}
                >
                  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full justify-between">
                    <div>
                      {/* منطقة ميديا الفيديو أو الصورة */}
                      <div className="relative h-52 w-full overflow-hidden bg-slate-900 shrink-0">
                        <CardMedia videoUrl={videoUrl} image={image} title={title} />
                      </div>

                      {/* تفاصيل القصة */}
                      <div className="p-5">
                        <h3 className="font-display font-bold text-base text-slate-900 mb-3 leading-snug">
                          {title}
                        </h3>

                        <div className="text-slate-600 text-xs leading-relaxed max-h-36 overflow-y-auto pr-1 space-y-2 text-justify">
                          {description}
                        </div>
                      </div>
                    </div>

                    {/* زر التبرع */}
                    <div className="p-5 pt-0 mt-auto">
                      <Link
                        href="/donate"
                        className="w-full inline-flex items-center justify-center gap-2 bg-brand hover:opacity-90 text-white font-bold text-xs rounded-xl py-2.5 transition-all shadow-sm"
                      >
                        <Icon name="heart" size={14} />
                        <span>ساهم معنا الآن</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}