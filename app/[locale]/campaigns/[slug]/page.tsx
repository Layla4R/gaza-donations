import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { loadTranslations } from "@/lib/i18n";
import { getCampaignDetails } from "@/lib/services/campaign.service";
import CampaignCard from "@/components/blocks/CampaignCard";
import Icon from "@/components/icons";
import { categoryMeta } from "@/lib/categories";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const campaign = await getCampaignDetails(params.slug, params.locale);
  if (!campaign) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${siteUrl}/${params.locale}/campaigns/${campaign.slug}`;
  const image = campaign.coverImage || `${siteUrl}/brand/og-image.png`;

  const title = campaign.displayTitle || campaign.title;
  const description = campaign.displaySummary || campaign.summary;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "ar": `${siteUrl}/ar/campaigns/${campaign.slug}`,
        "en": `${siteUrl}/en/campaigns/${campaign.slug}`,
        "fr": `${siteUrl}/fr/campaigns/${campaign.slug}`,
        "tr": `${siteUrl}/tr/campaigns/${campaign.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CampaignDetailPage({ params }: { params: { slug: string; locale: string } }) {
  const { slug, locale } = params;

  const [campaign, dict] = await Promise.all([
    getCampaignDetails(slug, locale),
    loadTranslations(locale),
  ]);

  if (!campaign) notFound();

  // اعتماد العنوان والملخص والتفاصيل المترجمة
  const title = campaign.displayTitle || campaign.title;
  const summary = campaign.displaySummary || campaign.summary;
  const description = campaign.displayDescription || campaign.description;

  const raised = Number(campaign.raisedAmount) || 0;
  const goal = Number(campaign.goalAmount) || 1;
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  const cat = categoryMeta(campaign.category);
  const p = locale === "ar" ? "" : `/${locale}`;

  const t = (key: string, fallback: string) => dict[key] || fallback;

  // 🌟 قاموس نصوص الواجهة الديناميكي
  const isEn = locale === "en";
  const isTr = locale === "tr";
  const isFr = locale === "fr";

  const txtAbout = isEn ? "About the Campaign" : isTr ? "Kampanya Hakkında" : isFr ? "À propos de la campagne" : t("campaigns.about", "عن الحملة");
  const txtWidgetTitle = isEn ? "Make a Difference Today" : isTr ? "Hayat Değiştirmeye Katkıda Bulunun" : isFr ? "Faites une différence aujourd'hui" : t("donate.widget_title", "ساهم في تغيير الحياة");
  const txtDirectImpact = isEn ? "Direct impact with no middleman" : isTr ? "Aracısız doğrudan etki" : isFr ? "Impact direct sans intermédiaire" : t("donate.direct", "أثر مباشر بدون وسيط");
  const txtSecure = isEn ? "All transactions are encrypted and secure" : isTr ? "Tüm işlemler şifreli ve güvenlidir" : isFr ? "Toutes les transactions sont cryptées" : t("donate.secure", "جميع المعاملات مشفرة وآمنة");

  // ترجمة التصنيفات
  const categoryLabels: Record<string, Record<string, string>> = {
    medical: { ar: "طبي", en: "Medical", tr: "Tıbbi", fr: "Médical" },
    food: { ar: "غذاء", en: "Food", tr: "Gıda", fr: "Nourriture" },
    shelter: { ar: "مأوى", en: "Shelter", tr: "Barınak", fr: "Abri" },
    water: { ar: "مياه", en: "Water", tr: "Su", fr: "Eau" },
    education: { ar: "تعليم", en: "Education", tr: "Eğitim", fr: "Éducation" },
    general: { ar: "عام", en: "General", tr: "Genel", fr: "Général" },
  };

  const categoryLabel = categoryLabels[campaign.category]?.[locale] || cat.label;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24 border-t border-slate-100">
      <div className="max-w-screen-xl mx-auto px-6 pt-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href={`${p}/`} className="hover:text-brand transition">{t("nav.home", "الرئيسية")}</Link>
          <span>/</span>
          <Link href={`${p}/campaigns`} className="hover:text-brand transition">{t("nav.campaigns", "الحملات")}</Link>
          <span>/</span>
          <span className="text-slate-700 truncate max-w-xs">{title}</span>
        </div>

        {/* Hero Banner */}
        {campaign.coverImage && (
          <div className="relative h-72 sm:h-[450px] w-full rounded-3xl overflow-hidden bg-slate-100 mb-10 shadow-xl border border-slate-100">
            <Image 
              src={campaign.coverImage} 
              alt={title} 
              fill 
              className="object-cover" 
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <span className="absolute top-5 right-5 inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold rounded-full px-4 py-1.5 shadow-md">
              <Icon name={cat.icon} size={14} />
              {categoryLabel}
            </span>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Title & Stats */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                {title}
              </h1>

              {/* Progress Overview Bar */}
              <div className="space-y-3 pt-2">
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                  <div 
                    className="bg-brand h-3.5 rounded-full transition-all duration-1000 shadow-sm" 
                    style={{ width: `${pct}%` }} 
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div>
                    <span className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                      {formatCurrency(raised, "USD")}
                    </span>
                    <span className="text-slate-500 text-xs sm:text-sm ms-2">
                      {t("campaigns.of_goal", "من الهدف")} {formatCurrency(goal, "USD")}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-brand bg-brand/10 px-3 py-1 rounded-xl text-xs sm:text-sm">
                      {pct}%
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1 rounded-xl">
                      <Icon name="heart" size={14} className="text-brand" />
                      {campaign.donorCount || 0} {t("campaigns.donors", "متبرع")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
              <h2 className="font-display font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2 border-b border-slate-100 pb-4">
                <Icon name="file-text" size={20} className="text-brand" />
                {txtAbout}
              </h2>
              <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line pt-2">
                {description}
              </div>
            </div>

            {/* Updates Section */}
            {campaign.updates && campaign.updates.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                <h2 className="font-display font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Icon name="layers" size={20} className="text-brand" />
                  {dict["campaigns.updates"] || (isEn ? "Field Updates" : isTr ? "Saha Güncellemeleri" : "تحديثات الميدان")}
                </h2>
                <div className="space-y-4">
                  {campaign.updates.map((u: any) => (
                    <div key={u.id} className="border border-slate-100 rounded-2xl p-5 bg-slate-50/60 relative">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{u.title}</h3>
                        <span className="text-xs text-slate-500 font-medium bg-white px-2.5 py-1 rounded-md border border-slate-100">
                          {new Date(u.createdAt).toLocaleDateString(locale)}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{u.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Badges Bar */}
            <div className="bg-brand text-white rounded-3xl p-6 shadow-lg flex flex-wrap items-center justify-around gap-4 text-center">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Icon name="shield-check" size={18} />
                <span>{txtSecure}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Icon name="hand-heart" size={18} />
                <span>{txtDirectImpact}</span>
              </div>
            </div>

          </div>

          {/* Right Sticky Donation Box */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
              <div className="bg-brand p-4 text-white text-center">
                <p className="text-xs font-bold text-white uppercase tracking-widest">{txtWidgetTitle}</p>
              </div>
              
              <div className="p-2">
                <CampaignCard
                  id={campaign.id}
                  slug={campaign.slug}
                  title={title}
                  summary={summary}
                  coverImage={campaign.coverImage}
                  goalAmount={Number(campaign.goalAmount)}
                  raisedAmount={Number(campaign.raisedAmount)}
                  donorCount={campaign.donorCount}
                  category={campaign.category}
                  locale={locale}
                  dict={dict}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}