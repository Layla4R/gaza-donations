"use client";
import Image from "next/image";
import Link from "next/link";
import { PageSection } from "@/lib/blocks";
import { formatCurrency } from "@/lib/format";
import DonationWidget from "@/components/site/DonateWidget";
import ContactForm from "@/components/blocks/ContactForm";
import NewsletterForm from "@/components/blocks/NewsletterForm";
import CampaignCard from "@/components/blocks/CampaignCard";
import Icon from "@/components/icons";
import CountUp from "@/components/blocks/CountUp";
import AboutOverviewSection from "./AboutOverviewSection";
import type { CampaignLite } from "@/lib/pageData";

interface RendererContext {
  campaigns?: CampaignLite[];
  whiteBackground?: boolean;
  locale?: string;
  dict?: Record<string, string>;
  primaryColor?: string | null;
  accentColor?: string | null;
}

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-brand font-semibold text-xs tracking-widest uppercase mb-3 px-3 py-1 bg-brand/5 rounded-full ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-brand" />
      {children}
    </span>
  );
}

export default function BlockRenderer({
  section,
  context,
}: {
  section: PageSection;
  context?: RendererContext;
}) {
  const p = section.props || {};

  const primary = context?.primaryColor || "var(--color-brand, #0069D2)";
  const accent = context?.accentColor || "var(--color-accent, #F00F5A)";
  const isRTL = context?.locale === "ar";

  switch (section.type) {
    case "hero":
      return (
        <section 
          className="relative min-h-[480px] sm:min-h-[560px] flex items-center overflow-hidden text-white bg-brand transition-colors"
          style={{ backgroundColor: primary }}
        >
          <div className="absolute inset-0">
            {p.backgroundImage && (
              <Image 
                src={p.backgroundImage} 
                alt="Hero background" 
                fill 
                priority 
                sizes="100vw"
                className="object-cover" 
              />
            )}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" />
          </div>

          <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-16 sm:py-24 w-full">
            <div className="max-w-2xl text-start">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-6 text-white text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                مؤسسة 4Relief الإنسانية
              </span>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
                {p.title}
              </h1>
              
              <p className="text-white/85 text-base sm:text-lg mb-8 leading-relaxed max-w-xl font-normal">
                {p.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-12">
                {p.buttonText && (
                  <Link
                    href={p.buttonLink || "/donate"}
                    className="inline-flex items-center gap-2.5 hover:opacity-90 active:scale-98 text-white font-bold text-sm sm:text-base rounded-2xl px-8 py-3.5 shadow-lg transition-all bg-accent"
                    style={{ backgroundColor: accent }}
                  >
                    <Icon name="heart" size={18} />
                    {p.buttonText}
                  </Link>
                )}
                <Link
                  href="/campaigns"
                  className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/15 backdrop-blur-md text-white font-semibold rounded-2xl px-7 py-3.5 text-sm sm:text-base transition-all"
                >
                  تصفح الحملات
                  <Icon name={isRTL ? "arrow-left" : "arrow-down"} size={16} className={isRTL ? "" : "-rotate-90"} />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/15 text-white/80 text-xs font-medium">
                <span className="flex items-center gap-2">
                  <Icon name="shield-check" size={16} /> دفع آمن 100%
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="hand-heart" size={16} /> أثر مباشر وشفاف
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="globe" size={16} /> دعم موثوق حول العالم
                </span>
              </div>
            </div>
          </div>
        </section>
      );

    case "about_overview":
      return (
        <AboutOverviewSection 
          data={p} 
          locale={context?.locale || "ar"} 
        />
      );

    case "stats":
      return (
        <section 
          className="relative py-16 sm:py-20 text-white overflow-hidden bg-brand transition-colors"
          style={{ backgroundColor: primary }}
        >
          <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-screen-xl mx-auto px-6">
            {p.title && (
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white text-center mb-12 tracking-tight">
                {p.title}
              </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {(p.items || []).map((item: any, i: number) => (
                <div key={i} className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 shadow-sm">
                  <CountUp
                    value={item.value}
                    className="font-display text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight"
                  />
                  <div className="text-xs sm:text-sm text-white/80 font-bold uppercase tracking-wider">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "text": {
      const align = p.align || "right";
      return (
        <section className="py-16 sm:py-20 bg-white">
          <div className={`max-w-screen-xl mx-auto px-6 text-${align}`}>
            {p.title && (
              <div className="mb-6">
                <span className="inline-block w-12 h-1.5 rounded-full mb-4 bg-brand" style={{ backgroundColor: primary }} />
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 leading-snug tracking-tight">
                  {p.title}
                </h2>
              </div>
            )}
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg whitespace-pre-line">
              {p.body}
            </p>
          </div>
        </section>
      );
    }

    case "image_text": {
      const imageFirst = p.imagePosition !== "right";

      const imageBlock = (
        <div className="relative">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-xl border border-slate-100">
            {p.image && (
              <Image 
                src={p.image} 
                alt={p.title || "Section Image"} 
                fill 
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover" 
              />
            )}
          </div>
        </div>
      );

      const textBlock = (
        <div>
          <span className="inline-block w-10 h-1.5 rounded-full mb-4 bg-accent" style={{ backgroundColor: accent }} />
          {p.title && <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{p.title}</h2>}
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">{p.body}</p>
        </div>
      );

      return (
        <section className="py-16 sm:py-24 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 items-center">
            {imageFirst ? (
              <>
                {imageBlock}
                {textBlock}
              </>
            ) : (
              <>
                {textBlock}
                {imageBlock}
              </>
            )}
          </div>
        </section>
      );
    }

    case "donation_buttons":
      return (
        <DonationWidget
          locale={context?.locale || "ar"}
          dict={context?.dict || {}}
          primaryColor={context?.primaryColor}
          accentColor={context?.accentColor}
          data={p}
        />
      );

    case "campaigns_grid": {
      let campaigns = context?.campaigns || [];
      if (p.onlyFeatured) campaigns = campaigns.filter((c) => c.isFeatured);
      campaigns = campaigns.slice(0, p.limit || 6);

      const locale = context?.locale || "ar";
      const isEnglish = locale === "en";
      const isTurkish = locale === "tr";
      const isFrench = locale === "fr";

      const eyebrowText = isEnglish
        ? "Where Your Donation Goes"
        : isTurkish
        ? "Bağışınız Nereye Gidiyor"
        : isFrench
        ? "Où va votre don"
        : "أين يذهب تبرعك";

      const viewAllText = isEnglish
        ? "View All Campaigns"
        : isTurkish
        ? "Tüm Kampanyaları Gör"
        : isFrench
        ? "Voir Toutes les Campagnes"
        : "عرض كل الحملات";

      const noCampaignsText = isEnglish
        ? "No campaigns available."
        : isTurkish
        ? "Şu anda kampanya bulunmamaktadır."
        : isFrench
        ? "Aucune campagne disponible."
        : "لا توجد حملات حالياً.";

      return (
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Eyebrow className="justify-center">{eyebrowText}</Eyebrow>
              {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">{p.title}</h2>}
              {p.subtitle && <p className="text-slate-500 text-sm sm:text-base">{p.subtitle}</p>}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {campaigns.map((c) => (
                <CampaignCard
                  key={c.id}
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
                  dict={context?.dict || {}}
                />
              ))}
              {campaigns.length === 0 && (
                <p className="text-slate-500 col-span-full text-center py-10">{noCampaignsText}</p>
              )}
            </div>
            {campaigns.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  href={locale === "ar" ? "/campaigns" : `/${locale}/campaigns`}
                  className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 font-bold rounded-2xl px-8 py-3.5 text-sm transition-all shadow-sm"
                >
                  {viewAllText}
                  <Icon name={isRTL ? "arrow-left" : "arrow-down"} size={16} className={isRTL ? "" : "-rotate-90"} />
                </Link>
              </div>
            )}
          </div>
        </section>
      );
    }

    case "full_image":
      return (
        <div className="w-full bg-white py-8">
          {p.src && (
            <div className="max-w-screen-xl mx-auto px-6">
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-md border border-slate-100">
                <Image
                  src={p.src}
                  alt={p.alt || "Full width image"}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}
          {p.caption && (
            <p className="text-center text-xs text-slate-500 py-3 px-6">{p.caption}</p>
          )}
        </div>
      );

    case "gallery":
      return (
        <section className="py-12 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-screen-xl mx-auto px-6">
            {p.title && (
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="inline-flex items-center gap-2 text-brand font-semibold text-xs tracking-widest uppercase mb-2 px-3 py-1 bg-brand/5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  {context?.locale === "en"
                    ? "Gallery & Impact"
                    : context?.locale === "tr"
                    ? "Başarı Galerisi"
                    : context?.locale === "fr"
                    ? "Galerie de Réalisations"
                    : "معرض الإنجازات"}
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {p.title}
                </h2>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(p.items || p.images || []).map((item: any, i: number) => {
                const url = typeof item === "string" ? item : item.url || item.src;
                if (!url) return null;

                const isVideo =
                  url.endsWith(".mp4") ||
                  url.endsWith(".webm") ||
                  url.endsWith(".mov") ||
                  url.includes("youtube.com") ||
                  url.includes("youtu.be");

                return (
                  <div
                    key={i}
                    className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 shadow-md border border-slate-100 flex flex-col justify-end"
                  >
                    {isVideo ? (
                      url.includes("youtube.com") || url.includes("youtu.be") ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${
                            url.includes("v=")
                              ? url.split("v=")[1]?.split("&")[0]
                              : url.split("/").pop()
                          }`}
                          title="Video"
                          className="w-full h-full border-0"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={url}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <Image
                        src={url}
                        alt={item.caption || "Gallery Image"}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    {item.caption && !isVideo && (
                      <div className="relative z-10 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-xs font-medium">
                        {item.caption}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );

    case "stories":
      return (
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Eyebrow className="justify-center">قصص حقيقية</Eyebrow>
              {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{p.title}</h2>}
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {(p.items || []).map((item: any, i: number) => (
                <div key={i} className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-lg group border border-slate-100">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title || "Story image"}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-0 right-0 p-6 sm:p-8 text-start">
                    <Icon name="message-square" size={24} className="text-white/80 mb-2" />
                    <h3 className="font-display text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "faq":
      return (
        <section className="py-20 sm:py-24 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Eyebrow className="justify-center">الأسئلة الشائعة</Eyebrow>
              {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{p.title}</h2>}
            </div>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-sm max-w-3xl mx-auto">
              {(p.items || []).map((item: any, i: number) => (
                <details key={i} className="group p-6">
                  <summary className="font-display font-bold text-slate-900 text-base sm:text-lg cursor-pointer flex justify-between items-center gap-4 list-none">
                    {item.title}
                    <span className="shrink-0 w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-open:rotate-180 transition-transform">
                      <Icon name="chevron-down" size={16} />
                    </span>
                  </summary>
                  <p className="text-slate-600 text-xs sm:text-sm mt-4 leading-relaxed">{item.body}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );

    case "cta":
      return (
        <section 
          className="relative overflow-hidden py-20 sm:py-24 text-white text-center bg-brand transition-colors"
          style={{ backgroundColor: primary }}
        >
          <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative max-w-screen-xl mx-auto px-6 z-10">
            {p.title && <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">{p.title}</h2>}
            {p.subtitle && <p className="text-white/80 mb-8 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">{p.subtitle}</p>}
            {p.buttonText && (
              <Link
                href={p.buttonLink || "/donate"}
                className="inline-flex items-center gap-2 hover:opacity-90 active:scale-98 text-white font-bold rounded-2xl px-9 py-4 text-sm shadow-xl transition-all bg-accent"
                style={{ backgroundColor: accent }}
              >
                <Icon name="heart" size={18} />
                {p.buttonText}
              </Link>
            )}
          </div>
        </section>
      );

    case "contact_form":
      return (
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-screen-xl mx-auto px-6 text-center mb-10">
            <Eyebrow className="justify-center">تواصل معنا</Eyebrow>
            {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">{p.title}</h2>}
            {p.subtitle && <p className="text-slate-500 text-sm sm:text-base">{p.subtitle}</p>}
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            <ContactForm locale={context?.locale || "ar"} dict={context?.dict || {}} email={p.email || "info@forrelief.org"} />
          </div>
        </section>
      );

    case "newsletter":
      return (
        <section 
          className="relative py-16 sm:py-20 text-white overflow-hidden bg-brand transition-colors"
          style={{ backgroundColor: primary }}
        >
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Icon name="mail" size={22} className="text-white" />
            </div>
            {p.title && <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">{p.title}</h2>}
            {p.subtitle && <p className="text-white/80 mb-8 text-xs sm:text-sm max-w-lg mx-auto">{p.subtitle}</p>}
            <NewsletterForm />
          </div>
        </section>
      );

    case "spacer":
      return <div style={{ height: `${p.height || 48}px` }} />;

    default:
      return (
        <div className="py-10 text-center text-slate-500 bg-slate-50 text-xs">
          عنصر غير معروف: {section.type}
        </div>
      );
  }
}

export function formatRaised(amount: number) {
  return formatCurrency(amount);
}