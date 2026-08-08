import { loadTranslations } from "@/lib/i18n";
import { getHomeData } from "@/lib/services/home.service";
import HeroSection from "@/components/site/HeroSection";
import CampaignsCarousel from "@/components/site/CampaignsCarousel";
import NewsSection from "@/components/site/NewsSection";
import DonateWidget from "@/components/site/DonateWidget";
import FaqSection from "@/components/site/FaqSection";
import AchievementsSection from "@/components/site/AchievementsSection";
import NewsletterSection from "@/components/site/NewsletterSection";
import AboutOverviewSection from "@/components/blocks/AboutOverviewSection"; // 🌟 استيراد مكون المكون
import type { Metadata } from "next";

export const revalidate = 0;

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  const dict = await loadTranslations(locale);
  const data = await getHomeData(locale);
  const settings: any = data?.settings || {};
  
  const siteName = settings?.siteName || "4Relief Humanitarian Foundation";
  const description = settings?.footerDescription || dict["footer.description"] || "منصة تبرعات إنسانية شفافة";
  return { title: siteName, description, openGraph: { title: siteName, description, type: "website" } };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = params;
  const dict = await loadTranslations(locale);
  
  const data: any = (await getHomeData(locale)) || {};
  const settings: any = data.settings || {};
  const campaigns = data.campaigns || [];
  const posts = data.posts || [];
  const stats = data.stats || { total: 0, families: 0 };
  const pageSections = data.pageSections || [];
  
  const sections = Array.isArray(pageSections) ? pageSections : [];
  const heroImage = settings?.heroImage || null;

  const primaryColor = settings?.primaryColor || "#0069D2";
  const accentColor = settings?.accentColor || "#F00F5A";

  let rawSlides: any[] = [];
  if (settings?.heroSlides) {
    try { 
      rawSlides = typeof settings.heroSlides === "string" ? JSON.parse(settings.heroSlides) : settings.heroSlides; 
    } catch { 
      rawSlides = []; 
    }
  }

  return (
    <main>
      {sections.map((section: any) => {
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
                accentColor={accentColor}
                primaryColor={primaryColor}
                data={sectionData}
              />
            );

          case "about_overview":
            return (
              <AboutOverviewSection 
                key={section.id} 
                data={sectionData} 
                locale={locale} 
              />
            );

          case "campaigns_grid":
            return <CampaignsCarousel key={section.id} campaigns={campaigns} locale={locale} dict={dict} data={sectionData} />;

          case "stories":
            return posts.length > 0 ? <NewsSection key={section.id} posts={posts} locale={locale} dict={dict} data={sectionData} /> : null;

          case "donation_buttons":
            return <DonateWidget key={section.id} locale={locale} dict={dict} accentColor={accentColor} primaryColor={primaryColor} data={sectionData} />;
            
          case "stats":
            return (
              <AchievementsSection
                key={section.id}
                locale={locale}
                dict={dict}
                totalRaised={stats?.total || 0}
                totalFamilies={stats?.families || 0}
                data={sectionData}
                accentColor={accentColor} 
                primaryColor={primaryColor} 
              />
            );
            
          case "faq":
            return <FaqSection key={section.id} locale={locale} dict={dict} data={sectionData} />;

          case "newsletter":
            return <NewsletterSection key={section.id} locale={locale} dict={dict} accentColor={accentColor} primaryColor={primaryColor} data={sectionData} />;

          default:
            return null;
        }
      })}
    </main>
  );
}