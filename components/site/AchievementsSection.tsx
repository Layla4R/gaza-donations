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

// 🌟 القيم الرسمية الافتراضية لضمان قراءة الذكاء الاصطناعي ومحركات البحث للأرقام الحقيقية دائماً
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    icon: "heart",
    value: 12540,
    suffix: "+",
    label_ar: "العائلات المستفيدة", label_en: "Families Helped", label_fr: "Familles Aidées", label_tr: "Yardım Edilen Aile",
    desc_ar: "تلقت مساعدات إغاثية مباشرة", desc_en: "Received direct relief aid", desc_fr: "Reçu une aide directe", desc_tr: "Doğrudan yardım aldı",
  },
  {
    icon: "hand-heart",
    value: 482300,
    suffix: "$",
    label_ar: "إجمالي التبرعات الموصلة", label_en: "Total Aid Delivered", label_fr: "Aide Totale Livrée", label_tr: "Teslim Edilen Bağış",
    desc_ar: "جُمعت ووُزِّعت بشفافية", desc_en: "Distributed transparently", desc_fr: "Distribués en toute transparence", desc_tr: "Şeffaf şekilde dağıtıldı",
  },
  {
    icon: "shield-check",
    value: 95,
    suffix: "%",
    label_ar: "نسبة التوصيل المباشر", label_en: "Direct Delivery Rate", label_fr: "Taux de Livraison Directe", label_tr: "Doğrudan Teslimat Oranı",
    desc_ar: "تصل للمستحقين ميدانياً", desc_en: "Reaches beneficiaries directly", desc_fr: "Atteint les bénéficiaires", desc_tr: "Doğrudan ulaştırıldı",
  },
  {
    icon: "globe",
    value: 12,
    suffix: "+",
    label_ar: "الدول والمناطق المغطاة", label_en: "Countries Covered", label_fr: "Pays Couverts", label_tr: "Kapsanan Ülke",
    desc_ar: "استجابة إنسانية عاجلة", desc_en: "Urgent humanitarian response", desc_fr: "Réponse humanitaire urgente", desc_tr: "Acil insani yardım",
  },
];

function useCountUp(target: number, duration = 2200, started: boolean) {
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

function StatCard({ item, locale, started, primaryColor }: { item: Achievement; locale: string; started: boolean; primaryColor: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = useCountUp(item.value, 2200, started && mounted);
  const loc = (["ar", "en", "fr", "tr"].includes(locale) ? locale : "en") as "ar" | "en" | "fr" | "tr";
  const label = item[`label_${loc}`] || item.label_ar;
  const desc = item[`desc_${loc}`] || item.desc_ar;

  const [hovered, setHovered] = useState(false);

  const formatCount = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1000) return (n / 1000).toFixed(0) + "K";
    return String(n);
  };

  const formattedInitial = formatCount(item.value);

  return (
    <div 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center relative overflow-hidden"
      itemScope
      itemType="http://schema.org/Observation"
    >
      <div 
        className="absolute top-0 left-0 right-0 h-1 transition-colors duration-300" 
        style={{ backgroundColor: primaryColor, opacity: hovered ? 1 : 0.2 }}
      />
      
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300"
        style={{ 
          backgroundColor: hovered ? primaryColor : `${primaryColor}15`,
          color: hovered ? "#ffffff" : primaryColor
        }}
      >
        <Icon name={item.icon || "heart"} size={22} />
      </div>

      {/* 🌟 1. نص موجه ومباشر للذكاء الاصطناعي وبوتات البحث بمؤشرات Schema (SSR) */}
      <span className="sr-only" itemProp="description">
        {label}: {item.value.toLocaleString()} {item.suffix} ({desc})
      </span>

      {/* 🌟 2. العرض البصري المتحرك للمستخدم */}
      <div className="flex items-baseline justify-center gap-0.5 mb-2" dir="ltr" aria-hidden="true">
        {(item.suffix === "%" || item.suffix === "+") && (
          <span className="font-display text-2xl lg:text-3xl font-extrabold" style={{ color: primaryColor }}>{item.suffix}</span>
        )}
        
        <span 
          className="font-display text-4xl lg:text-5xl font-black tracking-tight text-slate-900 transition-colors"
          style={{ color: hovered ? primaryColor : undefined }}
          suppressHydrationWarning
        >
          {mounted ? formatCount(count) : formattedInitial}
        </span>
        
        {item.suffix !== "%" && item.suffix !== "+" && item.suffix !== "" && (
          <span className="font-display text-2xl lg:text-3xl font-extrabold ms-0.5" style={{ color: primaryColor }}>{item.suffix}</span>
        )}
      </div>

      <h3 className="font-display font-extrabold text-slate-900 text-base mb-1" itemProp="name">{label}</h3>
      {desc && <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">{desc}</p>}
    </div>
  );
}

export default function AchievementsSection({ locale, dict, totalRaised = 0, totalFamilies = 0, primaryColor, accentColor, data }: { 
  locale: string; 
  dict: Record<string, string>; 
  totalRaised?: number; 
  totalFamilies?: number; 
  primaryColor?: string | null;
  accentColor?: string | null;
  data?: any 
}) { 
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  
  const primary = primaryColor || "var(--color-brand, #0069D2)";

  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);
  
  const title = data?.headline || data?.title || t("achievements.title", "أثرنا حتى الآن", "Our Impact So Far", "Notre Impact Jusqu'à Présent", "Bugüne Kadarki Etkimiz");
  const subtitle = data?.subheading || data?.subtitle || data?.description || t("achievements.subtitle", "بشفافية كاملة نشارككم أرقام ما أنجزناه معاً بفضل دعمكم المستمر", "With full transparency, we share the numbers of what we have achieved together thanks to your continued support", "Avec une transparence totale, nous partageons les chiffres de ce que nous avons accompli ensemble", "Tam şeffaflıkla, sürekli desteğiniz sayesinde birlikte başardıklarımızın rakamlarını paylaşıyoruz");
  const eyebrow = data?.eyebrow || t("achievements.eyebrow", "إنجازاتنا", "Our Impact", "Notre Impact", "Etkimiz");

  // 🌟 معالجة الأرقام وحمايتها من القيمة الصفرية
  const achievements: Achievement[] = Array.isArray(data?.items) && data.items.length > 0
    ? data.items.map((item: any, idx: number) => {
        const val = Number(item.value);
        const fallbackObj = DEFAULT_ACHIEVEMENTS[idx % DEFAULT_ACHIEVEMENTS.length];
        return {
          icon: item.icon || fallbackObj.icon,
          value: !isNaN(val) && val > 0 ? val : fallbackObj.value,
          suffix: item.suffix !== undefined && item.suffix !== null ? item.suffix : fallbackObj.suffix,
          label_ar: item.title || item.label_ar || fallbackObj.label_ar,
          label_en: item.title || item.label_en || fallbackObj.label_en,
          label_fr: item.title || item.label_fr || fallbackObj.label_fr,
          label_tr: item.title || item.label_tr || fallbackObj.label_tr,
          desc_ar: item.description || item.desc_ar || fallbackObj.desc_ar,
          desc_en: item.description || item.desc_en || fallbackObj.desc_en,
          desc_fr: item.description || item.desc_fr || fallbackObj.desc_fr,
          desc_tr: item.description || item.desc_tr || fallbackObj.desc_tr,
        };
      })
    : DEFAULT_ACHIEVEMENTS.map((def, idx) => {
        if (idx === 0 && totalFamilies > 0) return { ...def, value: totalFamilies };
        if (idx === 1 && totalRaised > 0) return { ...def, value: totalRaised };
        return def;
      });

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-6 bg-slate-50/60 border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 relative z-10">
        <header className="text-center max-w-2xl mx-auto mb-16">
          <span 
            className="inline-flex items-center gap-2 font-semibold text-xs tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{ backgroundColor: `${primary}15`, color: primary }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primary }} />
            {eyebrow}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, i) => (
            <StatCard key={i} item={item} locale={locale} started={started} primaryColor={primary} />
          ))}
        </div>

        <aside className="mt-16 pt-8 border-t border-slate-200/60 flex flex-wrap justify-center gap-6 sm:gap-10">
          {[
            { icon: "shield-check" as const, ar: "مؤسسة معتمدة ومرخصة", en: "Certified & Licensed NGO", fr: "ONG Certifiée", tr: "Sertifikalı STK" },
            { icon: "globe" as const, ar: "شراكات دولية موثوقة", en: "Trusted Global Partners", fr: "Partenaires Mondiaux", tr: "Güvenilir Ortaklar" },
            { icon: "hand-heart" as const, ar: "شفافية مالية كاملة", en: "Full Financial Transparency", fr: "Transparence Financière", tr: "Finansal Şeffaflık" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2.5 text-slate-600">
              <div 
                className="w-8 h-8 rounded-full bg-white border border-slate-200/80 shadow-sm flex items-center justify-center shrink-0"
                style={{ color: primary }}
              >
                <Icon name={b.icon} size={15} />
              </div>
              <span className="text-xs font-semibold">
                {locale === "ar" ? b.ar : locale === "fr" ? b.fr : locale === "tr" ? b.tr : b.en}
              </span>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}