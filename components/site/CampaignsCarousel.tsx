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

export default function CampaignsCarousel({ campaigns, locale, dict , data}: {
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

  if (campaigns.length === 0) return null;

  const total = campaigns.length;
  const maxIdx = Math.max(0, total - visibleCount);
  const isRTL = locale === "ar";
  const cardWidthPct = 100 / visibleCount;
  // Gap compensation: 20px gap / visibleCount cards per view
  // translateX in % of container. Each card is cardWidthPct% wide including gap proportionally.
  // In RTL flex layouts, translateX is ALWAYS negative to go forward
  // (flex-direction is reversed by the browser in RTL, so left scroll = positive direction)
  const translateX = -1 * active * cardWidthPct;
  const p = locale === "ar" ? "" : `/${locale}`;

  return (
    <section className="py-20" style={{ background: "#F0F4FF" }}>
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-brand font-semibold text-xs tracking-[0.3em] uppercase mb-3">
            <span className="w-6 h-px bg-brand/40 inline-block" />
            {t("campaigns.eyebrow", "اختر الحملة التي تريد دعمها", "Choose a Campaign", "Choisissez une Campagne", "Bir Kampanya Seçin")}
            <span className="w-6 h-px bg-brand/40 inline-block" />
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-ink mb-3">
            {t("campaigns.title", "الحملات النشطة", "Active Campaigns", "Campagnes Actives", "Aktif Kampanyalar")}
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            {t("campaigns.subtitle", "ادعم الحملات الإنسانية واصنع الفرق", "Support humanitarian campaigns and make a difference", "Soutenez les campagnes humanitaires", "İnsani kampanyaları destekleyin")}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {active > 0 && (
            <button
              onClick={() => setActive(a => Math.max(0, a - 1))}
              aria-label={isRTL ? t("campaigns.next", "التالي", "Next", "Suivant", "Sonraki") : t("campaigns.prev", "السابق", "Previous", "Précédent", "Önceki")}
              className={`absolute ${isRTL ? "-right-5" : "-left-5"} top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white rounded-full shadow-xl border border-line flex items-center justify-center hover:bg-brand hover:text-white hover:border-brand transition-all`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {isRTL ? <path d="m9 18 6-6-6-6"/> : <path d="m15 18-6-6 6-6"/>}
              </svg>
            </button>
          )}
          {active < maxIdx && (
            <button
              onClick={() => setActive(a => Math.min(maxIdx, a + 1))}
              aria-label={isRTL ? t("campaigns.prev", "السابق", "Previous", "Précédent", "Önceki") : t("campaigns.next", "التالي", "Next", "Suivant", "Sonraki")}
              className={`absolute ${isRTL ? "-left-5" : "-right-5"} top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white rounded-full shadow-xl border border-line flex items-center justify-center hover:bg-brand hover:text-white hover:border-brand transition-all`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {isRTL ? <path d="m15 18-6-6 6-6"/> : <path d="m9 18 6-6-6-6"/>}
              </svg>
            </button>
          )}

          <div className="overflow-hidden" style={{ padding: "4px 2px 16px" }}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(${translateX}%)`, gap: "20px" }}
            >
              {campaigns.map(c => (
                <div
                  key={c.id}
                  style={{
                    width: `calc(${cardWidthPct}% - ${(visibleCount - 1) * 20 / visibleCount}px)`,
                    flexShrink: 0,
                  }}
                >
                  <CampaignCard
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

          {total > visibleCount && (
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                <button key={i} onClick={() => setActive(i)} aria-label={`Page ${i + 1}`}
                  className={`rounded-full transition-all ${i === active ? "w-8 h-2.5 bg-brand" : "w-2.5 h-2.5 bg-line hover:bg-brand/40"}`} />
              ))}
            </div>
          )}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link href={`${p}/campaigns`}
            className="inline-flex items-center gap-2 border-2 border-brand text-brand hover:bg-brand hover:text-white font-bold rounded-xl px-8 py-3.5 transition-all">
            {t("campaigns.view_all", "عرض جميع الحملات", "View All Campaigns", "Voir Toutes", "Tüm Kampanyalar")}
            <Icon name={isRTL ? "arrow-left" : "arrow-down"} size={16} className={isRTL ? "" : "-rotate-90"} />
          </Link>
        </div>
      </div>
    </section>
  );
}
