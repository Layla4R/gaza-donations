"use client";

import {
  useState,
  useEffect,
  useMemo,
} from "react";

import Link from "next/link";

import Icon from "@/components/icons";
import CampaignCard from "@/components/blocks/CampaignCard";

interface Campaign {
  id: string;
  slug: string;
  title: string;
  summary: string;

  coverImage?: string | null;

  goalAmount: number;
  raisedAmount: number;
  donorCount: number;

  category?: string;
  defaultAmount?: number;
}

interface Props {
  campaigns: Campaign[];
  locale: string;
  dict: Record<string, string>;
  data?: any;
}

export default function CampaignsCarousel({
  campaigns = [],
  locale,
  dict,
  data,
}: Props) {
  const [active, setActive] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  /*
   * Responsive visible cards
   */
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;

      const nextCount =
        width < 640
          ? 1
          : width < 1024
            ? 2
            : 3;

      setVisibleCount(nextCount);
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const t = (
    key: string,
    ar: string,
    en: string,
    fr: string,
    tr: string
  ) => {
    return (
      dict[key] ||
      (locale === "ar"
        ? ar
        : locale === "fr"
          ? fr
          : locale === "tr"
            ? tr
            : en)
    );
  };

  const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];

  /*
   * Limit
   */
  const limit = useMemo(() => {
    const parsed = Number.parseInt(String(data?.limit ?? ""), 10);

    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }

    return safeCampaigns.length;
  }, [data?.limit, safeCampaigns.length]);

  const displayCampaigns = safeCampaigns.slice(0, limit);
  const total = displayCampaigns.length;

  const maxIdx = Math.max(0, total - visibleCount);

  /*
   * Keep active index valid
   */
  useEffect(() => {
    setActive((value) => Math.min(value, maxIdx));
  }, [maxIdx]);

  if (total === 0) {
    return null;
  }

  const sectionTitle =
    data?.title ||
    t(
      "campaigns.title",
      "الحملات النشطة",
      "Active Campaigns",
      "Campagnes Actives",
      "Aktif Kampanyalar"
    );

  const sectionSubtitle =
    data?.subtitle ||
    t(
      "campaigns.subtitle",
      "ادعم الحملات الإنسانية واصنع الفرق",
      "Support humanitarian campaigns and make a difference",
      "Soutenez les campagnes humanitaires",
      "İnsani kampanyaları destekleyin"
    );

  const sectionEyebrow =
    data?.eyebrow ||
    t(
      "campaigns.eyebrow",
      "اختر الحملة التي تريد دعمها",
      "Choose a Campaign",
      "Choisissez une Campagne",
      "Bir Kampanya Seçin"
    );

  const isRTL = locale === "ar";
  const prefix = locale === "ar" ? "" : `/${locale}`;

  const offsetPercentage = active * (100 / visibleCount);

  return (
    <section className="border-y border-slate-100 bg-slate-50/60 py-12">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        {/* Header */}

        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand/10 bg-brand/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
            {sectionEyebrow}
          </span>

          <h2 className="mb-4 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {sectionTitle}
          </h2>

          <p className="text-sm leading-relaxed text-slate-500 sm:text-lg">
            {sectionSubtitle}
          </p>
        </div>

        {/* Carousel */}

        <div className="relative px-2 sm:px-4">
          {/* Previous */}

          {active > 0 && (
            <button
              type="button"
              onClick={() =>
                setActive((value) => Math.max(0, value - 1))
              }
              aria-label={t(
                "campaigns.prev",
                "السابق",
                "Previous",
                "Précédent",
                "Önceki"
              )}
              className={`absolute ${
                isRTL ? "-right-2 sm:-right-4" : "-left-2 sm:-left-4"
              } top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-700 shadow-lg transition-all hover:border-brand hover:bg-brand hover:text-white`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {isRTL ? (
                  <path d="m9 18 6-6-6-6" />
                ) : (
                  <path d="m15 18-6-6 6-6" />
                )}
              </svg>
            </button>
          )}

          {/* Next */}

          {active < maxIdx && (
            <button
              type="button"
              onClick={() =>
                setActive((value) => Math.min(maxIdx, value + 1))
              }
              aria-label={t(
                "campaigns.next",
                "التالي",
                "Next",
                "Suivant",
                "Sonraki"
              )}
              className={`absolute ${
                isRTL ? "-left-2 sm:-left-4" : "-right-2 sm:-right-4"
              } top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-700 shadow-lg transition-all hover:border-brand hover:bg-brand hover:text-white`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {isRTL ? (
                  <path d="m15 18-6-6 6-6" />
                ) : (
                  <path d="m9 18 6-6-6-6" />
                )}
              </svg>
            </button>
          )}

          {/* Track */}

          <div className="overflow-hidden p-1.5">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(${
                  isRTL ? offsetPercentage : -offsetPercentage
                }%)`,
              }}
            >
              {displayCampaigns.map((campaign, idx) => (
                <div
                  key={campaign.id || campaign.slug || idx}
                  className="w-full shrink-0 min-w-0 px-2 sm:px-3"
                  style={{
                    width: `${100 / visibleCount}%`,
                  }}
                >
                  <CampaignCard
                    id={campaign.id}
                    slug={campaign.slug}
                    title={campaign.title || ""}
                    summary={campaign.summary || ""}
                    coverImage={campaign.coverImage}
                    goalAmount={campaign.goalAmount || 0}
                    raisedAmount={campaign.raisedAmount || 0}
                    donorCount={campaign.donorCount || 0}
                    category={campaign.category}
                    locale={locale}
                    dict={dict}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}

          {total > visibleCount && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({
                length: maxIdx + 1,
              }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Go to slide page ${index + 1}`}
                  aria-current={index === active ? "true" : undefined}
                  className={`rounded-full transition-all ${
                    index === active
                      ? "h-2.5 w-8 bg-brand"
                      : "h-2.5 w-2.5 bg-slate-200 hover:bg-brand/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All */}

        <div className="mt-10 text-center">
          <Link
            href={`${prefix}/campaigns`}
            aria-label={t(
              "campaigns.view_all",
              "عرض جميع الحملات",
              "View All Campaigns",
              "Voir Toutes",
              "Tüm Kampanyalar"
            )}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-brand px-8 py-3.5 font-bold text-brand shadow-sm transition-all hover:scale-105 hover:bg-brand hover:text-white active:scale-95"
          >
            {t(
              "campaigns.view_all",
              "عرض جميع الحملات",
              "View All Campaigns",
              "Voir Toutes",
              "Tüm Kampanyalar"
            )}

            <Icon
              name={isRTL ? "arrow-left" : "arrow-down"}
              size={16}
              className={isRTL ? "" : "-rotate-90"}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}