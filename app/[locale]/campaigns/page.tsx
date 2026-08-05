// app/[locale]/campaigns/page.tsx
import { loadTranslations } from "@/lib/i18n";
import { getActiveCampaigns } from "@/lib/services/campaign.service";
import CampaignCard from "@/components/blocks/CampaignCard";
import type { Metadata } from "next";

// 🌟 تحسين الأداء: تحديث الصفحة في الكاش كل 60 ثانية بدلاً من (0)
// هذا سيجعل الصفحة تفتح في أجزاء من الثانية للزوار ويخفف الضغط عن قاعدة البيانات
export const revalidate = 60; 

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const dict = await loadTranslations(locale);
  const title = dict["campaigns.page_title"] || (locale === "ar" ? "الحملات النشطة" : locale === "fr" ? "Campagnes Actives" : locale === "tr" ? "Aktif Kampanyalar" : "Active Campaigns");
  const description = dict["campaigns.page_desc"] || (locale === "ar" ? "ادعم حملاتنا الإنسانية وساعد الأسر المحتاجة حول العالم" : "Support our humanitarian campaigns and help families in need around the world");
  return { title, description, openGraph: { title, description } };
}

export default async function CampaignsPage({ params: { locale } }: { params: { locale: string } }) {
  // 🌟 جلب البيانات المتوازية (Parallel Data Fetching) بدون كود قواعد بيانات
  const [campaigns, dict] = await Promise.all([
    getActiveCampaigns(locale),
    loadTranslations(locale),
  ]);

  return (
    <div>
      {/* 🌟 Header */}
      <header className="relative py-16 sm:py-20 bg-brand-gradient text-center overflow-hidden">
        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full border border-white/10 hidden sm:block" />
        <div className="relative max-w-screen-xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 text-white/70 font-display font-semibold text-xs tracking-[0.3em] uppercase mb-4">
            <span className="inline-block w-6 h-px bg-white/40" />4Relief
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            {dict["campaigns.title"] || "الحملات النشطة"}
          </h1>
          <p className="mt-4 text-white/75 text-lg">
            {dict["campaigns.subtitle"] || "ادعم حملاتنا الإنسانية واصنع الفرق"}
          </p>
        </div>
      </header>

      {/* 🌟 Content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {campaigns.length === 0 ? (
          <p className="text-center text-muted py-20">
            {dict["campaigns.no_campaigns"] || "لا توجد حملات نشطة حالياً."}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {campaigns.map((c: any) => (
              <CampaignCard key={c.id} {...c} locale={locale} dict={dict} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}