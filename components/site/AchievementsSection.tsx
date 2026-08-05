"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/icons";

interface Achievement {
  icon: "heart" | "hand-heart" | "globe" | "shield-check" | "droplet" | "book-open" | "utensils" | "cross";
  value: number;
  suffix: string;
  label_ar: string; label_en: string; label_fr: string; label_tr: string;
  desc_ar: string; desc_en: string; desc_fr: string; desc_tr: string;
}

function useCountUp(target: number, duration = 2000, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * ease));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

function StatCard({ item, locale, dict, started }: { item: Achievement; locale: string; dict: Record<string, string>; started: boolean }) {
  const count = useCountUp(item.value, 2200, started);
  const loc = (["ar","en","fr","tr"].includes(locale) ? locale : "en") as "ar"|"en"|"fr"|"tr";
  const label = item[`label_${loc}`];
  const desc = item[`desc_${loc}`];

  const formatCount = (n: number) => {
    if (item.value >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (item.value >= 1000) return (n / 1000).toFixed(0) + "K";
    return n.toLocaleString();
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-line p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col items-center text-center">
      {/* Background accent - 🌟 يأخذ لون الثيم bg-brand */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-brand transition-opacity" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-brand opacity-5 group-hover:opacity-10 transition-opacity" />

      {/* Icon - 🌟 لون الثيم مع خلفية مناسبة */}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto bg-cream border border-line text-brand">
        <Icon name={item.icon} size={26} />
      </div>

      {/* Number - 🌟 لون الثيم مع توسيط وترتيب ذكي للرموز */}
      <div className="flex items-baseline justify-center gap-1 mb-2" dir="ltr">
        {(item.suffix === "%" || item.suffix === "+") && (
          <span className="font-display text-3xl font-extrabold text-brand">{item.suffix}</span>
        )}
        
        <span className="font-display text-4xl font-extrabold text-brand">
          {formatCount(count)}
        </span>
        
        {item.suffix !== "%" && item.suffix !== "+" && item.suffix !== "" && (
          <span className="font-display text-3xl font-extrabold text-brand">{item.suffix}</span>
        )}
      </div>

      <h3 className="font-display text-lg font-bold text-ink mb-1.5">{label}</h3>
      <p className="text-muted text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export default function AchievementsSection({ locale, dict, totalRaised = 0, totalFamilies = 0, data }: { locale: string; dict: Record<string, string>; totalRaised?: number; totalFamilies?: number; data?: any }) { 
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  
  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);
  
  const title = data?.headline || data?.title || t("achievements.title", "أثرنا بالأرقام", "Our Impact in Numbers", "Notre Impact en Chiffres", "Rakamlarla Etkimiz");
  const subtitle = data?.subheading || data?.subtitle || data?.description || t("achievements.subtitle", "بشفافية كاملة نشارككم أرقام ما أنجزناه معاً بفضل دعمكم المستمر", "With full transparency, we share the numbers of what we have achieved together thanks to your continued support", "Avec une transparence totale, nous partageons les chiffres de ce que nous avons accompli ensemble", "Tam şeffaflıkla, sürekli desteğiniz sayesinde birlikte başardıklarımızın rakamlarını paylaşıyoruz");
  
  // 🌟 القراءة بالكامل من الأدمن (مع التخليص من خاصية اللون الثابت)
  const achievements: Achievement[] = Array.isArray(data?.items) && data.items.length > 0
    ? data.items.map((item: any) => ({
        icon: item.icon || "heart",
        value: Number(item.value) || 0,
        suffix: item.suffix || "",
        label_ar: item.title || item.label_ar || "",
        label_en: item.title || item.label_en || "",
        label_fr: item.title || item.label_fr || "",
        label_tr: item.title || item.label_tr || "",
        desc_ar: item.description || item.desc_ar || "",
        desc_en: item.description || item.desc_en || "",
        desc_fr: item.description || item.desc_fr || "",
        desc_tr: item.description || item.desc_tr || "",
      }))
    : [
        {
          icon: "heart" as const, value: totalFamilies || 0, suffix: "+",
          label_ar: "أسرة مستفيدة", label_en: "Families Helped", label_fr: "Familles Aidées", label_tr: "Yardım Edilen Aile",
          desc_ar: "أسرة تلقت مساعدات مباشرة", desc_en: "Families received direct aid", desc_fr: "Familles ont reçu une aide directe", desc_tr: "Aile doğrudan yardım aldı",
        },
        {
          icon: "hand-heart" as const, value: totalRaised || 0, suffix: "$",
          label_ar: "إجمالي التبرعات", label_en: "Total Donations", label_fr: "Total des Dons", label_tr: "Toplam Bağış",
          desc_ar: "دولار جُمعت ووُزِّعت بشفافية", desc_en: "Raised & distributed transparently", desc_fr: "Collectés et distribués en toute transparence", desc_tr: "Şeffaf şekilde toplanıp dağıtıldı",
        },
      ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 bg-dashbg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand/3 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent/3 blur-3xl" />

      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-brand font-semibold text-xs tracking-[0.3em] uppercase mb-4">
            <span className="w-6 h-px bg-brand/40 inline-block" />
            {t("achievements.eyebrow", "إنجازاتنا", "Our Impact", "Notre Impact", "Etkimiz")}
            <span className="w-6 h-px bg-brand/40 inline-block" />
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-ink mb-4 leading-tight">
            {title}
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, i) => (
            <StatCard key={i} item={item} locale={locale} dict={dict} started={started} />
          ))}
        </div>

        {/* Bottom trust badges */}
        <div className="mt-14 flex flex-wrap justify-center gap-8">
          {[
            { icon: "shield-check" as const, ar: "مؤسسة معتمدة ومرخصة", en: "Certified & Licensed NGO", fr: "ONG Certifiée", tr: "Sertifikalı STK" },
            { icon: "globe" as const, ar: "شراكات دولية موثوقة", en: "Trusted Global Partners", fr: "Partenaires Mondiaux", tr: "Güvenilir Ortaklar" },
            { icon: "hand-heart" as const, ar: "شفافية مالية كاملة", en: "Full Financial Transparency", fr: "Transparence Financière", tr: "Finansal Şeffaflık" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-3 text-muted">
              {/* 🌟 تعديل الأيقونات السفلية لتقرأ من لون الثيم بأمان */}
              <div className="w-10 h-10 rounded-xl bg-cream border border-line flex items-center justify-center shrink-0">
                <Icon name={b.icon} size={18} className="text-brand" />
              </div>
              <span className="text-sm font-semibold">
                {locale === "ar" ? b.ar : locale === "fr" ? b.fr : locale === "tr" ? b.tr : b.en}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}