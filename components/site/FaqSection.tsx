"use client";
import { useState } from "react";

const FAQ_DATA: Record<string, { q: string; a: string }[]> = {
  ar: [
    {
      q: "هل تبرعاتي تصل مباشرة إلى المستفيدين؟",
      a: "نعم. تُحوَّل التبرعات مباشرةً إلى المستفيدين عبر شركاء ميدانيين موثوقين ومعتمدين دولياً. نُصدر إيصالاً إلكترونياً فورياً لكل تبرع، ونُتيح لك متابعة أثر مساهمتك عبر تقارير دورية شفافة تُنشر على منصتنا.",
    },
    {
      q: "ما وسائل الدفع المقبولة وهل هي آمنة؟",
      a: "نقبل جميع بطاقات الائتمان والخصم المباشر (Visa، Mastercard، Amex) إضافةً إلى PayPal. جميع المعاملات مشفّرة بمعيار SSL 256-bit ومتوافقة مع أعلى معايير أمان المدفوعات الدولية PCI-DSS، ولا نحتفظ بأي بيانات بطاقتك لدينا.",
    },
    {
      q: "هل يمكنني التبرع شهرياً وإيقافه متى أشاء؟",
      a: "بالطبع. يمكنك إعداد تبرع شهري متكرر بنقرة واحدة، وإيقافه أو تعديله في أي وقت من حسابك الشخصي دون أي رسوم أو إشعار مسبق. ستتلقى تأكيداً فورياً بكل خطوة.",
    },
  ],
  en: [
    {
      q: "Does my donation reach beneficiaries directly?",
      a: "Yes. Donations are transferred directly to beneficiaries through trusted, internationally accredited field partners. You receive an instant electronic receipt for every donation, and you can track your contribution's impact through transparent periodic reports published on our platform.",
    },
    {
      q: "What payment methods are accepted and are they secure?",
      a: "We accept all major credit and debit cards (Visa, Mastercard, Amex) as well as PayPal. All transactions are encrypted with 256-bit SSL and comply with the highest international payment security standards (PCI-DSS). We never store your card details.",
    },
    {
      q: "Can I set up monthly donations and cancel anytime?",
      a: "Absolutely. You can set up a recurring monthly donation with a single click and pause, modify, or cancel it at any time from your personal account — no fees, no notice required. You'll receive instant confirmation at every step.",
    },
  ],
  fr: [
    {
      q: "Mon don parvient-il directement aux bénéficiaires ?",
      a: "Oui. Les dons sont transférés directement aux bénéficiaires via des partenaires de terrain fiables et accrédités internationalement. Vous recevez un reçu électronique instantané pour chaque don, et vous pouvez suivre l'impact de votre contribution grâce à des rapports périodiques transparents publiés sur notre plateforme.",
    },
    {
      q: "Quels modes de paiement sont acceptés et sont-ils sécurisés ?",
      a: "Nous acceptons toutes les principales cartes de crédit et de débit (Visa, Mastercard, Amex) ainsi que PayPal. Toutes les transactions sont cryptées avec SSL 256 bits et conformes aux normes de sécurité de paiement PCI-DSS. Nous ne stockons jamais vos données de carte.",
    },
    {
      q: "Puis-je faire des dons mensuels et annuler à tout moment ?",
      a: "Absolument. Vous pouvez configurer un don mensuel récurrent en un clic et le suspendre, modifier ou annuler à tout moment depuis votre compte personnel — sans frais ni préavis. Vous recevrez une confirmation instantanée à chaque étape.",
    },
  ],
  tr: [
    {
      q: "Bağışım doğrudan yararlanıcılara ulaşıyor mu?",
      a: "Evet. Bağışlar, uluslararası alanda akredite güvenilir saha ortakları aracılığıyla doğrudan yararlanıcılara aktarılmaktadır. Her bağış için anında elektronik makbuz alırsınız ve katkınızın etkisini platformumuzda yayınlanan şeffaf periyodik raporlar aracılığıyla takip edebilirsiniz.",
    },
    {
      q: "Hangi ödeme yöntemleri kabul ediliyor ve güvenli mi?",
      a: "Tüm büyük kredi ve banka kartlarını (Visa, Mastercard, Amex) ve PayPal'ı kabul ediyoruz. Tüm işlemler 256 bit SSL ile şifrelenir ve en yüksek uluslararası ödeme güvenliği standartlarıyla (PCI-DSS) uyumludur. Kart bilgilerinizi hiçbir zaman saklamıyoruz.",
    },
    {
      q: "Aylık bağış yapabilir ve istediğim zaman iptal edebilir miyim?",
      a: "Elbette. Tek bir tıklamayla aylık tekrarlayan bağış ayarlayabilir, kişisel hesabınızdan istediğiniz zaman duraklatabilir, değiştirebilir veya iptal edebilirsiniz — ücret veya ön bildirim gerekmez. Her adımda anında onay alırsınız.",
    },
  ],
};

export default function FaqSection({ locale, dict }: { locale: string; dict: Record<string, string> }) {
  const [open, setOpen] = useState<number | null>(0);
  const loc = (["ar","en","fr","tr"].includes(locale) ? locale : "ar") as keyof typeof FAQ_DATA;
  const faqs = FAQ_DATA[loc];

  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-brand font-semibold text-xs tracking-[0.3em] uppercase mb-4">
            <span className="w-6 h-px bg-brand/40 inline-block" />
            {t("faq.eyebrow","أسئلة المتبرعين","Donor Questions","Questions des Donateurs","Bağışçı Soruları")}
          </span>
          <h2 className="font-display text-4xl font-extrabold text-ink mb-4">
            {t("faq.title","الأسئلة الشائعة","FAQ","Questions Fréquentes","Sık Sorulan Sorular")}
          </h2>
          <p className="text-muted text-base max-w-md mx-auto leading-relaxed">
            {t("faq.subtitle",
              "كل ما تريد معرفته عن التبرع والشفافية وكيف تعمل منصتنا",
              "Everything you need to know about donating, transparency, and how our platform works",
              "Tout ce que vous devez savoir sur les dons et notre fonctionnement",
              "Bağış, şeffaflık ve platformumuz hakkında bilmeniz gerekenler"
            )}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div key={i}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${open === i ? "border-brand/30 shadow-sm shadow-brand/5" : "border-line hover:border-brand/20"}`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-right"
              >
                <span className={`font-semibold text-base leading-snug transition-colors ${open === i ? "text-brand" : "text-ink"}`}>
                  {item.q}
                </span>
                <div className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  open === i ? "bg-brand border-brand text-white" : "border-line bg-white text-muted"
                }`}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    style={{ transform: open === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </div>
              </button>

              {open === i && (
                <div className="px-6 pb-6">
                  <div className="h-px bg-line mb-4" />
                  <p className="text-muted leading-loose text-[15px]">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center rounded-2xl bg-[#F4F7FD] border border-line p-7">
          <p className="text-ink font-semibold mb-1">
            {t("faq.more","لديك سؤال آخر؟","Have another question?","Vous avez une autre question ?","Başka sorunuz mu var?")}
          </p>
          <p className="text-muted text-sm mb-5">
            {t("faq.contact_sub","فريقنا يرد خلال 24 ساعة على أي استفسار","Our team responds within 24 hours","Notre équipe répond sous 24 heures","Ekibimiz 24 saat içinde yanıt verir")}
          </p>
          <a href="mailto:info@forrelief.org"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl px-6 py-3 text-sm transition">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            {t("nav.contact","تواصل معنا","Contact Us","Nous Contacter","Bize Ulaşın")}
          </a>
        </div>
      </div>
    </section>
  );
}
