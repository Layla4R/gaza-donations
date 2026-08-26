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
  const [isDestekol, setIsDestekol] = useState(false);

  // Only show transparent on homepage
  const isHomePage = pathname === "/" || pathname === `/${locale}` || pathname === `/${locale}/`;
  const canBeTransparent = transparent && isHomePage;

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname.includes("destekol")) {
      setIsDestekol(true);
    }

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = canBeTransparent && !scrolled && !mobileOpen;

  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);

  const logoImage = isDestekol 
    ? "/brand/destekol_logo.png" 
    : (settings?.logoImage || "/brand/logo-horizontal-transparent.png");

  const logoText = isDestekol 
    ? "Destekol" 
    : (settings?.logoText || "4Relief");

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
        <div className="h-1" role="presentation" style={{ background: settings?.accentColor
          ? `linear-gradient(to right, ${settings.accentColor}, ${settings.accentColor}cc)`
          : "linear-gradient(135deg, #F00F5A, #FF4D88)"
        }} />
      )}

      <div className="max-w-screen-xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">

        {/* Logo */}
        <Link href={`${p}/`} className="flex items-center gap-2 shrink-0" aria-label={`${logoText} Home`}>
          <Image src={logoImage} alt={logoText} width={175} height={70} className="h-8 sm:h-11 w-auto object-contain" priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
          <ul className="flex items-center gap-7">
          {navItems.map(item => {
            const navKey = `nav.${item.slug}`;
            const translatedTitle = dict[navKey] || (
              item.slug === "home" ? t("nav.home","الرئيسية","Home","Accueil","Ana Sayfa") :
              item.slug === "about" || item.slug === "about-us" ? t("nav.about","من نحن","About Us","À Propos","Hakkımızda") :
              item.slug === "transparency" ? t("nav.transparency","الشفافية","Transparency","Transparence","Şeffاflık") :
              item.slug === "contact" ? t("nav.contact","اتصل بنا","Contact","Contact","İletişim") :
              item.title
            );

            return (
              <li key={item.slug}>
                <Link
                  href={item.slug === "home" ? `${p}/` : `${p}/${item.slug}`}
                  className={navLinkCls}>
                  {translatedTitle}
                </Link>
              </li>
            );
          })}
          <li>
            <Link href={`${p}/campaigns`} className={navLinkCls}>
              {t("nav.campaigns","الحملات","Campaigns","Campagnes","Kampanyalar")}
            </Link>
          </li>
          <li>
            <Link href={`${p}/news`} className={navLinkCls}>
              {t("nav.news","الأخبار","News","Actualités","Haberler")}
            </Link>
          </li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <LanguageSwitcher currentLocale={locale} transparent={isTransparent} />

          {/* Cart */}
          <CartIcon prefix={p} transparent={isTransparent} />

          {/* Account / Login - ظاهرة الآن على الموبايل والدسكتب */}
          <Link href={`${p}/account`}
            aria-label="User Account"
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold border rounded-xl p-2 sm:px-3 sm:py-2 transition ${
              isTransparent
                ? "border-white/30 text-white hover:bg-white/15"
                : "border-line text-ink/70 hover:text-brand hover:border-brand"
            }`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
            </svg>
            <span className="hidden lg:inline">{t("nav.account","حسابي","My Account","Mon Compte","Hesabım")}</span>
          </Link>

          {/* Donate */}
          <Link href={`${p}/donate`}
            className="font-bold rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm shadow-lg transition-all hover:-translate-y-0.5 hover:opacity-90 shrink-0"
            style={{ background: settings?.accentColor
              ? `linear-gradient(135deg, ${settings.accentColor}, ${settings.accentColor}cc)`
              : "linear-gradient(135deg,#F00F5A,#FF4D88)", color: "white" }}>
            {t("nav.donate","تبرع الآن","Donate Now","Faire un Don","Bağış Yap")}
          </Link>

          {/* Mobile hamburger */}
          <button 
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className={`md:hidden p-2 rounded-xl transition ${isTransparent ? "text-white hover:bg-white/15" : "text-ink/70 hover:text-brand"}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {mobileOpen
                ? <path d="M18 6 6 18M6 6l12 12"/>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav id="mobile-navigation" className="md:hidden bg-white border-t border-line shadow-xl px-6 py-4" aria-label="Mobile Navigation">
          <ul className="space-y-1">
          {navItems.map(item => {
            const navKey = `nav.${item.slug}`;
            const translatedTitle = dict[navKey] || (
              item.slug === "home" ? t("nav.home","الرئيسية","Home","Accueil","Ana Sayfa") :
              item.slug === "about" || item.slug === "about-us" ? t("nav.about","من نحن","About Us","À Propos","Hakkımızda") :
              item.slug === "transparency" ? t("nav.transparency","الشفافية","Transparency","Transparence","Şeffاflık") :
              item.slug === "contact" ? t("nav.contact","اتصل بنا","Contact","Contact","İletişim") :
              item.title
            );

            return (
              <li key={item.slug}>
                <Link
                  href={item.slug === "home" ? `${p}/` : `${p}/${item.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-sm font-semibold text-ink/70 hover:text-brand border-b border-line/40 last:border-0 transition">
                  {translatedTitle}
                </Link>
              </li>
            );
          })}
          <li>
            <Link href={`${p}/campaigns`} onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-semibold text-ink/70 hover:text-brand border-b border-line/40 transition">
              {t("nav.campaigns","الحملات","Campaigns","Campagnes","Kampanyalar")}
            </Link>
          </li>
          <li>
            <Link href={`${p}/news`} onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-semibold text-ink/70 hover:text-brand border-b border-line/40 transition">
              {t("nav.news","الأخبار","News","Actualités","Haberler")}
            </Link>
          </li>
          <li>
            <Link href={`${p}/account`} onClick={() => setMobileOpen(false)} className="py-3 text-sm font-semibold text-ink/70 hover:text-brand border-b border-line/40 transition flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>
              {t("nav.account","حسابي","My Account","Mon Compte","Hesabım")}
            </Link>
          </li>
          <li>
            <Link href={`${p}/contact`} onClick={() => setMobileOpen(false)} className="block py-3 text-sm font-semibold text-ink/70 hover:text-brand transition">
              {t("nav.contact","اتصل بنا","Contact","Contact","İletişim")}
            </Link>
          </li>
          </ul>
        </nav>
      )}
    </header>
  );
}