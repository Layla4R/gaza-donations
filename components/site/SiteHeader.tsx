"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import CartIcon from "./CartIcon";

interface NavItem { id?: string; slug: string; title: string; }

export default function SiteHeader({ navItems, settings, locale, dict, transparent = false }: {
  navItems: NavItem[]; settings: any; locale: string; dict: Record<string, string>; transparent?: boolean;
}) {
  const p = locale === "ar" ? "" : `/${locale}`;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Only show transparent on homepage
  const isHomePage = pathname === "/" || pathname === `/${locale}` || pathname === `/${locale}/`;
  const canBeTransparent = transparent && isHomePage;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transparent only when: homepage + transparent prop + not scrolled + mobile menu closed
  const isTransparent = canBeTransparent && !scrolled && !mobileOpen;

  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);

  const logoImage = settings?.logoImage || "/brand/logo-horizontal-transparent.png";
  const logoText = settings?.logoText || "4Relief";

  const navLinkCls = `text-sm font-semibold transition-colors hover:opacity-80 ${
    isTransparent ? "text-white" : "text-ink/70 hover:text-brand"
  }`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent
        ? "bg-transparent border-b border-transparent shadow-none"
        : "bg-white border-b border-line shadow-sm"
    }`}>
      {!isTransparent && (
        <div className="h-1" style={{ background: settings?.accentColor
          ? `linear-gradient(to right, ${settings.accentColor}, ${settings.accentColor}cc)`
          : "linear-gradient(135deg, #F00F5A, #FF4D88)"
        }} />
      )}

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">

        {/* Logo — always full color */}
        <Link href={`${p}/`} className="flex items-center gap-2 shrink-0">
          <Image src={logoImage} alt={logoText} width={175} height={70} className="h-11 w-auto object-contain" priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map(item => (
            <Link key={item.slug}
              href={item.slug === "home" ? `${p}/` : `${p}/${item.slug}`}
              className={navLinkCls}>
              {item.slug === "home" ? t("nav.home","الرئيسية","Home","Accueil","Ana Sayfa") : item.title}
            </Link>
          ))}
          <Link href={`${p}/campaigns`} className={navLinkCls}>
            {t("nav.campaigns","الحملات","Campaigns","Campagnes","Kampanyalar")}
          </Link>
          <Link href={`${p}/news`} className={navLinkCls}>
            {t("nav.news","الأخبار","News","Actualités","Haberler")}
          </Link>
          <Link href={`${p}/contact`} className={navLinkCls}>
            {t("nav.contact","اتصل بنا","Contact","Contact","İletişim")}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher currentLocale={locale} transparent={isTransparent} />

          {/* Cart */}
          <CartIcon prefix={p} transparent={isTransparent} />

          {/* Account */}
          <Link href={`${p}/account`}
            className={`hidden sm:flex items-center gap-1.5 text-sm font-semibold border rounded-xl px-3 py-2 transition ${
              isTransparent
                ? "border-white/30 text-white hover:bg-white/15"
                : "border-line text-ink/70 hover:text-brand hover:border-brand"
            }`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
            </svg>
            <span className="hidden lg:inline">{t("nav.account","حسابي","My Account","Mon Compte","Hesabım")}</span>
          </Link>

          {/* Donate */}
          <Link href={`${p}/donate`}
            className="font-bold rounded-xl px-5 py-2.5 text-sm shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90"
            style={{ background: settings?.accentColor
              ? `linear-gradient(135deg, ${settings.accentColor}, ${settings.accentColor}cc)`
              : "linear-gradient(135deg,#F00F5A,#FF4D88)", color: "white" }}>
            {t("nav.donate","تبرع الآن","Donate Now","Faire un Don","Bağış Yap")}
          </Link>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-xl transition ${isTransparent ? "text-white hover:bg-white/15" : "text-ink/70 hover:text-brand"}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen
                ? <path d="M18 6 6 18M6 6l12 12"/>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu — always white */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-line shadow-xl px-6 py-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.slug}
              href={item.slug === "home" ? `${p}/` : `${p}/${item.slug}`}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-semibold text-ink/70 hover:text-brand border-b border-line/40 last:border-0 transition">
              {item.slug === "home" ? t("nav.home","الرئيسية","Home","Accueil","Ana Sayfa") : item.title}
            </Link>
          ))}
          <Link href={`${p}/campaigns`} onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-semibold text-ink/70 hover:text-brand border-b border-line/40 transition">
            {t("nav.campaigns","الحملات","Campaigns","Campagnes","Kampanyalar")}
          </Link>
          <Link href={`${p}/news`} onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-semibold text-ink/70 hover:text-brand border-b border-line/40 transition">
            {t("nav.news","الأخبار","News","Actualités","Haberler")}
          </Link>
          <Link href={`${p}/contact`} onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-semibold text-ink/70 hover:text-brand transition">
            {t("nav.contact","اتصل بنا","Contact","Contact","İletişim")}
          </Link>
        </div>
      )}
    </header>
  );
}
