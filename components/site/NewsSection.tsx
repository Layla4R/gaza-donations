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

export default function NewsSection({ posts, locale, dict, data }: NewsSectionProps) {
  const p = locale === "ar" ? "" : `/${locale}`;
  const isRTL = locale === "ar";
  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);
  const dateLocale = locale === "ar" ? "ar-EG" : locale === "tr" ? "tr-TR" : locale === "fr" ? "fr-FR" : "en-GB";

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
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-screen-xl mx-auto px-6">
        
        {/* Header with Navigation Controls */}
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

          <div className="flex items-center gap-3">
            {!hasAdminStories && (
              <Link href={`${p}/news`} className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand/80 me-3">
                <span>{t("news.view_all","عرض الكل","View All","Voir Tout","Tümünü Gör")}</span>
                <Icon name={isRTL ? "arrow-left" : "arrow-down"} size={14} className={isRTL ? "" : "-rotate-90"} />
              </Link>
            )}

            {/* Slider Navigation Arrows */}
            {total > visibleCount && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActive(a => Math.max(0, a - 1))}
                  disabled={active === 0}
                  aria-label="Previous"
                  className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-brand hover:text-white hover:border-brand disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all shadow-sm">
                  <Icon name={isRTL ? "arrow-up" : "arrow-down"} size={14} className={isRTL ? "-rotate-90" : "rotate-90"} />
                </button>
                <button
                  onClick={() => setActive(a => Math.min(maxIdx, a + 1))}
                  disabled={active >= maxIdx}
                  aria-label="Next"
                  className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-brand hover:text-white hover:border-brand disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 transition-all shadow-sm">
                  <Icon name={isRTL ? "arrow-down" : "arrow-up"} size={14} className={isRTL ? "-rotate-90" : "rotate-90"} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Container */}
        <div className="overflow-hidden p-1 -m-1">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${translateX}%)`, gap: "20px" }}
          >
            {displayItems.map((item: any, i: number) => {
              const key = item.id || i;
              const title = item.title || item.name;
              const description = hasAdminStories ? (item.body || item.text) : item.excerpt;
              const image = hasAdminStories ? (item.image || item.photo) : item.coverImage;
              const isPost = !hasAdminStories;

              const CardInner = (
                <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  {/* Compact Image */}
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100 shrink-0">
                    {image ? (
                      <Image
                        src={image}
                        alt={title || ""}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50 text-brand/20">
                        <Icon name="file-text" size={32} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {isPost && item.publishedAt && (
                        <p className="text-[11px] text-slate-400 mb-1.5 font-medium">
                          {new Date(item.publishedAt).toLocaleDateString(dateLocale, { year:"numeric", month:"short", day:"numeric" })}
                        </p>
                      )}

                      <h3 className="font-display font-bold text-sm text-slate-900 mb-1.5 line-clamp-1 group-hover:text-brand transition-colors">
                        {title}
                      </h3>

                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                        {description}
                      </p>
                    </div>

                    {isPost && (
                      <div className="pt-3 flex items-center justify-between border-t border-slate-100 mt-3">
                        <span className="text-[11px] font-bold text-brand group-hover:underline">
                          {t("news.read_more","اقرأ المزيد","Read More","Lire la Suite","Devamını Oku")}
                        </span>
                        <Icon name={isRTL ? "arrow-left" : "arrow-down"} size={12} className={`text-brand ${isRTL ? "" : "-rotate-90"}`} />
                      </div>
                    )}
                  </div>
                </div>
              );

              return (
                <div
                  key={key}
                  style={{
                    width: `calc(${cardWidthPct}% - ${(visibleCount - 1) * 20 / visibleCount}px)`,
                    flexShrink: 0,
                  }}
                >
                  {isPost ? <Link href={`${p}/news/${item.slug}`} className="block h-full">{CardInner}</Link> : CardInner}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}