// app/[locale]/campaigns/page.tsx
import { loadTranslations } from "@/lib/i18n";
import { getActiveCampaigns } from "@/lib/services/campaign.service";
import CampaignCard from "@/components/blocks/CampaignCard";
import DestekolPageIntro from "@/components/site/DestekolPageIntro";
import { getRequestSite } from "@/lib/request-site";
import { getPageBySlug } from "@/lib/pageData";
import type { Metadata } from "next";
import { normalizeDestekolBrandCopy } from "@/lib/destekol-brand-copy";

// 🌟 تحسين الأداء: تحديث الصفحة في الكاش كل 60 ثانية بدلاً من (0)
// هذا سيجعل الصفحة تفتح في أجزاء من الثانية للزوار ويخفف الضغط عن قاعدة البيانات
export const revalidate = 60; 

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const dict = await loadTranslations(locale);
  const isDestekol = getRequestSite().id === "destekol";
  const rawTitle = dict["campaigns.page_title"] || (locale === "ar" ? "الحملات النشطة" : locale === "fr" ? "Campagnes Actives" : locale === "tr" ? "Aktif Kampanyalar" : "Active Campaigns");
  const rawDescription = dict["campaigns.page_desc"] || (locale === "ar" ? "ادعم حملاتنا الإنسانية وساعد الأسر المحتاجة حول العالم" : "Support our humanitarian campaigns and help families in need around the world");
  const { title, description } = isDestekol
    ? normalizeDestekolBrandCopy({ title: rawTitle, description: rawDescription }, locale)
    : { title: rawTitle, description: rawDescription };
  return { title, description, openGraph: { title, description } };
}

export default async function CampaignsPage({ params: { locale } }: { params: { locale: string } }) {
  // 🌟 جلب البيانات المتوازية (Parallel Data Fetching) بدون كود قواعد بيانات
  const [campaigns, dict, page] = await Promise.all([
    getActiveCampaigns(locale),
    loadTranslations(locale),
    getPageBySlug("campaigns", locale),
  ]);
  const isDestekol = getRequestSite().id === "destekol";
  const rawTitle = page?.title || dict["campaigns.title"] || "الحملات النشطة";
  const rawDescription = page?.description || dict["campaigns.subtitle"] || "ادعم حملاتنا الإنسانية واصنع الفرق";
  const { title, description, displayCampaigns } = isDestekol
    ? normalizeDestekolBrandCopy({ title: rawTitle, description: rawDescription, displayCampaigns: campaigns }, locale)
    : { title: rawTitle, description: rawDescription, displayCampaigns: campaigns };

  return (
    <div>
      {isDestekol ? <DestekolPageIntro locale={locale} title={title} description={description} /> : <header className="relative py-16 sm:py-20 bg-brand-gradient text-center overflow-hidden">
        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full border border-white/10 hidden sm:block" />
        <div className="relative max-w-screen-xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 text-white/70 font-display font-semibold text-xs tracking-[0.3em] uppercase mb-4">
            <span className="inline-block w-6 h-px bg-white/40" />4Relief
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            {title}
          </h1>
          <p className="mt-4 text-white/75 text-lg">
            {description}
          </p>
        </div>
      </header>}

      {/* 🌟 Content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {displayCampaigns.length === 0 ? (
          <p className="text-center text-muted py-20">
            {dict["campaigns.no_campaigns"] || "لا توجد حملات نشطة حالياً."}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {displayCampaigns.map((c: any) => (
              <CampaignCard key={c.id} {...c} locale={locale} dict={dict} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
