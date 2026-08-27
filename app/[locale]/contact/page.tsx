import type { Metadata } from "next";
import { loadTranslations, LOCALES } from "@/lib/i18n";
import { getSupabaseOrNull } from "@/lib/supabase";
import ContactForm from "@/components/blocks/ContactForm";
import Icon from "@/components/icons";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://forrelief.org";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const url = `${SITE_URL}/${locale}/contact`;
  const isAr = locale === "ar";

  const title = isAr
    ? "اتصل بنا | مؤسسة فور ريليف الإنسانية"
    : "Contact Us | 4Relief Humanitarian Foundation";

  const description = isAr
    ? "تواصل مع فريق مؤسسة 4Relief الإنسانية عبر البريد الإلكتروني، الهاتف، أو الواتساب. نحن هنا للإجابة عن جميع استفسارات التبرع والدعم."
    : "Get in touch with 4Relief Humanitarian Foundation team via email, phone, or WhatsApp for donation inquiries and support.";

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${SITE_URL}/${l}/contact`])
      ),
    },
    openGraph: {
      type: "website",
      url,
      siteName: "4Relief",
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

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const dict = await loadTranslations(locale);
  const supabase = getSupabaseOrNull();

  const [{ data: settings }, { data: appearance }] = await Promise.all([
    supabase
      ?.from("SiteSettings")
      .select(
        "contactEmail,contactPhone,whatsappNumber,facebookUrl,twitterUrl,instagramUrl,linkedinUrl,youtubeUrl"
      )
      .eq("id", "default")
      .maybeSingle() || { data: null },
    supabase
      ?.from("SiteSettings")
      .select("primaryColor,accentColor")
      .eq("id", "default")
      .maybeSingle() || { data: null },
  ]);

  const primaryColor = appearance?.primaryColor || "var(--color-brand, #0069D2)";
  const contactEmail = settings?.contactEmail || "info@forrelief.org";
  const contactPhone = settings?.contactPhone || settings?.whatsappNumber || "+44 20 1234 5678";

  const t = (ar: string, en: string, fr: string, tr: string) =>
    locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en;

  const mapEmbedUrl = `https://maps.google.com/maps?q=71-75%20Shelton%20Street,%20Covent%20Garden,%20London,%20WC2H%209JQ,%20UK&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const pageUrl = `${SITE_URL}/${locale}/contact`;

  // 🌟 Schema محسّنة ومطابقة للأنواع المعيارية القياسية (Organization + ContactPoint)
  const contactSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: t("تواصل معنا", "Contact Us", "Nous Contacter", "Bize Ulaşın"),
        description: t(
          "معلومات التواصل مع مؤسسة فور ريليف الإنسانية",
          "Contact details for 4Relief Humanitarian Foundation",
          "Détails de contact de la Fondation 4Relief",
          "4Relief İnsani Yardım Vakfı İletişim Bilgileri"
        ),
        inLanguage: locale,
        mainEntity: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": ["Organization", "NGO"],
        "@id": `${SITE_URL}/#organization`,
        name: "4Relief Humanitarian Foundation",
        alternateName: "4Relief",
        url: SITE_URL,
        logo: `${SITE_URL}/brand/logo.png`,
        email: contactEmail,
        telephone: contactPhone,
        address: {
          "@type": "PostalAddress",
          streetAddress: "71-75 Shelton Street, Covent Garden",
          addressLocality: "London",
          postalCode: "WC2H 9JQ",
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

  const safeJsonLd = (data: unknown) =>
    JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <div className="bg-slate-50/50 min-h-screen pb-12 border-t border-slate-100">
      {/* 🌟 Structured Data Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(contactSchema) }}
      />

      {/* Header Banner */}
      <div
        className="py-14 sm:py-20 text-center text-white relative overflow-hidden transition-colors shadow-sm"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 text-white/80 font-semibold text-xs tracking-widest uppercase mb-3 px-3 py-1 bg-white/15 border border-white/20 rounded-full backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            4Relief
          </span>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
            {t("تواصل معنا", "Contact Us", "Nous Contacter", "Bize Ulaşın")}
          </h1>

          <p className="text-white/85 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            {t(
              "نحن هنا للإجابة على استفساراتك ومساعدتك في أي وقت.",
              "We're here to answer your questions and help you anytime.",
              "Nous sommes là pour répondre à vos questions.",
              "Sorularınızı yanıtlamak için buradayız."
            )}
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 pt-8 pb-12">
        {/* 🌟 Direct Answer Block & Microdata wrapper for AI/SEO Crawlers */}
        <section
          aria-label="Direct Contact Summary"
          itemScope
          itemType="http://schema.org/Organization"
          className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-sm"
        >
          <meta itemProp="name" content="4Relief Humanitarian Foundation" />
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
              <Icon name="shield-check" size={18} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                {t(
                  "قنوات الدعم والتواصل المباشر",
                  "Direct Support & Official Channels",
                  "Canaux de Support Officiels",
                  "Doğrudan Destek ve Resmi Kanallar"
                )}
              </h2>
              <p className="text-xs text-slate-700">
                {t(
                  "استجابة سريعة واستفسارات شفافة للتبرعات",
                  "Fast response & transparent donation inquiries",
                  "Réponse rapide et demandes de don transparentes",
                  "Hızlı yanıt ve şeffaf bağış soruları"
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div>
              <span className="block text-slate-700 mb-0.5">
                {t("البريد الرسمي", "Official Email", "Email Officiel", "Resmi E-posta")}
              </span>
              <a href={`mailto:${contactEmail}`} itemProp="email" className="text-slate-900 font-bold truncate block hover:text-brand">
                {contactEmail}
              </a>
            </div>
            <div>
              <span className="block text-slate-700 mb-0.5">
                {t("الهاتف والواتساب", "Phone / WhatsApp", "Téléphone / WhatsApp", "Telefon / WhatsApp")}
              </span>
              <a href={`tel:${contactPhone}`} itemProp="telephone" className="text-slate-900 font-bold block hover:text-brand">
                {contactPhone}
              </a>
            </div>
            <div>
              <span className="block text-slate-700 mb-0.5">
                {t("المقر الرئيسي", "Headquarters", "Siège Social", "Genel Merkez")}
              </span>
              <strong className="text-slate-900 block truncate" itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
                <span itemProp="addressLocality">London</span>, <span itemProp="addressCountry">United Kingdom</span>
              </strong>
            </div>
          </div>
        </section>

        {/* Main Contact Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <h2 className="font-display text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">
                {t(
                  "معلومات التواصل",
                  "Contact Information",
                  "Informations de Contact",
                  "İletişim Bilgileri"
                )}
              </h2>

              <div className="space-y-4">
                {/* Registered Address */}
                <div className="flex items-start gap-4 group p-3 rounded-2xl hover:bg-slate-50 transition">
                  <div className="w-11 h-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition mt-1">
                    <Icon name="map-pin" size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[11px] text-slate-700 font-semibold uppercase tracking-wider mb-1">
                      {t("العنوان المسجل", "Registered Address", "Adresse Enregistrée", "Kayıtlı Adres")}
                    </div>
                    <address itemScope itemType="http://schema.org/PostalAddress" className="not-italic text-slate-800 font-bold text-xs sm:text-sm group-hover:text-brand transition whitespace-normal leading-relaxed">
                      <span itemProp="streetAddress">71-75 Shelton Street, Covent Garden</span><br />
                      <span itemProp="addressLocality">London</span>, <span itemProp="postalCode">WC2H 9JQ</span><br />
                      <span itemProp="addressCountry">United Kingdom</span>
                    </address>
                  </div>
                </div>

                <a
                  href={`mailto:${contactEmail}`}
                  aria-label={contactEmail}
                  className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-slate-50 transition"
                >
                  <div className="w-11 h-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition">
                    <Icon name="mail" size={20} />
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

                {settings?.contactPhone && (
                  <a
                    href={`tel:${settings.contactPhone}`}
                    aria-label={settings.contactPhone}
                    className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-slate-50 transition"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition">
                      <Icon name="phone" size={20} />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-700 font-semibold uppercase tracking-wider mb-0.5">
                        {t("الهاتف", "Phone", "Téléphone", "Telefon")}
                      </div>
                      <div className="text-slate-800 font-bold text-xs sm:text-sm group-hover:text-brand transition">
                        {settings.contactPhone}
                      </div>
                    </div>
                  </a>
                )}

                {settings?.whatsappNumber && (
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact on WhatsApp"
                    className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-slate-50 transition"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition">
                      <Icon name="message-circle" size={20} />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-700 font-semibold uppercase tracking-wider mb-0.5">
                        WhatsApp
                      </div>
                      <div className="text-slate-800 font-bold text-xs sm:text-sm group-hover:text-emerald-600 transition">
                        {t(
                          "راسلنا على واتساب",
                          "Message us on WhatsApp",
                          "Écrivez-nous sur WhatsApp",
                          "WhatsApp'tan yazın"
                        )}
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Response Time Badge */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  {t("وقت الاستجابة", "Response Time", "Délai de Réponse", "Yanıt Süresi")}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {t(
                  "نرد على جميع الاستفسارات خلال 24-48 ساعة في أيام العمل.",
                  "We respond to all inquiries within 24-48 hours on business days.",
                  "Nous répondons à toutes les demandes sous 24-48 heures les jours ouvrés.",
                  "İş günlerinde 24-48 saat içinde tüm sorulara yanıt veriyoruz."
                )}
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                {t(
                  "أرسل لنا رسالة",
                  "Send Us a Message",
                  "Envoyez-nous un Message",
                  "Bize Mesaj Gönderin"
                )}
              </h2>
              <ContactForm
                locale={locale}
                dict={dict}
                email={contactEmail}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="max-w-screen-xl mx-auto px-6 pb-10">
        <div className="bg-white p-2 sm:p-3 rounded-[2rem] border border-slate-100 shadow-sm">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="400"
            className="border-0 rounded-3xl w-full grayscale-[20%] contrast-125 transition-all hover:grayscale-0"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="4Relief Foundation Location in London"
          ></iframe>
        </div>
      </div>
    </div>
  );
}