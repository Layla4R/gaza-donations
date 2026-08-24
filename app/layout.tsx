import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { getSupabaseOrNull } from "@/lib/supabase"; 
import { Alexandria, Tajawal, Cairo } from "next/font/google";

const alexandria = Alexandria({ subsets: ["arabic", "latin"], display: "swap", variable: "--font-display" });
const tajawal = Tajawal({ weight: ['400', '500', '700', '800'], subsets: ["arabic", "latin"], display: "swap", variable: "--font-sans" });
const cairo = Cairo({ subsets: ["arabic", "latin"], display: "swap", variable: "--font-cairo" });

export const metadata: Metadata = {
  metadataBase: new URL("https://forrelief.org"),
  title: {
    template: "%s | 4Relief",
    default: "4Relief Humanitarian Foundation",
  },
  description: "An independent humanitarian donation platform with full transparency.",
  alternates: {
    canonical: "https://forrelief.org",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: { locale?: string };
}) {
  const locale = params?.locale || "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  const gaId  = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  const supabase = getSupabaseOrNull();
  const settings = supabase
    ? (await supabase.from("SiteSettings").select("primaryColor, accentColor, facebookUrl, twitterUrl, instagramUrl, youtubeUrl, linkedinUrl").eq("id", "default").maybeSingle()).data
    : null;

  const primaryColor = settings?.primaryColor || "#0069D2";
  const accentColor = settings?.accentColor || "#F00F5A";

  const sameAsLinks = [
    settings?.facebookUrl,
    settings?.twitterUrl,
    settings?.instagramUrl,
    settings?.youtubeUrl,
    settings?.linkedinUrl,
  ].filter(Boolean);

  // Schema مباشرة في الجذر بدون wrapping بـ @graph
  const rootOrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "4Relief Humanitarian Foundation",
    "alternateName": "4Relief",
    "url": "https://forrelief.org",
    "logo": "https://forrelief.org/logo.png",
    "description": "An independent humanitarian donation platform dedicated to full transparency and direct relief campaigns.",
    "sameAs": sameAsLinks
  };

  return (
    <html 
      lang={locale} 
      dir={dir} 
      suppressHydrationWarning 
      className={`${alexandria.variable} ${tajawal.variable} ${cairo.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootOrganizationSchema) }}
        />
        {gtmId && (
          <Script id="gtm-init" strategy="beforeInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtag/js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}</Script>
        )}
        
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --brand: ${primaryColor};
              --accent: ${accentColor};
            }
          `
        }} />
      </head>
      
      <body className="font-sans min-h-screen antialiased bg-cream text-ink">
        {gtmId && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
          </noscript>
        )}

        {children}

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