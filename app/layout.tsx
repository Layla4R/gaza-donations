import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = "4Relief Humanitarian Foundation";
const siteDesc = "Transparent humanitarian donations platform supporting families in need around the world. Donate to Gaza, Syria, Yemen and more.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: siteName,
    template: "%s | 4Relief",
  },
  description: siteDesc,

  // ── Verification tags ─────────────────────────────────────
  verification: {
    google:  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION  || "",
    yandex:  process.env.NEXT_PUBLIC_YANDEX_VERIFICATION       || "",
    other: {
      // Bing / Microsoft Clarity
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
      // Baidu
      "baidu-site-verification": process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || "",
    },
  },

  // ── Open Graph ─────────────────────────────────────────────
  openGraph: {
    title:       siteName,
    description: siteDesc,
    siteName:    siteName,
    url:         siteUrl,
    type:        "website",
    locale:      "ar_SA",
    alternateLocale: ["en_US", "fr_FR", "tr_TR"],
    images: [
      {
        url:    "/brand/og-image.png",
        width:  1200,
        height: 630,
        alt:    siteName,
      },
    ],
  },

  // ── Twitter / X ────────────────────────────────────────────
  twitter: {
    card:        "summary_large_image",
    title:       siteName,
    description: siteDesc,
    images:      ["/brand/og-image.png"],
    creator:     process.env.NEXT_PUBLIC_TWITTER_HANDLE || "",
    site:        process.env.NEXT_PUBLIC_TWITTER_HANDLE || "",
  },

  // ── Icons ──────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple:    { url: "/apple-touch-icon.png", sizes: "180x180" },
    shortcut: "/favicon.ico",
  },

  // ── Manifest ───────────────────────────────────────────────
  manifest: "/site.webmanifest",

  // ── Canonical & alternates ─────────────────────────────────
  alternates: {
    canonical:  siteUrl,
    languages: {
      "ar":    `${siteUrl}/ar`,
      "en":    `${siteUrl}/en`,
      "fr":    `${siteUrl}/fr`,
      "tr":    `${siteUrl}/tr`,
      "x-default": siteUrl,
    },
  },

  // ── Robots ─────────────────────────────────────────────────
  robots: {
    index:          true,
    follow:         true,
    googleBot: {
      index:             true,
      follow:            true,
      "max-image-preview":   "large",
      "max-snippet":         -1,
      "max-video-preview":   -1,
    },
  },

  // ── App metadata ───────────────────────────────────────────
  applicationName: siteName,
  keywords: [
    "humanitarian donations", "تبرعات إنسانية", "Gaza relief", "دعم غزة",
    "charity", "donation platform", "humanitarian aid", "4Relief",
    "Syria", "Yemen", "Palestine", "nonprofit",
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator:   siteName,
  publisher: siteName,
  category:  "charity",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId  = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon"             href="/favicon.ico" sizes="any" />
        <link rel="icon"             href="/brand/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest"         href="/site.webmanifest" />

        {/* Preconnect to external origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* JSON-LD structured data — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              "name": siteName,
              "url": siteUrl,
              "logo": `${siteUrl}/brand/logo-horizontal-transparent.png`,
              "description": siteDesc,
              "sameAs": [
                process.env.NEXT_PUBLIC_FACEBOOK_URL,
                process.env.NEXT_PUBLIC_TWITTER_URL,
                process.env.NEXT_PUBLIC_INSTAGRAM_URL,
              ].filter(Boolean),
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "email": process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@forrelief.org",
                "availableLanguage": ["Arabic", "English", "French", "Turkish"],
              },
            }),
          }}
        />

        {/* GTM head snippet */}
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
      </head>
      <body className="font-sans min-h-screen">
        {/* GTM noscript */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0" width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        {children}

        {/* Google Analytics */}
        {gaId && !gtmId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());
              gtag('config','${gaId}',{page_path:window.location.pathname});
            `}</Script>
          </>
        )}
      </body>
    </html>
  );
}
