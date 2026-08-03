"use client";
import { useState } from "react";
import Icon from "@/components/icons";

export default function NewsletterSection({ locale, dict, accentColor }: { locale: string; dict: Record<string, string>; accentColor?: string | null }) {
  const accent = accentColor || "#F00F5A";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch { setStatus("error"); }
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#003C87] via-[#0057C2] to-[#0069D2]" />
      {/* Decorative elements */}
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/5" />
      <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-white/5" />
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-px h-32 bg-white/10 hidden lg:block" />
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-px h-32 bg-white/10 hidden lg:block" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-20 text-center">
        {/* Icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
            <Icon name="mail" size={28} className="text-white" />
          </div>
        </div>

        {/* Eyebrow */}
        <p className="text-white/55 font-semibold text-xs tracking-[0.35em] uppercase mb-4">
          {t("newsletter.eyebrow", "ابقَ على تواصل", "Stay Connected", "Restez Connecté", "Bağlı Kalın")}
        </p>

        {/* Title */}
        <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
          {t("newsletter.title", "اشترك في نشرتنا البريدية", "Subscribe to Our Newsletter", "Abonnez-vous à Notre Newsletter", "Bültenimize Abone Olun")}
        </h2>

        {/* Subtitle */}
        <p className="text-white/65 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          {t("newsletter.subtitle",
            "كن أول من يعلم بأثر تبرعاته وآخر أخبار حملاتنا الإنسانية مباشرة في بريدك.",
            "Be the first to know about your donation impact and the latest from our humanitarian campaigns.",
            "Soyez le premier informé de l'impact de vos dons et des dernières nouvelles de nos campagnes.",
            "Bağışlarınızın etkisini ve insani kampanyalarımızın son haberlerini ilk öğrenen siz olun."
          )}
        </p>

        {/* Form */}
        {status === "success" ? (
          <div className="inline-flex items-center gap-3 bg-white/15 border border-white/25 text-white font-bold rounded-2xl px-8 py-4 text-lg backdrop-blur">
            <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center shrink-0">
              <Icon name="check" size={18} className="text-white" />
            </div>
            {t("newsletter.success",
              "شكراً! تم تسجيل بريدك بنجاح ✨",
              "Thank you! You're now subscribed ✨",
              "Merci ! Vous êtes maintenant abonné ✨",
              "Teşekkürler! Başarıyla abone oldunuz ✨"
            )}
          </div>
        ) : (
          <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <Icon name="mail" size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t("newsletter.placeholder", "بريدك الإلكتروني", "Your email address", "Votre adresse email", "E-posta adresiniz")}
                className="w-full bg-white/10 border-2 border-white/25 hover:border-white/40 focus:border-white/70 text-white placeholder-white/40 rounded-2xl px-5 py-4 pr-12 text-sm font-medium focus:outline-none transition backdrop-blur"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              style={{ background: `linear-gradient(to right, ${accent}, ${accent}cc)` }} className="shrink-0 hover:opacity-90 disabled:opacity-60 text-white font-bold rounded-2xl px-8 py-4 text-sm shadow-lg transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0 flex items-center gap-2 justify-center"
            >
              {status === "loading" ? (
                <><Icon name="minus" size={16} className="animate-spin" /> ...</>
              ) : (
                <>{t("newsletter.btn", "اشترك الآن", "Subscribe Now", "S'abonner", "Abone Ol")}<Icon name="send" size={16} /></>
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-red-300 text-sm">
            {t("newsletter.error", "حدث خطأ، حاول مجدداً.", "Something went wrong, please try again.", "Une erreur s'est produite.", "Bir hata oluştu.")}
          </p>
        )}

        {/* Trust note */}
        <p className="mt-6 text-white/40 text-xs flex items-center justify-center gap-1.5">
          <Icon name="shield-check" size={13} />
          {t("newsletter.trust", "لن نشارك بريدك مع أي جهة. يمكنك إلغاء الاشتراك في أي وقت.",
            "We'll never share your email. Unsubscribe anytime.",
            "Nous ne partagerons jamais votre email. Désabonnez-vous à tout moment.",
            "E-postanızı asla paylaşmayacağız. İstediğiniz zaman aboneliği iptal edebilirsiniz."
          )}
        </p>
      </div>
    </section>
  );
}
