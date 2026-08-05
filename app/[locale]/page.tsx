import { loadTranslations } from "@/lib/i18n";
import { getHomeData } from "@/lib/services/home.service";
import HeroSection from "@/components/site/HeroSection";
import CampaignsCarousel from "@/components/site/CampaignsCarousel";
import NewsSection from "@/components/site/NewsSection";
import DonateWidget from "@/components/site/DonateWidget";
import FaqSection from "@/components/site/FaqSection";
import AchievementsSection from "@/components/site/AchievementsSection";
import NewsletterSection from "@/components/site/NewsletterSection";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const dict = await loadTranslations(locale);
  const data = await getHomeData(locale);
  const settings = data?.settings;
  
  const siteName = settings?.siteName || "4Relief Humanitarian Foundation";
  const description = settings?.footerDescription || dict["footer.description"] || "منصة تبرعات إنسانية شفافة";
  return { title: siteName, description, openGraph: { title: siteName, description, type: "website" } };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const dict = await loadTranslations(locale);
  
  // 1. جلب البيانات من لوحة التحكم
  const data = await getHomeData(locale) || {};
  const settings = data.settings || {};
  const campaigns = data.campaigns || [];
  const posts = data.posts || [];
  const stats = data.stats || { total: 0, families: 0 };
  const pageSections = data.pageSections || [];
  
  const sections = Array.isArray(pageSections) ? pageSections : [];
  const heroImage = settings?.heroImage || null;

  let rawSlides = [];
  if (settings?.heroSlides) {
    try { rawSlides = typeof settings.heroSlides === "string" ? JSON.parse(settings.heroSlides) : settings.heroSlides; } 
    catch (e) { rawSlides = []; }
  }

  // 2. البناء الديناميكي للصفحة
  return (
    <main>
      {sections.map((section: any) => {
        // حماية البيانات لتجنب الخطأ 500
        const sectionData = section.props || {};

        switch (section.type) {
          case "hero":
            const sliderSlides = rawSlides.map((slide: any, index: number) => {
              if (index === 0 && section.props) {
                return {
                  ...slide,
                  image: sectionData.backgroundImage || slide.image,
                  title_ar: sectionData.title || slide.title_ar,
                  title_en: sectionData.title || slide.title_en,
                  subtitle_ar: sectionData.subtitle || slide.subtitle_ar,
                  subtitle_en: sectionData.subtitle || slide.subtitle_en,
                };
              }
              return slide;
            });

            return (
              <HeroSection
                key={section.id}
                locale={locale}
                dict={dict}
                heroImage={heroImage}
                heroSlides={sliderSlides} 
                accentColor={settings?.accentColor}
                primaryColor={settings?.primaryColor}
                data={sectionData} // تمرير البيانات الإضافية إن وجدت
              />
            );

        

          case "campaigns_grid":
            return <CampaignsCarousel key={section.id} campaigns={campaigns} locale={locale} dict={dict} data={sectionData} />;

          case "stories":
            return posts.length > 0 ? <NewsSection key={section.id} posts={posts} locale={locale} dict={dict} data={sectionData} /> : null;

          case "donation_buttons":
            return <DonateWidget key={section.id} locale={locale} dict={dict} accentColor={settings?.accentColor} data={sectionData} />;
  case "stats":
            return (
              <AchievementsSection
                key={section.id}
                locale={locale}
                dict={dict}
                totalRaised={stats?.total || 0}
                totalFamilies={stats?.families || 0}
                data={sectionData} // نمرر البيانات القادمة من الأدمن هنا
              />
            );
          case "faq":
            return <FaqSection key={section.id} locale={locale} dict={dict} data={sectionData} />;

          case "newsletter":
            return <NewsletterSection key={section.id} locale={locale} dict={dict} accentColor={settings?.accentColor} data={sectionData} />;

          default:
            return null;
        }
      })}
    </main>
  );
}