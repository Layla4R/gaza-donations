import { notFound } from "next/navigation";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getPageBySlug, getCampaignsLite } from "@/lib/pageData";
import { loadTranslations } from "@/lib/i18n";
import { PageSection } from "@/lib/blocks";
import type { Metadata } from "next";
import LegalPageContent from "@/components/site/LegalPageContent";
import { getSupabaseOrNull } from "@/lib/supabase";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const page = await getPageBySlug(params.slug, params.locale);
  if (!page) return {};
  return { title: page.title, description: page.description || undefined };
}

export default async function DynamicPage({ params }: { params: { slug: string; locale: string } }) {
  const { slug, locale } = params;

  // 🌟 جلب ألوان الـ primary و accent المقترنة بإعدادات المظهر من الأدمن
  const supabase = getSupabaseOrNull();
  const [{ data: appearance }, page, campaigns, dict] = await Promise.all([
    supabase?.from("SiteSettings").select("primaryColor, accentColor").eq("id", "default").maybeSingle() || { data: null },
    getPageBySlug(slug, locale),
    getCampaignsLite(locale),
    loadTranslations(locale),
  ]);

  const primaryColor = appearance?.primaryColor || "var(--color-brand, #0069D2)";
  const accentColor = appearance?.accentColor || "var(--color-accent, #F00F5A)";

  if (!page) notFound();
  const sections = (page.sections as unknown as PageSection[]) || [];

  const LEGAL_SLUGS = ["privacy","terms","refund-policy","cookie-policy","aml-policy","complaints",
    "license","financial-transparency","how-we-use-donations"];
  const isLegalPage = LEGAL_SLUGS.includes(slug);
  const hasCustomSections = !isLegalPage && sections.length > 0;

  // Legal page titles — multilingual
  const LEGAL_TITLES: Record<string, Record<string, string>> = {
    privacy:                 { ar: "سياسة الخصوصية", en: "Privacy Policy", fr: "Politique de Confidentialité", tr: "Gizlilik Politikası" },
    terms:                   { ar: "الشروط والأحكام", en: "Terms & Conditions", fr: "Conditions d'Utilisation", tr: "Kullanım Koşulları" },
    "refund-policy":         { ar: "سياسة الاسترداد", en: "Refund Policy", fr: "Politique de Remboursement", tr: "İade Politikası" },
    "cookie-policy":         { ar: "سياسة ملفات تعريف الارتباط", en: "Cookie Policy", fr: "Politique des Cookies", tr: "Çerez Politikası" },
    "aml-policy":            { ar: "سياسة مكافحة غسيل الأموال", en: "Anti-Money Laundering Policy", fr: "Politique Anti-Blanchiment", tr: "Kara Para Aklamayla Mücadele" },
    complaints:              { ar: "الشكاوى", en: "Complaints Policy", fr: "Politique de Réclamations", tr: "Şikayet Politikası" },
    "financial-transparency": { ar: "الشفافية المالية", en: "Financial Transparency", fr: "Transparence Financière", tr: "Mali Şeffaflık" },
    "how-we-use-donations":  { ar: "كيف نستخدم التبرعات", en: "How We Use Donations", fr: "Comment Nous Utilisons les Dons", tr: "Bağışları Nasıl Kullanıyoruz" },
  };
  const LEGAL_SUBTITLES: Record<string, Record<string, string>> = {
    privacy: { ar: "حماية بياناتك أولويتنا", en: "Protecting Your Data Is Our Priority", fr: "La Protection de Vos Données Est Notre Priorité", tr: "Verilerinizi Korumak Önceliğimizdir" },
    terms:   { ar: "اتفاقية الاستخدام الملزمة", en: "Binding Usage Agreement", fr: "Accord d'Utilisation Contraignant", tr: "Bağlayıcı Kullanım Sözleşmesi" },
  };

  // 🌟 قاموس ترجمة العناوين الشائعة للصفحات غير القانونية
  const COMMON_PAGE_TITLES: Record<string, Record<string, string>> = {
    about: { ar: "من نحن", en: "About Us", fr: "À Propos", tr: "Hakkımızda" },
    transparency: { ar: "الشفافية", en: "Transparency", fr: "Transparence", tr: "Şeffaflık" },
    contact: { ar: "اتصل بنا", en: "Contact Us", fr: "Contactez-nous", tr: "İletişim" },
  };

  // تحديد العنوان بدقة بحسب اللغة النشطة
  const displayTitle = isLegalPage
    ? (LEGAL_TITLES[slug]?.[locale] || LEGAL_TITLES[slug]?.["en"] || page.title)
    : (dict[`nav.${slug}`] || COMMON_PAGE_TITLES[slug]?.[locale] || page.title);

  const displaySubtitle = isLegalPage
    ? (LEGAL_SUBTITLES[slug]?.[locale] || LEGAL_SUBTITLES[slug]?.["en"] || page.description || null)
    : page.description;

  return (
    <div className="bg-white">
      {/* 🌟 هيدر الصفحة الرئيسي */}
      <header 
        className="relative py-12 sm:py-20 text-center overflow-hidden transition-colors"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full border border-white/10 hidden sm:block" />
        <div className="relative max-w-screen-xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 text-white/70 font-display font-semibold text-xs tracking-[0.3em] uppercase mb-4">
            <span className="inline-block w-6 h-px bg-white/40" />
            4Relief Humanitarian Foundation
          </span>
          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white">{displayTitle}</h1>
          {displaySubtitle && (
            <p className="mt-4 text-white/75 text-lg max-w-xl mx-auto leading-relaxed">{displaySubtitle}</p>
          )}
        </div>
      </header>
      <div className="bg-white">
        {hasCustomSections ? (
          sections.map((section) => (
            <BlockRenderer 
              key={section.id} 
              section={section} 
              context={{ campaigns, whiteBackground: true, locale, dict, primaryColor, accentColor }} 
            />
          ))
        ) : isLegalPage ? (
          <LegalPageContent slug={slug} locale={locale} />
        ) : null}
      </div>
    </div>
  );
}