"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner({ locale = "ar" }: { locale?: string }) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "accepted") {
      enablePixels();
    }
  }, []);

  const enablePixels = () => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("consent", "grant");
    }
  };

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShowBanner(false);
    enablePixels();
  };

  const handleReject = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  const t = {
    ar: {
      title: "مؤسسة 4Relief الإنسانية",
      desc: "في مؤسسة 4Relief، نولي أهمية قصوى لخصوصية وأمان بياناتك الشخصية. نستخدم ملفات تعريف الارتباط لضمان حماية بياناتك وفق المعايير القانونية ولتحسين تجربة تصفحك. يمكنك معرفة المزيد عبر",
      policy: "سياسة الكوكيز",
      accept: "قبول الكل",
      reject: "رفض الكل",
    },
    en: {
      title: "4Relief Humanitarian Foundation",
      desc: "At 4Relief, we prioritize the security and privacy of your personal data. We use cookies to process and protect your data according to legal standards and to enhance your experience. Learn more in our",
      policy: "Cookie Policy",
      accept: "Accept All",
      reject: "Reject All",
    },
    tr: {
      title: "4Relief İnsani Yardım Vakfı",
      desc: "4Relief olarak, kişisel verilerinizin güvenliğine önem veriyoruz. Çerez verilerinizin hukuka uygun işlenmesi, korunması ve deneyiminizi geliştirmek için azami hassasiyeti gösteriyoruz. Detaylı bilgi için",
      policy: "Çerez Politikası",
      accept: "Tümünü Kabul Et",
      reject: "Tümünü Reddet",
    },
    fr: {
      title: "Fondation Humanitaire 4Relief",
      desc: "Chez 4Relief, nous accordons une importance primordiale à la sécurité de vos données. Nous utilisons des cookies pour protéger vos données selon les normes légales et améliorer votre expérience. En savoir plus dans notre",
      policy: "Politique relative aux cookies",
      accept: "Tout accepter",
      reject: "Tout refuser",
    },
  };

  const text = t[locale as keyof typeof t] || t.en;

  return (
    <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800">
        <h3 className="font-display font-extrabold text-base mb-2 text-white">{text.title}</h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          {text.desc}{" "}
          <Link href={`/${locale}/cookie-policy`} className="text-brand-light font-bold underline">
            {text.policy}
          </Link>.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 bg-brand hover:opacity-90 active:scale-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md"
          >
            {text.accept}
          </button>
          <button
            onClick={handleReject}
            className="flex-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl transition-all"
          >
            {text.reject}
          </button>
        </div>
      </div>
    </div>
  );
}