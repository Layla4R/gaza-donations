import { loadTranslations } from "@/lib/i18n";
import { getSupabaseOrNull } from "@/lib/supabase";
import ContactForm from "@/components/blocks/ContactForm";
import Icon from "@/components/icons";

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await loadTranslations(locale);
  const supabase = getSupabaseOrNull();
  const { data: settings } = await supabase?.from("SiteSettings").select("contactEmail,contactPhone,whatsappNumber,facebookUrl,twitterUrl,instagramUrl").eq("id","default").maybeSingle() || { data: null };

  const t = (ar: string, en: string, fr: string, tr: string) =>
    locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en;

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#001E5A] via-[#003C9E] to-[#0057C2] py-12 sm:py-20 text-center">
        <div className="max-w-screen-xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 text-white/60 text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            <span className="w-6 h-px bg-white/40 inline-block" />
            4Relief
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {t("تواصل معنا", "Contact Us", "Nous Contacter", "Bize Ulaşın")}
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            {t("نحن هنا للإجابة على استفساراتك ومساعدتك.", "We're here to answer your questions and help you.", "Nous sommes là pour répondre à vos questions.", "Sorularınızı yanıtlamak için buradayız.")}
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Contact info */}
          <div>
            <h2 className="font-display text-2xl font-bold text-ink mb-8">
              {t("معلومات التواصل", "Contact Information", "Informations de Contact", "İletişim Bilgileri")}
            </h2>
            <div className="space-y-5">
              {settings?.contactEmail && (
                <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition">
                    <Icon name="mail" size={20} className="text-brand group-hover:text-white transition" />
                  </div>
                  <div>
                    <div className="text-xs text-muted font-semibold uppercase tracking-wider mb-0.5">{t("البريد الإلكتروني","Email","Email","E-posta")}</div>
                    <div className="text-ink font-semibold group-hover:text-brand transition">{settings.contactEmail}</div>
                  </div>
                </a>
              )}
              {settings?.contactPhone && (
                <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition">
                    <Icon name="phone" size={20} className="text-brand group-hover:text-white transition" />
                  </div>
                  <div>
                    <div className="text-xs text-muted font-semibold uppercase tracking-wider mb-0.5">{t("الهاتف","Phone","Téléphone","Telefon")}</div>
                    <div className="text-ink font-semibold">{settings.contactPhone}</div>
                  </div>
                </a>
              )}
              {settings?.whatsappNumber && (
                <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366] transition">
                    <Icon name="message-circle" size={20} className="text-[#25D366] group-hover:text-white transition" />
                  </div>
                  <div>
                    <div className="text-xs text-muted font-semibold uppercase tracking-wider mb-0.5">WhatsApp</div>
                    <div className="text-ink font-semibold group-hover:text-[#25D366] transition">{t("راسلنا على واتساب","Message us on WhatsApp","Écrivez-nous sur WhatsApp","WhatsApp'tan yazın")}</div>
                  </div>
                </a>
              )}
            </div>

            {/* Response time */}
            <div className="mt-10 bg-brand/5 border border-brand/15 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-bold text-ink">{t("وقت الاستجابة","Response Time","Délai de Réponse","Yanıt Süresi")}</span>
              </div>
              <p className="text-sm text-muted">
                {t("نرد على جميع الاستفسارات خلال 24-48 ساعة في أيام العمل.","We respond to all inquiries within 24-48 hours on business days.","Nous répondons à toutes les demandes sous 24-48 heures les jours ouvrés.","İş günlerinde 24-48 saat içinde tüm sorulara yanıt veriyoruz.")}
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-display text-2xl font-bold text-ink mb-8">
              {t("أرسل لنا رسالة", "Send Us a Message", "Envoyez-nous un Message", "Bize Mesaj Gönderin")}
            </h2>
            <ContactForm locale={locale} dict={dict} email={settings?.contactEmail || "info@forrelief.org"} />
          </div>
        </div>
      </div>
    </div>
  );
}
