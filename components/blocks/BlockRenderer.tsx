import Image from "next/image";
import Link from "next/link";
import { PageSection } from "@/lib/blocks";
import { formatCurrency } from "@/lib/format";
import DonationWidget from "./DonationWidget";
import ContactForm from "./ContactForm";
import NewsletterForm from "./NewsletterForm";
import CampaignCard from "./CampaignCard";
import Icon from "@/components/icons";
import CountUp from "./CountUp";

import type { CampaignLite } from "@/lib/pageData";

interface RendererContext {
  campaigns?: CampaignLite[];
  whiteBackground?: boolean;
  locale?: string;
  dict?: Record<string, string>;
}

// Small reusable "eyebrow" label — the recurring signature treatment used
// above section headings throughout the site.
function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-brand-light font-display font-bold text-xs sm:text-sm tracking-[0.25em] uppercase mb-3 ${className}`}>
      <span className="inline-block w-6 h-px bg-brand-light" />
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

  switch (section.type) {
    case "hero":
      return (
        <section className="relative min-h-[640px] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            {p.backgroundImage && (
              <Image src={p.backgroundImage} alt="" fill priority className="object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
            <div
              className="absolute inset-0 bg-brand-gradient mix-blend-multiply"
              style={{ opacity: p.overlayOpacity ?? 0.55 }}
            />
          </div>

          {/* signature decorative rings */}
          <div className="absolute -left-40 -top-40 w-[28rem] h-[28rem] rounded-full border border-white/20 hidden lg:block" />
          <div className="absolute -left-16 -top-16 w-72 h-72 rounded-full border border-white/10 hidden lg:block" />

          <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-14 sm:py-28">
            <div className="max-w-2xl text-right">
              <span className="inline-flex items-center gap-2 text-white font-display font-bold text-sm sm:text-base tracking-[0.2em] uppercase mb-4">
              <span className="inline-block w-6 h-px bg-white/60" />
              مؤسسة فور ريليف الإنسانية
            </span>
              <h1 className="font-display text-3xl sm:text-6xl font-extrabold text-white mb-6 leading-[1.15]">
                {p.title}
              </h1>
              <p className="text-lg sm:text-xl text-white/85 mb-10 leading-relaxed max-w-xl">{p.subtitle}</p>

              <div className="flex flex-wrap items-center gap-4 mb-14">
                {p.buttonText && (
                  <Link
                    href={p.buttonLink || "/donate"}
                    className="inline-flex items-center gap-2 bg-accent-gradient hover:opacity-90 text-white font-bold text-lg rounded-xl px-8 py-4 shadow-lg shadow-accent/30 transition"
                  >
                    <Icon name="heart" size={20} />
                    {p.buttonText}
                  </Link>
                )}
                <Link
                  href="/campaigns"
                  className="inline-flex items-center gap-2 border border-white/35 hover:border-white/70 text-white font-semibold rounded-xl px-8 py-4 transition"
                >
                  تصفح الحملات
                  <Icon name="arrow-left" size={18} />
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-8 border-t border-white/15 text-white/80 text-sm">
                <span className="flex items-center gap-2">
                  <Icon name="shield-check" size={18} className="text-white/80" /> دفع آمن 100%
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="hand-heart" size={18} className="text-white/80" /> أثر مباشر وشفاف
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="globe" size={18} className="text-white/80" /> دعم موثوق حول العالم
                </span>
              </div>
            </div>
          </div>
        </section>
      );

    case "stats": {
      const statWb = context?.whiteBackground;
      return (
        <section className={`relative py-14 sm:py-20 overflow-hidden ${statWb ? "bg-brand-gradient" : "bg-brand-gradient"}`}>
          <div className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full border border-white/10 hidden sm:block" />
          <div className="relative max-w-screen-xl mx-auto px-6">
            {p.title && (
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white/90 text-center mb-10">{p.title}</h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/15">
              {(p.items || []).map((item: any, i: number) => (
                <div key={i} className="text-center px-4 py-4">
                  <CountUp
                    value={item.value}
                    className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-2 tabular-nums"
                  />
                  <div className="text-sm text-white/80 tracking-wide mt-1">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "text": {
      const align = p.align || "right";
      const wb = context?.whiteBackground;
      return (
        <section className={`py-20 sm:py-24 ${wb ? "bg-white" : ""}`}>
          <div className={`max-w-screen-xl mx-auto px-6 text-${align}`}>
            {p.title && (
              <div className="mb-7">
                <span className="inline-block w-14 h-1.5 rounded-full mb-5" style={{ background: "linear-gradient(135deg,#003C87,#0069D2)" }} />
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink leading-snug">{p.title}</h2>
              </div>
            )}
            <p className="text-muted leading-loose text-lg whitespace-pre-line">{p.body}</p>
          </div>
        </section>
      );
    }

    case "image_text": {
      const itWb = context?.whiteBackground;
      const imageFirst = p.imagePosition !== "right";
      const cornerClasses = imageFirst
        ? "absolute -bottom-5 -right-5 w-28 h-28 border-b-4 border-r-4 border-brand rounded-br-3xl -z-10 hidden sm:block"
        : "absolute -bottom-5 -left-5 w-28 h-28 border-b-4 border-l-4 border-brand rounded-bl-3xl -z-10 hidden sm:block";

      const imageBlock = (
        <div className="relative">
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-beige shadow-xl">
            {p.image && <Image src={p.image} alt={p.title || ""} fill className="object-cover" />}
          </div>
          <div className={cornerClasses} />
        </div>
      );

      const textBlock = (
        <div>
          <span className="inline-block w-12 h-1.5 bg-accent-gradient rounded-full mb-5" />
          {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink mb-5">{p.title}</h2>}
          <p className="text-muted leading-loose text-lg whitespace-pre-line">{p.body}</p>
        </div>
      );

      return (
        <section className={`py-20 sm:py-24 ${itWb ? "bg-white" : ""}`}>
          <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 items-center">
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
        <section className="relative py-20 sm:py-24 bg-section-gradient overflow-hidden">
          <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-[36rem] h-[36rem] rounded-full border border-brand/10 hidden sm:block" />
          <div className="relative max-w-screen-xl mx-auto px-6 text-center mb-10">
            <Eyebrow className="justify-center">ساهم اليوم</Eyebrow>
            {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink mb-2">{p.title}</h2>}
            {p.subtitle && <p className="text-muted text-lg">{p.subtitle}</p>}
          </div>
          <div className="relative px-6 w-full">
            <DonationWidget
              amounts={p.amounts || [1, 5, 10, 25, 50, 100]}
              campaignId={p.campaignId}
              allowMonthly={p.allowMonthly}
            />
          </div>
        </section>
      );

    case "campaigns_grid": {
      let campaigns = context?.campaigns || [];
      if (p.onlyFeatured) campaigns = campaigns.filter((c) => c.isFeatured);
      campaigns = campaigns.slice(0, p.limit || 6);
      return (
        <section className="py-20 sm:py-24">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center mb-12">
              <Eyebrow className="justify-center">أين يذهب تبرعك</Eyebrow>
              {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink mb-2">{p.title}</h2>}
              {p.subtitle && <p className="text-muted text-lg">{p.subtitle}</p>}
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
                />
              ))}
              {campaigns.length === 0 && (
                <p className="text-muted col-span-full text-center">لا توجد حملات حالياً.</p>
              )}
            </div>
            {campaigns.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  href="/campaigns"
                  className="inline-flex items-center gap-2 border border-brand text-brand hover:bg-brand hover:text-white font-semibold rounded-xl px-7 py-3 transition"
                >
                  عرض كل الحملات
                  <Icon name="arrow-left" size={18} />
                </Link>
              </div>
            )}
          </div>
        </section>
      );
    }

    case "full_image":
      return (
        <div className="w-full bg-white">
          {p.src && (
            <img
              src={p.src}
              alt={p.alt || ""}
              className="w-full object-contain block"
              style={{ maxHeight: p.maxHeight ? `${p.maxHeight}px` : "none" }}
            />
          )}
          {p.caption && (
            <p className="text-center text-sm text-muted py-3 px-6">{p.caption}</p>
          )}
        </div>
      );

    case "gallery":
      return (
        <section className="py-20 sm:py-24 bg-beige/40">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center mb-12">
              <Eyebrow className="justify-center">لقطات من الميدان</Eyebrow>
              {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">{p.title}</h2>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(p.images || []).map((img: any, i: number) => (
                <div key={i} className="relative h-40 sm:h-56 rounded-2xl overflow-hidden bg-beige shadow-sm group">
                  <Image
                    src={typeof img === "string" ? img : img.url}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "stories":
      return (
        <section className="py-20 sm:py-24 bg-beige/40">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center mb-12">
              <Eyebrow className="justify-center">قصص حقيقية</Eyebrow>
              {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">{p.title}</h2>}
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {(p.items || []).map((item: any, i: number) => (
                <div key={i} className="relative h-80 rounded-2xl overflow-hidden shadow-lg group">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
                  <div className="absolute bottom-0 right-0 p-6 sm:p-7 text-right">
                    <Icon name="message-square" size={28} className="text-white/70 mb-3" />
                    <h3 className="font-display text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "faq":
      return (
        <section className="py-20 sm:py-24">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center mb-12">
              <Eyebrow className="justify-center">الأسئلة الشائعة</Eyebrow>
              {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">{p.title}</h2>}
            </div>
            <div className="divide-y divide-line border border-line rounded-2xl overflow-hidden bg-white shadow-sm">
              {(p.items || []).map((item: any, i: number) => (
                <details key={i} className="group p-6 sm:p-7">
                  <summary className="font-display font-bold text-ink cursor-pointer flex justify-between items-center gap-4 list-none">
                    {item.title}
                    <span className="shrink-0 text-brand group-open:rotate-180 transition-transform">
                      <Icon name="chevron-down" size={18} />
                    </span>
                  </summary>
                  <p className="text-muted mt-4 leading-relaxed">{item.body}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      );

    case "cta": {
      const styles: Record<string, string> = {
        brand: "bg-brand-gradient text-white",
        gold: "bg-accent-gradient text-white",
        beige: "bg-beige text-ink",
      };
      return (
        <section className={`relative overflow-hidden py-20 sm:py-24 ${styles[p.style] || styles.brand}`}>
          <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full border border-white/15 hidden sm:block" />
          <div className="absolute right-10 top-10 w-40 h-40 rounded-full border border-white/10 hidden sm:block" />
          <div className="relative max-w-screen-xl mx-auto px-6 text-center">
            {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">{p.title}</h2>}
            {p.subtitle && <p className="opacity-85 mb-8 text-lg">{p.subtitle}</p>}
            {p.buttonText && (
              <Link
                href={p.buttonLink || "/donate"}
                className="inline-flex items-center gap-2 bg-white text-brand font-bold rounded-xl px-9 py-4 shadow-lg hover:opacity-90 transition"
              >
                <Icon name="heart" size={20} />
                {p.buttonText}
              </Link>
            )}
          </div>
        </section>
      );
    }

    case "contact_form":
      return (
        <section className="py-20 sm:py-24">
          <div className="max-w-screen-xl mx-auto px-6 text-center mb-10">
            <Eyebrow className="justify-center">تواصل معنا</Eyebrow>
            {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink mb-2">{p.title}</h2>}
            {p.subtitle && <p className="text-muted text-lg">{p.subtitle}</p>}
          </div>
          <ContactForm email={p.email} />
        </section>
      );

    case "newsletter":
      return (
        <section className="relative py-16 sm:py-20 bg-brand-gradient overflow-hidden">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white/10 hidden sm:block" />
          <div className="relative max-w-screen-xl mx-auto px-6 text-center text-white">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
              <Icon name="mail" size={26} className="text-white/80" />
            </div>
            {p.title && <h2 className="font-display text-2xl sm:text-3xl font-extrabold mb-2">{p.title}</h2>}
            {p.subtitle && <p className="opacity-85 mb-6">{p.subtitle}</p>}
            <NewsletterForm />
          </div>
        </section>
      );

    case "spacer":
      return <div style={{ height: `${p.height || 48}px` }} />;

    default:
      return (
        <div className="py-10 text-center text-muted bg-beige/30">
          عنصر غير معروف: {section.type}
        </div>
      );
  }
}

export function formatRaised(amount: number) {
  return formatCurrency(amount);
}
