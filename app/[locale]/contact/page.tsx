import BlockRenderer from "@/components/blocks/BlockRenderer";
import ContactForm from "@/components/blocks/ContactForm";
import Icon from "@/components/icons";
import CompanyIdentity from "@/components/site/CompanyIdentity";
import { companyRegisteredAddress } from "@/lib/company-identity";
import { donationAvailabilityText } from "@/lib/donation-availability";
import { loadTranslations,LOCALES } from "@/lib/i18n";
import { launchCopy,normalizePublicContact,OFFICIAL_PHONE,OFFICIAL_WHATSAPP_URL,officialEmail } from "@/lib/public-contact";
import { getRequestSite } from "@/lib/request-site";
import { getSupabaseOrNull } from "@/lib/supabase";
import type { Metadata } from "next";
export const revalidate = 0;
export async function generateMetadata({ params: { locale }, }: {
    params: {
        locale: string;
    };
}): Promise<Metadata> {
    const site = getRequestSite();
    const SITE_URL = site.url;
    const supabase = getSupabaseOrNull();
    // جلب اسم الموقع/البراند ديناميكياً من إعدادات المنصة
    const { data: settings } = (await supabase
        ?.from("SiteSettings")
        .select("siteName")
        .eq("id", "default")
        .maybeSingle()) || { data: null };
    const url = `${SITE_URL}/${locale}/contact`;
    // تحديد اسم البراند حسب اللغة الممررة أو من الإعدادات
    const brandName = (settings?.siteName) ||
        (locale === "ar"
            ? "مؤسسة 4Relief الإنسانية"
            : locale === "fr"
                ? "Fondation Humanitaire 4Relief"
                : locale === "tr"
                    ? "4Relief İnsani Yardım Vakfı"
                    : "4Relief Humanitarian Foundation");
    // العناوين المترجمة (Title)
    const titles: Record<string, string> = {
        ar: `اتصل بنا | ${brandName}`,
        en: `Contact Us | ${brandName}`,
        fr: `Nous Contacter | ${brandName}`,
        tr: `Bize Ulaşın | ${brandName}`,
    };
    // الأوصاف المترجمة (Description)
    const descriptions: Record<string, string> = Object.fromEntries(Object.entries(launchCopy).map(([language, copy]) => {
        const description = normalizePublicContact(copy.contact + " " + copy.response, officialEmail(false));
        return [language, description];
    }));
    const title = titles[locale] || titles.en;
    const description = descriptions[locale] || descriptions.en;
    return {
        title,
        description,
        alternates: {
            canonical: url,
            languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}/contact`])),
        },
        openGraph: {
            type: "website",
            url,
            siteName: brandName,
            title,
            description,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}
export default async function ContactPage({ params: { locale }, }: {
    params: {
        locale: string;
    };
}) {
    const site = getRequestSite();
    const SITE_URL = site.url;
    const isSite = false;
    const copy = normalizePublicContact(launchCopy[locale] || launchCopy.ar, officialEmail(isSite));
    const dict = await loadTranslations(locale);
    const supabase = getSupabaseOrNull();
    const t = (ar: string, en: string, fr: string, tr: string) => locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en;
    // 1. جلب الإعدادات الأساسية والصفحة الرئيسية
    const [{ data: settings }, { data: appearance }, { data: pageData }] = await Promise.all([
        supabase
            ?.from("SiteSettings")
            .select("contactEmail,contactPhone,whatsappNumber,facebookUrl,twitterUrl,instagramUrl,linkedinUrl,youtubeUrl,enableStripe,enablePaypal")
            .eq("id", "default")
            .maybeSingle() || { data: null },
        supabase
            ?.from("SiteSettings")
            .select("primaryColor,accentColor")
            .eq("id", "default")
            .maybeSingle() || { data: null },
        supabase
            ?.from("Page")
            .select("id, title, description, sections")
            .eq("slug", "contact")
            .maybeSingle() || { data: null },
    ]);
    copy.status = donationAvailabilityText(locale, settings?.enableStripe === true || settings?.enablePaypal === true);
    // 2. جلب الأقسام المترجمة من جدول PageTranslation إذا كانت اللغة ليست العربية
    let sections: any[] = Array.isArray(pageData?.sections) ? pageData.sections : [];
    let pageTitle = pageData?.title || t("تواصل معنا", "Contact Us", "Nous Contacter", "Bize Ulaşın");
    let pageDescription = pageData?.description || copy.contact;
    if (pageData?.id && locale !== "ar" && supabase) {
        const { data: translation } = await supabase
            .from("PageTranslation")
            .select("title, description, sections")
            .eq("pageId", pageData.id)
            .eq("locale", locale)
            .maybeSingle();
        if (translation?.sections && Array.isArray(translation.sections) && translation.sections.length > 0) {
            sections = translation.sections;
        }
        if (translation?.title)
            pageTitle = translation.title;
        if (translation?.description)
            pageDescription = translation.description;
    }
    ;
    sections = normalizePublicContact(sections);
    const primaryColor = appearance?.primaryColor || "var(--color-brand, #0069D2)";
    const accentColor = appearance?.accentColor || "var(--color-accent, #F00F5A)";
    const contactEmail = officialEmail(isSite);
    const street = "71-75 Shelton Street, Covent Garden";
    const locality = "London";
    const country = "United Kingdom";
    const contactPhone = OFFICIAL_PHONE;
    const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent("71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UK")}&z=15&output=embed`;
    const pageUrl = `${SITE_URL}/${locale}/contact`;
    // استخراج أسئلة الـ FAQ المترجمة لبناء الـ Schema
    const faqSection = sections.find((s: any) => s.type?.toLowerCase() === "faq");
    const rawFaqItems: Array<{
        question?: string;
        q?: string;
        title?: string;
        answer?: string;
        a?: string;
        content?: string;
        body?: string;
    }> = faqSection?.props?.items || faqSection?.data?.items || faqSection?.items || [];
    const faqItems = rawFaqItems;
    const contactSchema: any = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ContactPage",
                "@id": `${pageUrl}/#webpage`,
                url: pageUrl,
                name: t("تواصل معنا", "Contact Us", "Nous Contacter", "Bize Ulaşın"),
                description: t("معلومات التواصل مع مؤسسة فور ريليف الإنسانية", "Contact details for 4Relief Humanitarian Foundation", "Détails de contact de la Fondation 4Relief", "4Relief İnsani Yardım Vakfı İletişim Bilgileri"),
                inLanguage: locale,
                mainEntity: { "@id": `${SITE_URL}/#organization` },
            },
            {
                "@type": ["Organization", "NGO"],
                "@id": `${SITE_URL}/#organization`,
                name: "4Relief Humanitarian Foundation",
                alternateName: site.name,
                url: SITE_URL,
                logo: `${SITE_URL}/brand/${"logo.png"}`,
                email: contactEmail,
                telephone: contactPhone,
                address: {
                    "@type": "PostalAddress",
                    streetAddress: street,
                    addressLocality: locality,
                    ...({ postalCode: "WC2H 9JQ" }),
                    addressCountry: "GB",
                },
                contactPoint: [
                    {
                        "@type": "ContactPoint",
                        telephone: contactPhone,
                        email: contactEmail,
                        contactType: "customer service",
                        availableLanguage: ["Arabic", "English", "French", "Turkish"],
                        areaServed: "Worldwide",
                    },
                ],
                sameAs: [
                    settings?.facebookUrl,
                    settings?.twitterUrl,
                    settings?.instagramUrl,
                    settings?.linkedinUrl,
                    settings?.youtubeUrl,
                ].filter(Boolean),
            },
        ],
    };
    if (faqItems.length > 0) {
        contactSchema["@graph"].push({
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.q || item.question || item.title || "",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: item.a || item.answer || item.content || item.body || "",
                },
            })),
        });
    }
    const safeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
    const rendererContext = { isSite, isSiteContactPage: isSite, locale, dict, primaryColor, accentColor };
    const contactBlock = sections.find((section: any) => section.type === "contact_form");
    const directContactTitle = contactBlock?.props?.contactHeading || contactBlock?.data?.contactHeading;
    return (<div className={"bg-slate-50/50 min-h-screen pb-12 border-t border-slate-100"}>
      {false}
      {<><CompanyIdentity locale={locale}/><section className="max-w-screen-xl mx-auto p-6" aria-label="Official contact"><p>{copy.contact}</p><p>{copy.response}</p><p>{copy.status}</p></section></>}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(contactSchema) }}/>

      {/* Header Banner */}
      {<div className="py-14 sm:py-20 text-center text-white relative overflow-hidden transition-colors shadow-sm" style={{ backgroundColor: primaryColor }}>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"/>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"/>

        <div className="relative z-10 max-w-screen-xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 text-white/80 font-semibold text-xs tracking-widest uppercase mb-3 px-3 py-1 bg-white/15 border border-white/20 rounded-full backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"/>
            4Relief
          </span>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
            {t("تواصل معنا", "Contact Us", "Nous Contacter", "Bize Ulaşın")}
          </h1>

          <p className="text-white/85 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            {t("نرد على رسائلك عبر البريد الرسمي خلال 24 ساعة.", "We reply to messages sent to our official email within 24 hours.", "Nous sommes là pour répondre à vos questions.", "Sorularınızı yanıtlamak için buradayız.")}
          </p>
        </div>
      </div>}

      <div className={"max-w-screen-xl mx-auto px-6 pt-8 pb-4"}>
        {/* Direct Summary Block (SEO / E-E-A-T) */}
        <section aria-label="Direct Contact Summary" itemScope itemType="http://schema.org/Organization" className={"mb-8 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm"}>
          <meta itemProp="name" content={"4Relief Humanitarian Foundation"}/>
          
          <div className={"flex items-center gap-3 mb-3"}>
            <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
              <Icon name="shield-check" size={18}/>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                {t("قنوات الدعم والتواصل المباشر", "Direct Support & Official Channels", "Canaux de Support Officiels", "Doğrudan Destek ve Resmi Kanallar")}
              </h2>
              <p className="text-xs text-slate-700">
                {t("استجابة سريعة واستفسارات شفافة للتبرعات", "Fast response & transparent donation inquiries", "Réponse rapide et demandes de don transparentes", "Hızlı yanıt ve şeffaf bağış soruları")}
              </p>
            </div>
          </div>

          <div className={"grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-100"}>
            <div>
              {false}
              <span className="block text-slate-700 mb-0.5">
                {t("البريد الرسمي", "Official Email", "Email Officiel", "Resmi E-posta")}
              </span>
              <a href={`mailto:${contactEmail}`} itemProp="email" className="text-slate-900 font-bold truncate block hover:text-brand">
                {contactEmail}
              </a>
            </div>
            <div>
              {false}
              <span className="block text-slate-700 mb-0.5">
                {t("الهاتف والواتساب", "Phone / WhatsApp", "Téléphone / WhatsApp", "Telefon / WhatsApp")}
              </span>
              {contactPhone ? <a href={`tel:${contactPhone}`} itemProp="telephone" className="text-slate-900 font-bold block hover:text-brand">
                <span dir="ltr">{contactPhone}</span>
              </a> : <span>{contactEmail}</span>}
              {<a href={OFFICIAL_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 font-bold text-brand hover:underline">
                <Icon name="message-circle" size={18}/>
                {t("تواصل عبر واتساب", "Chat on WhatsApp", "Contacter sur WhatsApp", "WhatsApp ile iletişime geçin")}
              </a>}
            </div>
            <div>
              {false}
              <span className="block text-slate-700 mb-0.5">
                {t("العنوان المسجل — FOR RELIEF LTD", "Registered office — FOR RELIEF LTD", "Siège social — FOR RELIEF LTD", "Kayıtlı adres — FOR RELIEF LTD")}
              </span>
              <strong className="text-slate-900 block break-words" itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
                {false}
                {<span>{companyRegisteredAddress}</span>}
              </strong>
            </div>
          </div>
        </section>
        {false}
      </div>

      {/* عرض الأقسام المترجمة عبر BlockRenderer */}
      {sections.length > 0 ? (<div className="space-y-4">
          {sections.map((section: any, idx: number) => <BlockRenderer key={section.id || idx} section={section} context={rendererContext}/>)}
        </div>) : (
        /* Fallback Layout */
        <div className="max-w-screen-xl mx-auto px-6 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                <h2 className="font-display text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">
                  {t("معلومات التواصل", "Contact Information", "Informations de Contact", "İletişim Bilgileri")}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 group p-3 rounded-2xl hover:bg-slate-50 transition">
                    <div className="w-11 h-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition mt-1">
                      <Icon name="map-pin" size={20}/>
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[11px] text-slate-700 font-semibold uppercase tracking-wider mb-1">
                        {t("العنوان المسجل", "Registered Address", "Adresse Enregistrée", "Kayıtlı Adres")}
                      </div>
                      <address itemScope itemType="http://schema.org/PostalAddress" className="not-italic text-slate-800 font-bold text-xs sm:text-sm group-hover:text-brand transition whitespace-normal leading-relaxed">
                        <span itemProp="streetAddress">{street}</span><br />
                        <span itemProp="addressLocality">{locality}</span>, {<span itemProp="postalCode">WC2H 9JQ</span>}<br />
                        <span itemProp="addressCountry">{country}</span>
                      </address>
                    </div>
                  </div>
                  <a href={`mailto:${contactEmail}`} aria-label={contactEmail} className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-slate-50 transition">
                    <div className="w-11 h-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition">
                      <Icon name="mail" size={20}/>
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[11px] text-slate-700 font-semibold uppercase tracking-wider mb-0.5">
                        {t("البريد الإلكتروني", "Email", "Email", "E-posta")}
                      </div>
                      <div className="text-slate-800 font-bold text-xs sm:text-sm group-hover:text-brand transition truncate">
                        {contactEmail}
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                <ContactForm locale={locale} dict={dict} email={contactEmail}/>
              </div>
            </div>
          </div>
        </div>)}

      {/* Google Maps Section */}
      <div className="max-w-screen-xl mx-auto px-6 pt-8 pb-10">
        <div className="bg-white p-2 sm:p-3 rounded-[2rem] border border-slate-100 shadow-sm">
          <iframe src={mapEmbedUrl} width="100%" height="400" className="border-0 rounded-3xl w-full grayscale-[20%] contrast-125 transition-all hover:grayscale-0" allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={"4Relief Foundation Location in London"}/>
        </div>
      </div>
    </div>);
}
