"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/icons";
import CampaignCard from "@/components/blocks/CampaignCard";

interface Campaign {
  id: string; slug: string; title: string; summary: string;
  coverImage?: string | null; goalAmount: number; raisedAmount: number;
  donorCount: number; category?: string; defaultAmount?: number;
}

export default function CampaignsCarousel({ campaigns, locale, dict, data }: {
  campaigns: Campaign[]; locale: string; dict: Record<string, string>; data?: any 
}) {
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

  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);

  const limit = data?.limit ? parseInt(data.limit, 10) : campaigns.length;
  const displayCampaigns = campaigns.slice(0, limit);

  if (displayCampaigns.length === 0) return null;

  const sectionTitle = data?.title || t("campaigns.title", "الحملات النشطة", "Active Campaigns", "Campagnes Actives", "Aktif Kampanyalar");
  const sectionSubtitle = data?.subtitle || t("campaigns.subtitle", "ادعم الحملات الإنسانية واصنع الفرق", "Support humanitarian campaigns and make a difference", "Soutenez les campagnes humanitaires", "İnsani kampanyaları destekleyin");
  const sectionEyebrow = data?.eyebrow || t("campaigns.eyebrow", "اختر الحملة التي تريد دعمها", "Choose a Campaign", "Choisissez une Campagne", "Bir Kampanya Seçin");

  const total = displayCampaigns.length;
  const maxIdx = Math.max(0, total - visibleCount);
  const isRTL = locale === "ar";
  const p = locale === "ar" ? "" : `/${locale}`;

  // 🌟 حاسبة المسافة المحسنة لحساب الـ Shift دون التسبب بإخفاء الكروت
  const offsetPercentage = active * (100 / visibleCount);

  return (
    <section className="py-12 bg-slate-50/60 border-y border-slate-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 text-brand font-semibold text-xs tracking-widest uppercase mb-3 px-3.5 py-1 bg-brand/5 rounded-full border border-brand/10">
            {sectionEyebrow}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {sectionTitle}
          </h2>
          <p className="text-slate-500 text-sm sm:text-lg leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative px-2 sm:px-4">
          
          {/* Previous / Next Navigation Buttons with Accessibility Labels */}
          {active > 0 && (
            <button
              onClick={() => setActive(a => Math.max(0, a - 1))}
              aria-label={t("campaigns.prev", "السابق", "Previous", "Précédent", "Önceki")}
              className={`absolute ${isRTL ? "-right-2 sm:-right-4" : "-left-2 sm:-left-4"} top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-brand hover:text-white hover:border-brand transition-all`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                {isRTL ? <path d="m9 18 6-6-6-6"/> : <path d="m15 18-6-6 6-6"/>}
              </svg>
            </button>
          )}

          {active < maxIdx && (
            <button
              onClick={() => setActive(a => Math.min(maxIdx, a + 1))}
              aria-label={t("campaigns.next", "التالي", "Next", "Suivant", "Sonraki")}
              className={`absolute ${isRTL ? "-left-2 sm:-left-4" : "-right-2 sm:-right-4"} top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-brand hover:text-white hover:border-brand transition-all`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                {isRTL ? <path d="m15 18-6-6 6-6"/> : <path d="m9 18 6-6-6-6"/>}
              </svg>
            </button>
          )}

          {/* Cards Track Box */}
          <div className="overflow-hidden p-1.5">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(${isRTL ? offsetPercentage : -offsetPercentage}%)`,
              }}
            >
              {displayCampaigns.map((c) => (
                <div
                  key={c.id}
                  className="px-2 sm:px-3 shrink-0"
                  style={{
                    width: `${100 / visibleCount}%`,
                  }}
                >
                  <CampaignCard
                    id={c.id}
                    slug={c.slug}
                    title={c.title}
                    summary={c.summary}
                    coverImage={c.coverImage}
                    goalAmount={c.goalAmount}
                    raisedAmount={c.raisedAmount}
                    donorCount={c.donorCount}
                    category={c.category}
                    locale={locale}
                    dict={dict}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Dots Indicators */}
          {total > visibleCount && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Go to slide page ${i + 1}`}
                  className={`rounded-full transition-all ${i === active ? "w-8 h-2.5 bg-brand" : "w-2.5 h-2.5 bg-slate-200 hover:bg-brand/40"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Campaigns Link */}
        <div className="text-center mt-10">
          <Link
            href={`${p}/campaigns`}
            aria-label={t("campaigns.view_all", "عرض جميع الحملات", "View All Campaigns", "Voir Toutes", "Tüm Kampanyalar")}
            className="inline-flex items-center gap-2 border-2 border-brand text-brand hover:bg-brand hover:text-white font-bold rounded-2xl px-8 py-3.5 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            {t("campaigns.view_all", "عرض جميع الحملات", "View All Campaigns", "Voir Toutes", "Tüm Kampanyalar")}
            <Icon name={isRTL ? "arrow-left" : "arrow-down"} size={16} className={isRTL ? "" : "-rotate-90"} />
          </Link>
        </div>

      </div>
    </section>
  );
}