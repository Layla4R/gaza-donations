import { loadTranslations } from "@/lib/i18n";
import { getSupabaseOrNull } from "@/lib/supabase";
import ContactForm from "@/components/blocks/ContactForm";
import Icon from "@/components/icons";

export const revalidate = 60;

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await loadTranslations(locale);
  const supabase = getSupabaseOrNull();
  
  // جلب إعدادات الموقع ولون الثيم الأساسي (primaryColor) من الأدمن
  const [{ data: settings }, { data: appearance }] = await Promise.all([
    supabase?.from("SiteSettings").select("contactEmail,contactPhone,whatsappNumber,facebookUrl,twitterUrl,instagramUrl").eq("id","default").maybeSingle() || { data: null },
    supabase?.from("SiteSettings").select("primaryColor,accentColor").eq("id","default").maybeSingle() || { data: null },
  ]);

  const primaryColor = appearance?.primaryColor || "var(--color-brand, #0069D2)";

  const t = (ar: string, en: string, fr: string, tr: string) =>
    locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20 border-t border-slate-100">
      {/* 🌟 Header Banner Colored by Primary Color */}
      <div 
        className="py-14 sm:py-20 text-center text-white relative overflow-hidden transition-colors shadow-sm"
        style={{ backgroundColor: primaryColor }}
      >
        {/* Subtle Light Effect Overlay */}
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
            {t("نحن هنا للإجابة على استفساراتك ومساعدتك في أي وقت.", "We're here to answer your questions and help you anytime.", "Nous sommes là pour répondre à vos questions.", "Sorularınızı yanıtlamak için buradayız.")}
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <h2 className="font-display text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4">
                {t("معلومات التواصل", "Contact Information", "Informations de Contact", "İletişim Bilgileri")}
              </h2>
              
              <div className="space-y-4">
                {settings?.contactEmail && (
                  <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-slate-50 transition">
                    <div className="w-11 h-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition">
                      <Icon name="mail" size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">{t("البريد الإلكتروني","Email","Email","E-posta")}</div>
                      <div className="text-slate-800 font-bold text-xs sm:text-sm group-hover:text-brand transition truncate">{settings.contactEmail}</div>
                    </div>
                  </a>
                )}

                {settings?.contactPhone && (
                  <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-slate-50 transition">
                    <div className="w-11 h-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition">
                      <Icon name="phone" size={20} />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">{t("الهاتف","Phone","Téléphone","Telefon")}</div>
                      <div className="text-slate-800 font-bold text-xs sm:text-sm">{settings.contactPhone}</div>
                    </div>
                  </a>
                )}

                {settings?.whatsappNumber && (
                  <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-slate-50 transition">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition">
                      <Icon name="message-circle" size={20} />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">WhatsApp</div>
                      <div className="text-slate-800 font-bold text-xs sm:text-sm group-hover:text-emerald-600 transition">{t("راسلنا على واتساب","Message us on WhatsApp","Écrivez-nous sur WhatsApp","WhatsApp'tan yazın")}</div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Response Time Badge */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">{t("وقت الاستجابة","Response Time","Délai de Réponse","Yanıt Süresi")}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {t("نرد على جميع الاستفسارات خلال 24-48 ساعة في أيام العمل.","We respond to all inquiries within 24-48 hours on business days.","Nous répondons à toutes les demandes sous 24-48 heures les jours ouvrés.","İş günlerinde 24-48 saat içinde tüm sorulara yanıt veriyoruz.")}
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                {t("أرسل لنا رسالة", "Send Us a Message", "Envoyez-nous un Message", "Bize Mesaj Gönderin")}
              </h2>
              <ContactForm locale={locale} dict={dict} email={settings?.contactEmail || "info@forrelief.org"} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}