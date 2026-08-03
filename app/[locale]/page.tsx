import { getSupabaseOrNull } from "@/lib/supabase";
import { loadTranslations } from "@/lib/i18n";
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
  const supabase = getSupabaseOrNull();
  const settings = supabase
    ? (await supabase.from("SiteSettings").select("siteName, footerDescription").eq("id", "default").maybeSingle()).data
    : null;
  const siteName = settings?.siteName || "4Relief Humanitarian Foundation";
  const description = settings?.footerDescription
    || dict["footer.description"]
    || (locale === "ar"
      ? "منصة تبرعات إنسانية شفافة وآمنة لدعم الأسر المحتاجة حول العالم"
      : "A transparent and secure humanitarian donation platform supporting families in need worldwide");
  return {
    title: siteName,
    description,
    openGraph: { title: siteName, description, type: "website" },
  };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = getSupabaseOrNull();

  const [settingsRes, campaignsRes, postsRes, dict] = await Promise.all([
    supabase ? supabase.from("SiteSettings").select("heroImage, heroSlides, accentColor, primaryColor").eq("id","default").maybeSingle() : Promise.resolve({ data: null }),
    supabase ? supabase.from("Campaign").select("*").eq("isActive", true).order("isFeatured", { ascending: false }).limit(12) : Promise.resolve({ data: [] }),
    supabase ? supabase.from("NewsPost").select("id,title,excerpt,coverImage,slug,publishedAt").eq("isPublished", true).order("publishedAt", { ascending: false }).limit(3) : Promise.resolve({ data: [] }),
    loadTranslations(locale),
  ]);
  const heroImage = settingsRes?.data?.heroImage || null;
  const heroSlides = settingsRes?.data?.heroSlides ? JSON.parse(settingsRes.data.heroSlides || "[]") : null;

  let campaigns = campaignsRes?.data || [];
  let posts = postsRes?.data || [];

  if (locale !== "ar" && supabase && campaigns.length > 0) {
    const { data: ctrans } = await supabase
      .from("CampaignTranslation").select("campaignId, title, summary")
      .eq("locale", locale).in("campaignId", campaigns.map((c: any) => c.id));
    if (ctrans?.length) {
      const cm: Record<string, any> = {};
      for (const t of ctrans) cm[t.campaignId] = t;
      campaigns = campaigns.map((c: any) => cm[c.id] ? { ...c, title: cm[c.id].title, summary: cm[c.id].summary } : c);
    }
  }

  if (locale !== "ar" && supabase && posts.length > 0) {
    const { data: ptrans } = await supabase
      .from("NewsPostTranslation").select("postId, title, excerpt")
      .eq("locale", locale).in("postId", posts.map((p: any) => p.id));
    if (ptrans?.length) {
      const pm: Record<string, any> = {};
      for (const t of ptrans) pm[t.postId] = t;
      posts = posts.map((p: any) => pm[p.id] ? { ...p, title: pm[p.id].title, excerpt: pm[p.id].excerpt } : p);
    }
  }

  // Real-time stats for achievements section
  let statsTotal = 0;
  let statsFamilies = 0;
  if (supabase) {
    try {
      const [donRes, camRes] = await Promise.all([
        supabase.from("Donation").select("amount").eq("status", "COMPLETED").limit(50000),
        supabase.from("Campaign").select("donorCount").eq("isActive", true).limit(100),
      ]);
      statsTotal = (donRes.data || []).reduce((s: number, d: any) => s + Number(d.amount), 0);
      statsFamilies = (camRes.data || []).reduce((s: number, c: any) => s + (c.donorCount || 0), 0);
    } catch {}
  }

  return (
    <div>
      <HeroSection locale={locale} dict={dict} heroImage={heroImage} heroSlides={heroSlides} accentColor={settingsRes?.data?.accentColor} primaryColor={settingsRes?.data?.primaryColor} />
      <CampaignsCarousel campaigns={campaigns} locale={locale} dict={dict} />
      {posts.length > 0 && <NewsSection posts={posts} locale={locale} dict={dict} />}
      <DonateWidget locale={locale} dict={dict} accentColor={settingsRes?.data?.accentColor} />
      <AchievementsSection locale={locale} dict={dict} totalRaised={statsTotal} totalFamilies={statsFamilies} />
      <FaqSection locale={locale} dict={dict} />
      <NewsletterSection locale={locale} dict={dict} accentColor={settingsRes?.data?.accentColor} />
    </div>
  );
}
