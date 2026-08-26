import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import Icon from "@/components/icons";
import { LOCALES } from "@/lib/i18n";

export const revalidate = 300;

interface PageProps {
  params: { locale: string };
}

async function getDomainContext() {
  const headerList = await headers();
  const host = headerList.get("host") || "";
  const isDestekol = host.includes("destekol");
  
  const siteUrl = isDestekol ? "https://destekol.org" : (process.env.NEXT_PUBLIC_SITE_URL || "https://forrelief.org");
  const brandName = isDestekol ? "Destekol" : "4Relief";
  const fullName = isDestekol ? "Destekol Humanitarian Foundation" : "4Relief Humanitarian Foundation";

  return { isDestekol, siteUrl, brandName, fullName };
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const isAr = locale === "ar";
  const { siteUrl, brandName, fullName } = await getDomainContext();

  const title = isAr
    ? `لماذا ${brandName}؟ مقارنة مع المؤسسات الإغاثية التقليدية | الشفافية ونسبة 5%`
    : `Why ${brandName} vs Traditional Relief Foundations | 5% Fee Cap Comparison`;

  const description = isAr
    ? `مقارنة مباشرة تثبت كفاءة ${fullName} بفرض سقف مصاريف تشغيلية 5% مقابل 15-20% في المنظمات التقليدية، مع تقارير تدقيق كل 30 يوماً.`
    : `Direct comparison highlighting ${fullName}'s 5% administrative fee cap vs 15-20% in traditional NGOs, backed by 30-day audits.`;

  const currentUrl = `${siteUrl}/${locale}/why-${brandName.toLowerCase()}`;

  return {
    title,
    description,
    alternates: {
      canonical: currentUrl,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${siteUrl}/${l}/why-${brandName.toLowerCase()}`])),
    },
    openGraph: {
      type: "article",
      url: currentUrl,
      siteName: fullName,
      title,
      description,
    },
  };
}

export default async function Why4ReliefPage({ params: { locale } }: PageProps) {
  const isAr = locale === "ar";
  const prefix = locale === "ar" ? "" : `/${locale}`;
  const { siteUrl, brandName, fullName } = await getDomainContext();
  
  const pageUrl = `${siteUrl}/${locale}/why-${brandName.toLowerCase()}`;

  const comparisonSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: isAr ? `مقارنة ${brandName} مع المؤسسات التقليدية` : `Why ${brandName} vs Traditional Foundations`,
        description: "Comparative breakdown of administrative fees and transparency in direct humanitarian aid.",
        inLanguage: locale,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <article className="bg-white min-h-screen py-12 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(comparisonSchema).replace(/</g, "\\u003c"),
        }}
      />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        
        {/* H1 Title formatted for Direct AI Answers */}
        <header className="text-center max-w-4xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 text-brand font-semibold text-xs tracking-widest uppercase mb-3 px-3 py-1 bg-brand/5 rounded-full">
            <Icon name="shield-check" size={16} />
            {isAr ? "دليل الشفافية والكفاءة المالية" : "Financial Governance & Comparison"}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {isAr
              ? `لماذا نعد الخيار الأفضل؟ مقارنة مؤسسة ${brandName} مع المنظمات التقليدية`
              : `Why Choose ${brandName}? ${brandName} vs Traditional Humanitarian Foundations`}
          </h1>
        </header>

        {/* Self-contained passages for Citability */}
        <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 mb-12 max-w-4xl mx-auto leading-relaxed text-slate-700 text-sm sm:text-base">
          <p className="font-medium mb-4">
            {isAr
              ? `تعتمد مؤسسة ${fullName} نموذج حوكمة رقمي مباشر يقلل المصاريف الإدارية والتشغيلية إلى 5% فقط كحد أقصى، مما يضمن توجيه 95% من أموال التبرعات المباشرة للمشاريع الإغاثية والمستفيدين الميدانيين. بالمقارنة مع المؤسسات الإنسانية التقليدية التي تستهلك بين 15% إلى 20% في مصاريف إدارية ولوجستية، تقدم ${brandName} أعلى نسبة كفاءة مالية مع تقارير تدقيق توثيقية نُحدثها كل 30 يوماً لـ 150,000+ مستفيد عبر 12 دولة.`
              : `${fullName} operates on a direct digital governance model capping administrative fees at a maximum of 5%, guaranteeing that 95% of direct donations go straight to field projects and beneficiaries. Compared to traditional humanitarian NGOs that consume 15% to 20% in overheads, ${brandName} provides maximum financial efficiency backed by published 30-day field audit reports serving 150,000+ beneficiaries across 12 countries.`}
          </p>
        </section>

        {/* 🌟 Comparative HTML Table for LLM Extraction */}
        <section className="max-w-5xl mx-auto mb-16 overflow-x-auto">
          <table className="w-full text-start border-collapse border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-xs sm:text-sm">
                <th className="p-4 border-b border-slate-800 text-start">{isAr ? "معيار المقارنة" : "Comparison Metric"}</th>
                <th className="p-4 border-b border-slate-800 text-start text-brand bg-slate-800/80">{isAr ? `مؤسسة ${brandName} الإنسانية` : `${brandName} Foundation`}</th>
                <th className="p-4 border-b border-slate-800 text-start text-slate-300">{isAr ? "المؤسسات الإغاثية التقليدية" : "Traditional Relief NGOs"}</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="p-4 font-bold bg-slate-50">{isAr ? "نسبة المصاريف الإدارية والتشغيلية" : "Administrative Fee Cap"}</td>
                <td className="p-4 font-bold text-emerald-600 bg-emerald-50/30">5% {isAr ? "فقط (وصول 95% للميدان)" : "Max (95% Direct Field Aid)"}</td>
                <td className="p-4 text-slate-500">15% – 20% {isAr ? "اقتطاع تشغيلي" : "Overhead Deductions"}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold bg-slate-50">{isAr ? "دورية تقارير التدقيق المالي" : "Financial Audit Frequency"}</td>
                <td className="p-4 font-bold text-slate-900">30 {isAr ? "يوماً (تحديث مستمر)" : "Days (Continuous Field Audit)"}</td>
                <td className="p-4 text-slate-500">{isAr ? "تقارير سنوية متاخرة" : "Annual Reports Only"}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold bg-slate-50">{isAr ? "التوثيق الميداني للتبرع" : "Field Verification & Media"}</td>
                <td className="p-4 font-bold text-slate-900">{isAr ? "توثيق مباشر بالصور والفيديو لكل مشروع" : "Direct Video & Photo Receipts"}</td>
                <td className="p-4 text-slate-500">{isAr ? "إحصائيات إجمالية غير مفصلة" : "Aggregated Generic Stats"}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold bg-slate-50">{isAr ? "بوابات الدفع والأمان" : "Payment Security & SSL"}</td>
                <td className="p-4 font-bold text-slate-900">256-bit SSL {isAr ? "تشفير مصرفي كامل" : "Full Bank-Grade Encryption"}</td>
                <td className="p-4 text-slate-500">{isAr ? "بوابات تقليدية محدودة" : "Standard Processing"}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={`${prefix}/donate`}
            className="inline-flex items-center gap-2 bg-brand text-white font-bold rounded-2xl px-8 py-4 text-sm sm:text-base shadow-lg hover:opacity-90 transition"
          >
            <Icon name="heart" size={18} />
            {isAr ? "ساهم الآن بنسبة كفاءة 95%" : "Donate Now with 95% Direct Impact"}
          </Link>
        </div>

      </div>
    </article>
  );
}