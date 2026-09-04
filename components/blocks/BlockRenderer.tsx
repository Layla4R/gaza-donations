import Image from "next/image";
import Link from "next/link";
import { PageSection } from "@/lib/blocks";
import { formatCurrency } from "@/lib/format";
import DonationWidget from "@/components/site/DonateWidget";
import ContactForm from "@/components/blocks/ContactForm";
import NewsletterForm from "@/components/blocks/NewsletterForm";
import CampaignCard from "@/components/blocks/CampaignCard";
import Icon from "@/components/icons";
import CountUp from "@/components/blocks/CountUp";
import AboutOverviewSection from "./AboutOverviewSection";
import HeroSection from "@/components/site/HeroSection"; 
import NewsSection from "@/components/site/NewsSection"; // 🌟 تم استيراد مكون الأخبار/القصص
import type { CampaignLite } from "@/lib/pageData";
import FaqSection from "../site/FaqSection";

interface RendererContext {
  campaigns?: CampaignLite[];
  whiteBackground?: boolean;
  locale?: string;
  dict?: Record<string, string>;
  primaryColor?: string | null;
  accentColor?: string | null;
  posts?: any[];
  stats?: any;
  settings?: any;
  isDestekol?: boolean;
}

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-brand font-semibold text-xs tracking-widest uppercase mb-3 px-3 py-1 bg-brand/5 rounded-full ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-brand" />
      {children}
    </span>
  );
}

export default function BlockRenderer({
  section,
  context,
}: {
  section: PageSection;
  context?: RendererContext;
}) {
  const p = section.props || (section as any).data || {};

  const primary = context?.primaryColor || "var(--color-brand, #0069D2)";
  const accent = context?.accentColor || "var(--color-accent, #F00F5A)";
  const isRTL = context?.locale === "ar";
  const locale = context?.locale || "ar";

  const getLocalizedLink = (url?: string, defaultFallback = "/") => {
    if (!url) return locale === "ar" ? defaultFallback : `/${locale}${defaultFallback}`;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    const langPrefix = `/${locale}`;

    if (locale === "ar") return cleanUrl;
    
    if (cleanUrl.startsWith(`${langPrefix}/`) || cleanUrl === langPrefix) {
      return cleanUrl;
    }
    
    return `${langPrefix}${cleanUrl}`;
  };

  switch (section.type) {
    case "hero":
      return (
        <HeroSection
          locale={locale}
          dict={context?.dict || {}}
          primaryColor={primary}
          accentColor={accent}
          data={p}
          isDestekol={context?.isDestekol}
        />
      );

    case "about_overview":
      return (
        <AboutOverviewSection 
          data={p} 
          locale={locale} 
        />
      );

    case "our_work":
    case "sectors": {
      const defaultSectors = [
        {
          id: "food",
          title: locale === "ar" ? "الغذاء العاجل والاحتياجات الأساسية" : "Emergency Food & Essential Needs",
          description: locale === "ar" ? "تقديم السلال الغذائية والوجبات الساخنة للأسر الأكثر هشاشة في بؤر النزوح والفقر." : "Providing emergency food parcels and hot meals to vulnerable families in crisis areas.",
          icon: "utensils"
        },
        {
          id: "shelter",
          title: locale === "ar" ? "المأوى ودعم الحياة العاجل" : "Emergency Shelter & Life Support",
          description: locale === "ar" ? "توفير الخيام العازلة، تجهيزات التدفئة، والمستلزمات المعيشية الطارئة للعائلات المتضررة." : "Providing weather-proof tents, heating equipment, and essential living supplies.",
          icon: "home"
        },
        {
          id: "health",
          title: locale === "ar" ? "الصحة والمساعدة الطبية" : "Health & Medical Aid",
          description: locale === "ar" ? "إمداد النقاط الطبية بالأدوية والمستلزمات، ودعم رعاية المرضى والجرحى في المناطق الحرجة." : "Supplying medical points with pharmaceuticals and supporting patient care in critical zones.",
          icon: "heart-pulse"
        },
        {
          id: "wash",
          title: locale === "ar" ? "المياه النظيفة والنظافة الصحية (WASH)" : "Clean Water & Sanitation (WASH)",
          description: locale === "ar" ? "نقل مياه الشرب المعقمة عبر الصهاريج، وإنشاء وحدات التنقية والإصحاح البيئي." : "Delivering purified drinking water via tankers, and installing filtration and sanitation units.",
          icon: "droplet"
        },
        {
          id: "agriculture",
          title: locale === "ar" ? "الأمن الغذائي والزراعة المستدامة" : "Food Security & Sustainable Agriculture",
          description: locale === "ar" ? "دعم المشاريع الزراعية المصغرة والمطابخ المجتمعية لتوفير مصادر غذاء دائم." : "Supporting micro-farming initiatives and community kitchens for sustainable food sources.",
          icon: "sprout"
        },
        {
          id: "livelihood",
          title: locale === "ar" ? "سبل العيش والتمكين الاقتصادي" : "Livelihoods & Economic Empowerment",
          description: locale === "ar" ? "تمويل المشاريع الصغيرة وتدريب الأفراد على مهن إنتاجية تحقق لهم الاستقلال المالي." : "Funding small businesses and vocational training to build financial independence.",
          icon: "briefcase"
        },
        {
          id: "women",
          title: locale === "ar" ? "تمكين المرأة" : "Women's Empowerment",
          description: locale === "ar" ? "إطلاق برامج تدريبية وإنتاجية تعزز دور المرأة القيادي والاقتصادي داخل معيل الأسرة." : "Launching vocational and productive programs to enhance women's economic role.",
          icon: "user-check"
        },
        {
          id: "child_protection",
          title: locale === "ar" ? "حماية الطفل" : "Child Protection",
          description: locale === "ar" ? "توفير بيئات آمنة للأطفال في مناطق النزوح وحمايتهم من الاستغلال والإهمال." : "Creating safe spaces for children in displacement zones and protecting them from vulnerability.",
          icon: "shield"
        },
        {
          id: "psychosocial",
          title: locale === "ar" ? "الدعم النفسي والاجتماعي" : "Psychosocial Support",
          description: locale === "ar" ? "تقديم جلسات الدعم النفسي وتجاوز الصدمات للأطفال والنساء المتأثرين بالحروب." : "Providing trauma healing and mental health support sessions for affected children and women.",
          icon: "smile"
        },
        {
          id: "education",
          title: locale === "ar" ? "برنامج دعم التعليم" : "Education Support Program",
          description: locale === "ar" ? "توزيع الحقائب المدرسية وتأمين مساحات تعليمية بديلة للأطفال الانقطاع عن الدراسة." : "Providing school supplies and alternative learning spaces for out-of-school children.",
          icon: "book-open"
        },
        {
          id: "energy",
          title: locale === "ar" ? "الطاقة المتجددة" : "Renewable Energy",
          description: locale === "ar" ? "تزويد المرافق الإغاثية ومحطات المياه بأنظمة الطاقة الشمسية لضمان استمرارية الخدمات." : "Equipping relief facilities and water stations with solar energy systems.",
          icon: "sun"
        },
        {
          id: "partnerships",
          title: locale === "ar" ? "الشراكات المحلية وبناء القدرات" : "Local Partnerships & Capacity Building",
          description: locale === "ar" ? "التنسيق المباشر مع المنظمات الميدانية لتطوير آليات الاستجابة وتأهيل الكوادر." : "Collaborating directly with field organizations to elevate response mechanisms.",
          icon: "users"
        }
      ];

      const sectors = p.items && p.items.length > 0 ? p.items : defaultSectors;
      const title = p.title || (locale === "ar" ? "من الاستجابة العاجلة إلى الحلول التنموية المستدامة" : "From Emergency Response to Sustainable Solutions");
      const subtitle = p.subtitle || (locale === "ar" ? "نستجيب اليوم للاحتياجات الطارئة للمتضررين من الأزمات والكوارث، ونؤسس معهم غداً لبيئة تمكينية تساعدهم على استعادة كرامتهم وإعادة بناء مستقبلهم." : "Responding to immediate emergency needs while laying the groundwork for sustainable community recovery.");
      const eyebrow = p.eyebrow || (locale === "ar" ? "مجالات عملنا" : "Our Sectors");

      const sectorsSchema = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "NGO",
            "@id": "https://forrelief.org/#organization",
            "name": "4Relief",
            "url": "https://forrelief.org"
          },
          {
            "@type": "ItemList",
            "name": title,
            "description": subtitle,
            "itemListElement": sectors.map((item: any, index: number) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Service",
                "name": item.title,
                "description": item.description || item.body,
                "provider": { "@id": "https://forrelief.org/#organization" }
              }
            }))
          }
        ]
      };

      return (
        <section className="py-20 sm:py-24 bg-slate-50/60 border-t border-slate-100">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(sectorsSchema) }}
          />
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
                {title}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sectors.map((item: any, index: number) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand group-hover:text-white transition-all duration-300">
                      <Icon name={item.icon || "layers"} size={22} />
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 mb-3 group-hover:text-brand transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.description || item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "projects": {
      const defaultProjects = [
        {
          title: locale === "ar" ? "مشروع صهاريج مياه الشرب المعقمة" : "Clean Water Tankers Project",
          category: locale === "ar" ? "الإصحاح المائي (WASH)" : "Water & Sanitation",
          location: locale === "ar" ? "غزة — المخيمات ومراكز الإيواء" : "Gaza — Shelter Camps",
          status: locale === "ar" ? "قيد التنفيذ المستمر" : "Active Field Operation",
          image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80",
          description: locale === "ar" ? "نقل وتوزيع آلاف اللترات من مياه الشرب المعقمة يومياً على الأسر النازحة للوقاية من تلوث المياه والأمراض." : "Daily distribution of purified drinking water via mobile tankers to displaced families.",
          buttonText: locale === "ar" ? "استعرض تفاصيل المشروع" : "View Project Details",
          buttonLink: "/campaigns"
        },
        {
          title: locale === "ar" ? "المخبز الآلي المجتمعي للوجبات اليومية" : "Community Automatic Bakery Project",
          category: locale === "ar" ? "الأمن الغذائي" : "Food Security",
          location: locale === "ar" ? "شمال قطاع غزة" : "North Gaza",
          status: locale === "ar" ? "استجابة عاجلة" : "Emergency Response",
          image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
          description: locale === "ar" ? "تشغيل مخبز مجتمعي لإنتاج وتوزيع ربطات الخبز الطازج مجاناً للأسر التي تعاني من المجاعة والجوع الحاد." : "Operating a local bakery to produce and distribute free fresh bread parcels daily.",
          buttonText: locale === "ar" ? "استعرض تفاصيل المشروع" : "View Project Details",
          buttonLink: "/campaigns"
        },
        {
          title: locale === "ar" ? "النقاط الطبية والمستشفيات الميدانية" : "Mobile Clinics & Field Hospitals",
          category: locale === "ar" ? "الرعاية الصحية" : "Health & Medical",
          location: locale === "ar" ? "المناطق الحرجة والبؤر الأشد احتياجاً" : "Critical Emergency Zones",
          status: locale === "ar" ? "دعم مباشر" : "Direct Support",
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
          description: locale === "ar" ? "تزويد المراكز الصحية والأطباء بالمستلزمات والأدوية الطبية العاجلة لإسعاف الجرحى وتأمين الرعاية." : "Supplying field clinics with vital pharmaceuticals and medical supplies.",
          buttonText: locale === "ar" ? "استعرض تفاصيل المشروع" : "View Project Details",
          buttonLink: "/campaigns"
        }
      ];

      const projects = p.items && p.items.length > 0 ? p.items : defaultProjects;
      const title = p.title || (locale === "ar" ? "نُحوّل العطاء إلى أثرٍ تنموي ملموس" : "Transforming Support into Tangible Field Impact");
      const subtitle = p.subtitle || (locale === "ar" ? "أعدّت محفظة مشاريعنا الاستراتيجية لتلبية الاحتياجات الأساسية وإعادة بناء المجتمعات المتأثرة بالأزمات بكرامة وشفافية." : "Strategic projects designed to meet urgent needs and empower vulnerable communities.");
      const eyebrow = p.eyebrow || (locale === "ar" ? "مشاريعنا الميدانية" : "Our Field Projects");

      const projectsSchema = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "NGO",
            "@id": "https://forrelief.org/#organization",
            "name": "4Relief",
            "url": "https://forrelief.org"
          },
          {
            "@type": "ItemList",
            "name": title,
            "description": subtitle,
            "itemListElement": projects.map((item: any, index: number) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Project",
                "name": item.title,
                "description": item.description,
                "image": item.image,
                "location": {
                  "@type": "Place",
                  "name": item.location || "Gaza"
                },
                "keywords": item.category,
                "fundraiser": { "@id": "https://forrelief.org/#organization" }
              }
            }))
          }
        ]
      };

      return (
        <section className="py-20 sm:py-24 bg-white border-t border-slate-100">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
          />
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
                {title}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((item: any, index: number) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {item.image && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                          {item.category && (
                            <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold">
                              {item.category}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-6 sm:p-8">
                      {item.location && (
                        <div className="flex items-center gap-1.5 text-xs text-brand font-bold mb-3">
                          <Icon name="globe" size={14} />
                          <span>{item.location}</span>
                        </div>
                      )}

                      <h3 className="font-display text-xl font-bold text-slate-900 mb-3 group-hover:text-brand transition-colors leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        {item.description || item.body}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                    <Link
                      href={getLocalizedLink(item.buttonLink, "/campaigns")}
                      className="inline-flex items-center justify-center gap-2 w-full border border-slate-200 text-slate-800 hover:bg-brand hover:text-white hover:border-brand font-bold rounded-2xl py-3 px-4 text-sm transition-all shadow-sm"
                    >
                      {item.buttonText || (locale === "ar" ? "استعرض المشروع" : "View Details")}
                      <Icon name={isRTL ? "arrow-left" : "arrow-down"} size={16} className={isRTL ? "" : "-rotate-90"} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "stats":
      return (
        <section 
          className="relative py-16 sm:py-20 text-white overflow-hidden bg-brand transition-colors"
          style={{ backgroundColor: primary }}
        >
          <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-screen-xl mx-auto px-6">
            {p.title && (
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white text-center mb-12 tracking-tight">
                {p.title}
              </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
              {(p.items || []).map((item: any, i: number) => (
                <div key={i} className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 shadow-sm">
                  <div className="font-display text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight">
                    <span className="sr-only">{item.value} {item.title}</span>
                    <CountUp
                      value={item.value}
                    />
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-bold uppercase tracking-wider">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case "text": {
      const align = p.align || "right";
      return (
        <section className="py-16 sm:py-20 bg-white">
          <div className={`max-w-screen-xl mx-auto px-6 text-${align}`}>
            {p.title && (
              <div className="mb-6">
                <span className="inline-block w-12 h-1.5 rounded-full mb-4 bg-brand" style={{ backgroundColor: primary }} />
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 leading-snug tracking-tight">
                  {p.title}
                </h2>
              </div>
            )}
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg whitespace-pre-line">
              {p.body}
            </p>
          </div>
        </section>
      );
    }

    case "image_text": {
      const imageFirst = p.imagePosition !== "right";

      const imageBlock = (
        <div className="relative">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 shadow-xl border border-slate-100">
            {p.image && (
              <Image 
                src={p.image} 
                alt={p.title || "Section Image"} 
                fill 
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover" 
              />
            )}
          </div>
        </div>
      );

      const textBlock = (
        <div>
          <span className="inline-block w-10 h-1.5 rounded-full mb-4 bg-accent" style={{ backgroundColor: accent }} />
          {p.title && <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{p.title}</h2>}
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">{p.body}</p>
        </div>
      );

      return (
        <section className="py-16 sm:py-24 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 items-center">
            {imageFirst ? (
              <>
                {imageBlock}
                {textBlock}
              </>
            ) : (
              <>
                {textBlock}
                {imageBlock}
              </>
            )}
          </div>
        </section>
      );
    }

    case "donation_buttons":
      return (
        <DonationWidget
          locale={locale}
          dict={context?.dict || {}}
          primaryColor={context?.primaryColor}
          accentColor={context?.accentColor}
          data={p}
        />
      );

    case "campaigns_grid": {
      let campaigns = context?.campaigns || [];
      if (p.onlyFeatured) campaigns = campaigns.filter((c) => c.isFeatured);
      campaigns = campaigns.slice(0, p.limit || 6);

      const isEnglish = locale === "en";
      const isTurkish = locale === "tr";
      const isFrench = locale === "fr";

      const eyebrowText = isEnglish
        ? "Where Your Donation Goes"
        : isTurkish
        ? "Bağışınız Nereye Gidiyor"
        : isFrench
        ? "Où va votre don"
        : "أين يذهب تبرعك";

      const viewAllText = isEnglish
        ? "View All Campaigns"
        : isTurkish
        ? "Tüm Kampanyaları Gör"
        : isFrench
        ? "Voir Toutes les Campagnes"
        : "عرض كل الحملات";

      const noCampaignsText = isEnglish
        ? "No campaigns available."
        : isTurkish
        ? "Şu anda kampanya bulunmamaktadır."
        : isFrench
        ? "Aucune campagne disponible."
        : "لا توجد حملات حالياً.";

      const campaignsListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": p.title || "4Relief Campaigns",
        "itemListElement": campaigns.map((c, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "MonetaryGrant",
            "name": c.title,
            "description": c.summary,
            "image": c.coverImage,
            "url": `https://forrelief.org/${locale}/campaigns/${c.slug}`
          }
        }))
      };

      return (
        <section className="py-20 sm:py-24 bg-white">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(campaignsListSchema) }}
          />
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Eyebrow className="justify-center">{eyebrowText}</Eyebrow>
              {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">{p.title}</h2>}
              {p.subtitle && <p className="text-slate-500 text-sm sm:text-base">{p.subtitle}</p>}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {campaigns.map((c) => (
                <CampaignCard
                  key={c.id}
                  id={c.id}
                  slug={c.slug}
                  title={c.title}
                  summary={c.summary}
                  coverImage={c.coverImage}
                  goalAmount={c.goalAmount}
                  raisedAmount={c.raisedAmount}
                  donorCount={c.donorCount}
                  category={c.category}
                  locale={locale}
                  dict={context?.dict || {}}
                />
              ))}
              {campaigns.length === 0 && (
                <p className="text-slate-500 col-span-full text-center py-10">{noCampaignsText}</p>
              )}
            </div>
            {campaigns.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  href={getLocalizedLink("/campaigns")}
                  className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 font-bold rounded-2xl px-8 py-3.5 text-sm transition-all shadow-sm"
                >
                  {viewAllText}
                  <Icon name={isRTL ? "arrow-left" : "arrow-down"} size={16} className={isRTL ? "" : "-rotate-90"} />
                </Link>
              </div>
            )}
          </div>
        </section>
      );
    }

    case "full_image":
      return (
        <div className="w-full bg-white py-8">
          {p.src && (
            <div className="max-w-screen-xl mx-auto px-6">
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-md border border-slate-100">
                <Image
                  src={p.src}
                  alt={p.alt || "Full width image"}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}
          {p.caption && (
            <p className="text-center text-xs text-slate-500 py-3 px-6">{p.caption}</p>
          )}
        </div>
      );

    case "gallery":
      return (
        <section className="py-12 bg-slate-50/50 border-t border-slate-100">
          <div className="max-w-screen-xl mx-auto px-6">
            {p.title && (
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="inline-flex items-center gap-2 text-brand font-semibold text-xs tracking-widest uppercase mb-2 px-3 py-1 bg-brand/5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  {locale === "en"
                    ? "Gallery & Impact"
                    : locale === "tr"
                    ? "Başarı Galerisi"
                    : locale === "fr"
                    ? "Galerie de Réalisations"
                    : "معرض الإنجازات"}
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {p.title}
                </h2>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(p.items || p.images || []).map((item: any, i: number) => {
                const url = typeof item === "string" ? item : item.url || item.src;
                if (!url) return null;

                const isVideo =
                  url.endsWith(".mp4") ||
                  url.endsWith(".webm") ||
                  url.endsWith(".mov") ||
                  url.includes("youtube.com") ||
                  url.includes("youtu.be");

                return (
                  <div
                    key={i}
                    className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 shadow-md border border-slate-100 flex flex-col justify-end"
                  >
                    {isVideo ? (
                      url.includes("youtube.com") || url.includes("youtu.be") ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${
                            url.includes("v=")
                              ? url.split("v=")[1]?.split("&")[0]
                              : url.split("/").pop()
                          }`}
                          title="Video"
                          className="w-full h-full border-0"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={url}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <Image
                        src={url}
                        alt={item.caption || "Gallery Image"}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}

                    {item.caption && !isVideo && (
                      <div className="relative z-10 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-xs font-medium">
                        {item.caption}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );

    // 🌟 التعديل الخاص بقسم القصص والأخبار (stories / news)
    case "stories": {
      const posts = context?.posts || [];
      if (!posts || posts.length === 0) return null;

      return (
        <NewsSection
          key={section.id}
          posts={posts}
          locale={locale}
          dict={context?.dict || {}}
          data={p}
        />
      );
    }

    case "faq": {
      const faqItems = p.items || [];
      const faqSchema = faqItems.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map((item: any) => ({
          "@type": "Question",
          "name": item.question || item.title || "",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer || item.body || ""
          }
        }))
      } : null;

      return (
        <>
          {faqSchema && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
          )}
          <FaqSection
            locale={locale}
            dict={context?.dict || {}}
            data={p}
          />
        </>
      );
    }

    case "cta":
      return (
        <section 
          className="relative overflow-hidden py-20 sm:py-24 text-white text-center bg-brand transition-colors"
          style={{ backgroundColor: primary }}
        >
          <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative max-w-screen-xl mx-auto px-6 z-10">
            {p.title && <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">{p.title}</h2>}
            {p.subtitle && <p className="text-white/80 mb-8 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">{p.subtitle}</p>}
            {p.buttonText && (
              <Link
                href={getLocalizedLink(p.buttonLink, "/donate")}
                className="inline-flex items-center gap-2 hover:opacity-90 active:scale-98 text-white font-bold rounded-2xl px-9 py-4 text-sm shadow-xl transition-all bg-accent"
                style={{ backgroundColor: accent }}
              >
                <Icon name="heart" size={18} />
                {p.buttonText}
              </Link>
            )}
          </div>
        </section>
      );

    case "contact_form": {
      const contactSchema = {
        "@context": "https://schema.org",
        "@type": "NGO",
        "@id": "https://forrelief.org/#organization",
        "name": "4Relief",
        "url": "https://forrelief.org",
        "contactPoint": {
          "@type": "ContactPoint",
          "email": p.email || "info@forrelief.org",
          "contactType": "customer service",
          "availableLanguage": ["Arabic", "English", "Turkish", "French"]
        }
      };

      return (
        <section className="py-20 sm:py-24 bg-white">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
          />
          <div className="max-w-screen-xl mx-auto px-6 text-center mb-10">
            <Eyebrow className="justify-center">تواصل معنا</Eyebrow>
            {p.title && <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">{p.title}</h2>}
            {p.subtitle && <p className="text-slate-500 text-sm sm:text-base">{p.subtitle}</p>}
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            <ContactForm locale={locale} dict={context?.dict || {}} email={p.email || "info@forrelief.org"} />
          </div>
        </section>
      );
    }

    case "newsletter":
      return (
        <section 
          className="relative py-16 sm:py-20 text-white overflow-hidden bg-brand transition-colors"
          style={{ backgroundColor: primary }}
        >
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-screen-xl mx-auto px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Icon name="mail" size={22} className="text-white" />
            </div>
            {p.title && <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">{p.title}</h2>}
            {p.subtitle && <p className="text-white/80 mb-8 text-xs sm:text-sm max-w-lg mx-auto">{p.subtitle}</p>}
            <NewsletterForm />
          </div>
        </section>
      );

    case "spacer":
      return <div style={{ height: `${p.height || 48}px` }} />;

    default:
      return (
        <div className="py-10 text-center text-slate-500 bg-slate-50 text-xs">
          عنصر غير معروف: {section.type}
        </div>
      );
  }
}

export function formatRaised(amount: number) {
  return formatCurrency(amount);
}