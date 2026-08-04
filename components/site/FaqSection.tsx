"use client";
import { useState } from "react";

export default function FaqSection({
  locale,
  dict,
  data,
}: {
  locale: string;
  dict: Record<string, string>;
  data?: any;
}) {
  const [open, setOpen] = useState<number | null>(0);

  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] ||
    (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);

  // 1. قراءة البيانات من الأدمن فقط (بدون أي نصوص افتراضية)
  const title = data?.headline || data?.title;
  const subtitle = data?.subheading || data?.subtitle || data?.description;
  const items = data?.items || []; // مصفوفة الأسئلة من الأدمن

  // إذا لم يقم الأدمن بإدخال عنوان أو أسئلة، لا داعي لعرض القسم فارغاً
  if (!title && items.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-brand font-semibold text-xs tracking-[0.3em] uppercase mb-4">
              <span className="w-6 h-px bg-brand/40 inline-block" />
              {t(
                "faq.eyebrow",
                "أسئلة المتبرعين",
                "Donor Questions",
                "Questions des Donateurs",
                "Bağışçı Soruları",
              )}
            </span>

            {title && (
              <h2 className="font-display text-4xl font-extrabold text-ink mb-4">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="text-muted text-base max-w-md mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Questions */}
        {items.length > 0 && (
          <div className="space-y-3">
            {items.map((item: any, i: number) => (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${open === i ? "border-brand/30 shadow-sm shadow-brand/5" : "border-line hover:border-brand/20"}`}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-right"
                >
                  <span
                    className={`font-semibold text-base leading-snug transition-colors ${open === i ? "text-brand" : "text-ink"}`}
                  >
                    {/* دعم مفاتيح مختلفة بناءً على محرر الأدمن */}
                    {item.q || item.question || item.title}
                  </span>
                  <div
                    className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      open === i
                        ? "bg-brand border-brand text-white"
                        : "border-line bg-white text-muted"
                    }`}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{
                        transform: open === i ? "rotate(45deg)" : "none",
                        transition: "transform 0.2s",
                      }}
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </button>

                {open === i && (
                  <div className="px-6 pb-6">
                    <div className="h-px bg-line mb-4" />
                    <p className="text-muted leading-loose text-[15px]">
                      {item.a || item.answer || item.content || item.body}{" "}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA (أزرار التواصل الثابتة من تصميم الموقع) */}
        <div className="mt-10 text-center rounded-2xl bg-[#F4F7FD] border border-line p-7">
          <p className="text-ink font-semibold mb-1">
            {t(
              "faq.more",
              "لديك سؤال آخر؟",
              "Have another question?",
              "Vous avez une autre question ?",
              "Başka sorunuz mu var?",
            )}
          </p>
          <p className="text-muted text-sm mb-5">
            {t(
              "faq.contact_sub",
              "فريقنا يرد خلال 24 ساعة على أي استفسار",
              "Our team responds within 24 hours",
              "Notre équipe répond sous 24 heures",
              "Ekibimiz 24 saat içinde yanıt verir",
            )}
          </p>
          <a
            href="mailto:info@forrelief.org"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl px-6 py-3 text-sm transition"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {t(
              "nav.contact",
              "تواصل معنا",
              "Contact Us",
              "Nous Contacter",
              "Bize Ulaşın",
            )}
          </a>
        </div>
      </div>
    </section>
  );
}
