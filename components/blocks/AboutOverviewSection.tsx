import Image from "next/image";
import Icon from "@/components/icons";

interface Props {
  data?: any;
  locale?: string;
}

export default function AboutOverviewSection({ data, locale = "ar" }: Props) {
  const isAr = locale === "ar";

  // 🌟 تحويل العنوان إلى صيغة سؤال مباشر يبحث عنه الذكاء الاصطناعي (Question-based H2)
  const heading = isAr
    ? data?.heading_ar || "ما هي رؤية مؤسسة 4Relief الإنسانية وكيف تضمن الشفافية المالية؟"
    : data?.heading_en || "What is the mission of 4Relief Humanitarian Foundation and how is transparency ensured?";

  // 🌟 صياغة فقرة مستقلة (Self-Contained Passage) تشتمل على كثافة إحصائية صريحة
  const defaultQuote = isAr
    ? "تلتزم مؤسسة 4Relief Humanitarian Foundation بتقديم الإغاثة الإنسانية المباشرة بأعلى معايير الحوكمة المالية، حيث نطبق نسبة مصاريف تشغيلية لا تتجاوز 5% لضمان وصول 95% من التبرعات لمستحقيها. نجحت المنصة منذ تأسيسها عام 2024 في دعم 150,000+ مستفيد وتغطية 12+ دولة متأثرة بالأزمات بتمويل تجاوز $482,300."
    : "4Relief Humanitarian Foundation is dedicated to delivering direct emergency relief with maximum financial transparency, maintaining a strict 5% administrative fee cap to ensure 95% of donations reach the field. Since 2024, the foundation has supported 150,000+ beneficiaries across 12 crisis-affected regions with over $482,300 in aid.";

  const quote = isAr
    ? data?.quote_ar || defaultQuote
    : data?.quote_en || defaultQuote;

  const cards = data?.cards || [
    {
      title_ar: "نسبة اقتطاع تشغيلي 5%",
      title_en: "5% Administrative Cap",
      desc_ar: "تضمن مؤسسة 4Relief وصول 95% من أموال التبرعات المباشرة للمشاريع الميدانية والإغاثية.",
      desc_en: "4Relief Foundation guarantees that 95% of direct donations go straight to field relief projects.",
      icon: "shield-check",
    },
    {
      title_ar: "150,000+ مستفيد",
      title_en: "150,000+ Beneficiaries",
      desc_ar: "وصلت المساعدات الغذائية والطبية والطارئة لأكثر من 150,000 فرد في المجتمعات الأكثر احتياجاً.",
      desc_en: "Food, medical, and emergency aid reached over 150,000 individuals in vulnerable communities.",
      icon: "heart",
    },
    {
      title_ar: "12+ دولة ومناطق أزمات",
      title_en: "12+ Countries Covered",
      desc_ar: "تغطي استجابة 4Relief الميدانية أكثر من 12 دولة عبر شبكة شركاء موثقين ومعتمدين.",
      desc_en: "4Relief field response covers more than 12 countries through vetted local partners.",
      icon: "globe",
    },
    {
      title_ar: "تقارير توثيق كل 30 يوماً",
      title_en: "30-Day Audit Reports",
      desc_ar: "تحديثات ميدانية ودوريات تدقيق مالي دورية تمكن المتبرع من تتبع أثر المساعدات بالصور والبيانات.",
      desc_en: "Field updates and financial audit reports allow donors to track impact with photos and metrics.",
      icon: "file-text",
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* 🌟 H2 Title formatted as direct query */}
        <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-snug max-w-4xl mx-auto">
          {heading}
        </h2>
        
        {/* 🌟 Self-contained text paragraph with high statistical density */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm max-w-4xl mx-auto mb-12 text-slate-700 text-sm sm:text-base leading-relaxed text-start sm:text-center">
          <p className="font-medium">
            {quote}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card: any, idx: number) => {
            const title = isAr ? card.title_ar : card.title_en;
            const desc = isAr ? card.desc_ar : card.desc_en;

            return (
              <article
                key={idx}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col group text-start"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={title || "About card image"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand/5 flex items-center justify-center text-brand/30">
                      <Icon name={card.icon || "globe"} size={36} />
                    </div>
                  )}
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-100 text-brand z-10">
                    <Icon name={card.icon || "globe"} size={20} />
                  </div>
                </div>

                {/* Card Content */}
                <div className="pt-8 pb-6 px-5 flex-1 flex flex-col items-center text-center">
                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}