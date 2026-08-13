"use client";
import Image from "next/image";
import Icon from "@/components/icons";

interface Props {
  data?: any;
  locale?: string;
}

export default function AboutOverviewSection({ data, locale = "ar" }: Props) {
  if (!data) return null;

  const isAr = locale === "ar";

  const heading = isAr
    ? data.heading_ar || "مؤسسة 4Relief الإنسانية"
    : data.heading_en || "4Relief Humanitarian Foundation";

  const quote = isAr
    ? data.quote_ar || "سيكون هدفنا ورسالتنا السعي جاهدين لجعل هذا العمل الإنساني قائماً على البُعد الإنساني المحض"
    : data.quote_en || "Our goal and mission is to strive towards making this relief work purely driven by human dignity";

  const cards = data.cards || [];

  return (
    <section className="py-8 sm:py-20 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-brand mb-3">
          {heading}
        </h2>
        
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
          ‘‘ {quote} ‘‘
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card: any, idx: number) => {
            const title = isAr ? card.title_ar : card.title_en;
            const desc = isAr ? card.desc_ar : card.desc_en;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col group"
              >
                {/* 🌟 تثبيت أبعاد الحاوية باستخدام aspect-ratio لمنع CLS */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  {card.image && (
                    <Image
                      src={card.image}
                      alt={title || "About card image"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-100 text-brand z-10">
                    <Icon name={card.icon || "globe"} size={20} />
                  </div>
                </div>

                <div className="pt-8 pb-6 px-5 flex-1 flex flex-col items-center text-center">
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}