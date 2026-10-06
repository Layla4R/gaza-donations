import { headers } from "next/headers";
// HTML and settings depend on the request domain.
export const dynamic = "force-dynamic";
import { getSupabaseOrNull } from "@/lib/supabase";
import type { Metadata,Viewport } from "next";
import { Alexandria,Cairo,Tajawal } from "next/font/google";
import Script from "next/script";
import "./globals.css";
const alexandria = Alexandria({
    subsets: ["arabic", "latin"],
    display: "swap",
    variable: "--font-display",
});
const tajawal = Tajawal({
    weight: ["400", "500", "700", "800"],
    subsets: ["arabic", "latin"],
    display: "swap",
    variable: "--font-sans",
});
const cairo = Cairo({
    subsets: ["arabic", "latin"],
    display: "swap",
    variable: "--font-cairo",
});
const SITE_URL = "https://forrelief.org";
export const viewport: Viewport = {
    themeColor: "#0069D2",
};
export async function generateMetadata(): Promise<Metadata> {
    const isSite = false;
    const siteUrl = SITE_URL;
    const name = "4Relief";
    const fullName = "4Relief Humanitarian Foundation";
    const description = "4Relief is an independent humanitarian foundation connecting donors with transparent relief and humanitarian campaigns.";
    return {
        metadataBase: new URL(siteUrl),
        applicationName: name,
        icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
        title: { default: fullName, template: `%s | ${name}` },
        description,
        keywords: [name, "humanitarian aid", "humanitarian foundation", "donations", "charity", "relief campaigns", "emergency aid", "humanitarian donations", "humanitarian crowdfunding"],
        authors: [{ name: fullName, url: siteUrl }],
        creator: fullName,
        publisher: fullName,
        alternates: {
            canonical: siteUrl,
            languages: { ar: `${siteUrl}/ar`, en: `${siteUrl}/en`, tr: `${siteUrl}/tr` },
        },
        openGraph: {
            type: "website",
            url: siteUrl,
            siteName: name,
            title: fullName,
            description: "Connecting donors with transparent humanitarian and relief campaigns.",
            locale: "ar",
            alternateLocale: ["en", "tr"],
        },
        twitter: {
            card: "summary_large_image",
            title: fullName,
            description: "Connecting donors with transparent humanitarian and relief campaigns.",
        },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
        },
        category: "Humanitarian Organization",
    };
}
export default async function RootLayout({ children, }: {
    children: React.ReactNode;
}) {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
    const supabase = getSupabaseOrNull();
    const settings = supabase
        ? (await supabase
            .from("SiteSettings")
            .select(`
            primaryColor,
            accentColor,
            facebookUrl,
            twitterUrl,
            instagramUrl,
            youtubeUrl,
            linkedinUrl
          `)
            .eq("id", "default")
            .maybeSingle()).data
        : null;
    const isSite = false;
    const siteUrl = SITE_URL;
    const primaryColor = settings?.primaryColor || ("#0069D2");
    const accentColor = settings?.accentColor || ("#F00F5A");
    const sameAsLinks = [
        settings?.facebookUrl,
        settings?.twitterUrl,
        settings?.instagramUrl,
        settings?.youtubeUrl,
        settings?.linkedinUrl,
    ].filter((url): url is string => Boolean(url));
    /*
     * Main Entity IDs
     */
    const organizationId = `${siteUrl}/#organization`;
    const websiteId = `${siteUrl}/#website`;
    /*
     * Complete semantic graph
     */
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "NGO",
                "@id": organizationId,
                name: "4Relief Humanitarian Foundation",
                alternateName: [
                    "4Relief",
                    "For Relief",
                    "فور ريليف",
                ],
                url: siteUrl,
                description: "4Relief is an independent humanitarian foundation connecting donors with transparent relief and humanitarian campaigns.",
                logo: {
                    "@type": "ImageObject",
                    "@id": `${siteUrl}/#logo`,
                    url: `${siteUrl}/brand/${"logo.png"}`,
                },
                image: `${siteUrl}/brand/${"logo.png"}`,
                sameAs: sameAsLinks,
                knowsAbout: [
                    "Humanitarian Aid",
                    "Emergency Relief",
                    "Humanitarian Crowdfunding",
                    "Charitable Donations",
                    "Community Development",
                    "Child Protection",
                    "Education",
                    "Women Empowerment",
                ],
            },
            {
                "@type": "WebSite",
                "@id": websiteId,
                url: siteUrl,
                name: "4Relief",
                alternateName: "4Relief Humanitarian Foundation",
                publisher: {
                    "@id": organizationId,
                },
                inLanguage: [
                    "ar",
                    "en",
                    "tr",
                ],
                potentialAction: {
                    "@type": "SearchAction",
                    target: {
                        "@type": "EntryPoint",
                        urlTemplate: `${siteUrl}/en/campaigns?search={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                },
            },
        ],
    };
    const requestedLocale = headers().get("x-app-locale");
    const locale = requestedLocale && ["ar", "en", "fr", "tr"].includes(requestedLocale) ? requestedLocale : "ar";
    return (<html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning className={`
        ${alexandria.variable}
        ${tajawal.variable}
        ${cairo.variable}
      `}>
      <head>
        <Script id="organization-schema" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}/>

        <style dangerouslySetInnerHTML={{
            __html: `
              :root {
                --brand: ${primaryColor};
                --accent: ${accentColor};
                ${""}
              }
            `,
        }}/>
      </head>

      <body data-site={"forrelief"} className="font-sans min-h-screen antialiased bg-cream text-ink">
        {gtmId && (<>
            <Script id="gtm-init" strategy="beforeInteractive">
              {`
                (function(w,d,s,l,i){
                  w[l]=w[l]||[];
                  w[l].push({
                    'gtm.start': new Date().getTime(),
                    event:'gtm.js'
                  });

                  var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),
                  dl=l!='dataLayer'
                    ? '&l='+l
                    : '';

                  j.async=true;

                  j.src=
                    'https://www.googletagmanager.com/gtm.js?id='
                    + i + dl;

                  f.parentNode.insertBefore(j,f);

                })(window,document,'script','dataLayer','${gtmId}');
              `}
            </Script>

            <noscript>
              <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{
                display: "none",
                visibility: "hidden",
            }}/>
            </noscript>
          </>)}

        {children}

        {gaId && !gtmId && (<>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive"/>

            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];

                function gtag(){
                  dataLayer.push(arguments);
                }

                gtag('js', new Date());

                gtag('config', '${gaId}', {
                  page_path: window.location.pathname
                });
              `}
            </Script>
          </>)}
      </body>
    </html>);
}
