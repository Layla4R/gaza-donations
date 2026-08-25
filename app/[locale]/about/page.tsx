import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/icons";
import { getSupabaseOrNull } from "@/lib/supabase";
import { loadTranslations, LOCALES } from "@/lib/i18n";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export const revalidate = 300;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://forrelief.org";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const url = `${SITE_URL}/${locale}/about`;
  const isAr = locale === "ar";

  return {
    title: isAr ? "من نحن | مؤسسة فور ريليف الإنسانية" : "About Us | 4Relief Humanitarian Foundation",
    description: isAr 
      ? "تعرّف على مؤسسة 4Relief الإنسانية، رسالتنا، هيكل الحوكمة المالية، والشركاء الميدانيين."
      : "Learn about 4Relief Humanitarian Foundation, our mission, financial governance, and field partners.",
    alternates: {
      canonical: url,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}/about`])),
    },
  };
}

async function getAboutPageData() {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { page: null, settings: null };

  try {
    const [pageRes, settingsRes] = await Promise.all([
      // البحث عن كلا الرابطين (about أو about-us) لضمان عدم حدوث 404
      supabase
        .from("Page")
        .select("*, blocks:PageBlock(*)")
        .in("slug", ["about", "about-us"])
        .eq("isPublished", true)
        .maybeSingle(),
      supabase
        .from("SiteSettings")
        .select("*")
        .eq("id", "default")
        .maybeSingle(),
    ]);

    return {
      page: pageRes.data,
      settings: settingsRes.data,
    };
  } catch {
    return { page: null, settings: null };
  }
}

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const [{ page, settings }, dict] = await Promise.all([
    getAboutPageData(),
    loadTranslations(locale),
  ]);

  const isAr = locale === "ar";
  const pageUrl = `${SITE_URL}/${locale}/about`;

  // 🌟 Schema متقدمة لصفحة "من نحن"
  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${pageUrl}/#webpage`,
        "url": pageUrl,
        "name": isAr ? "من نحن - مؤسسة 4Relief" : "About Us - 4Relief Foundation",
        "inLanguage": locale,
        "mainEntity": { "@id": `${SITE_URL}/#organization` }
      },
      {
        "@type": "NGO",
        "@id": `${SITE_URL}/#organization`,
        "name": "4Relief Humanitarian Foundation",
        "alternateName": "4Relief",
        "url": SITE_URL,
        "logo": `${SITE_URL}/brand/logo.png`,
        "foundingDate": "2024",
        "knowsAbout": ["Humanitarian Aid", "Emergency Relief", "Financial Transparency", "Zakat"],
        "sameAs": [
          settings?.facebookUrl,
          settings?.twitterUrl,
          settings?.instagramUrl,
          settings?.linkedinUrl,
          settings?.youtubeUrl,
        ].filter(Boolean)
      }
    ]
  };

  const defaultContent = isAr
    ? "مؤسسة 4Relief الإنسانية هي منصة تبرعات مستقلة تأسست بهدف توفير قناة آمنة وشفافة لدعم العائلات المحتاجة حول العالم. نعمل مع شبكة من الشركاء المحليين الموثوقين لضمان وصول المساعدات بأسرع وقت وأقل تكلفة إدارية."
    : "4Relief Humanitarian Foundation is an independent donation platform dedicated to direct relief and transparent aid distribution.";

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 border-t border-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema).replace(/</g, "\\u003c") }}
      />

      <div className="mx-auto max-w-screen-xl px-6 pt-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href={locale === "ar" ? "/" : `/${locale}`} className="hover:text-brand">
            {dict["nav.home"] || "الرئيسية"}
          </Link>
          <span>/</span>
          <span className="text-slate-700">{page?.title || (isAr ? "من نحن" : "About Us")}</span>
        </nav>

        {/* E-E-A-T Credentials Header Block */}
        <section className="mb-10 rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
              <Icon name="shield-check" size={22} />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                {page?.title || (isAr ? "من نحن" : "About Us")}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {isAr ? "مؤسسة إنسانية مستقلة | معلومات التأسيس والحوكمة" : "Independent NGO | Corporate Identity & Governance"}
              </p>
            </div>
          </div>

          {/* Direct Answer Summary Block (لجذب الذكاء الاصطناعي) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium">
            <div>
              <span className="block text-slate-400 text-xs">{isAr ? "سنة التأسيس" : "Founded"}</span>
              <strong className="text-slate-900">2024</strong>
            </div>
            <div>
              <span className="block text-slate-400 text-xs">{isAr ? "الصفة القانونية" : "Legal Entity"}</span>
              <strong className="text-slate-900">{isAr ? "منظمة غير ربحية (NGO)" : "Registered NGO"}</strong>
            </div>
            <div>
              <span className="block text-slate-400 text-xs">{isAr ? "الشفافية المالية" : "Transparency"}</span>
              <strong className="text-brand">100% {isAr ? "تقارير موثقة" : "Audited"}</strong>
            </div>
            <div>
              <span className="block text-slate-400 text-xs">{isAr ? "النطاق الميداني" : "Coverage"}</span>
              <strong className="text-slate-900">12+ {isAr ? "دولة ومتأثر" : "Regions"}</strong>
            </div>
          </div>
        </section>

        {/* Dynamic Blocks or Fallback Content */}
        <main className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
          {page?.blocks && page.blocks.length > 0 ? (
            page.blocks.map((block: any, idx: number) => (
              <BlockRenderer
                key={block.id || idx}
                section={block}
                context={{
                  locale,
                  primaryColor: settings?.primaryColor,
                  accentColor: settings?.accentColor,
                  dict,
                }}
              />
            ))
          ) : (
            <div className="whitespace-pre-line text-slate-700 leading-relaxed sm:text-lg">
              {page?.content || defaultContent}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}