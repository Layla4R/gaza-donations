import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

import { getSupabaseOrNull } from "@/lib/supabase";
import { Alexandria, Tajawal, Cairo } from "next/font/google";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: "4Relief",

  title: {
    default: "4Relief Humanitarian Foundation",
    template: "%s | 4Relief",
  },

  description:
    "4Relief is an independent humanitarian foundation connecting donors with transparent relief and humanitarian campaigns.",

  keywords: [
    "4Relief",
    "humanitarian aid",
    "humanitarian foundation",
    "donations",
    "charity",
    "relief campaigns",
    "emergency aid",
    "Gaza donations",
    "humanitarian crowdfunding",
  ],

  authors: [
    {
      name: "4Relief Humanitarian Foundation",
      url: SITE_URL,
    },
  ],

  creator: "4Relief Humanitarian Foundation",

  publisher: "4Relief Humanitarian Foundation",

  alternates: {
    canonical: SITE_URL,
    languages: {
      ar: `${SITE_URL}/ar`,
      en: `${SITE_URL}/en`,
      tr: `${SITE_URL}/tr`,
    },
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "4Relief",
    title: "4Relief Humanitarian Foundation",
    description:
      "Connecting donors with transparent humanitarian and relief campaigns.",
    locale: "ar",
    alternateLocale: ["en", "tr"],
  },

  twitter: {
    card: "summary_large_image",
    title: "4Relief Humanitarian Foundation",
    description:
      "Connecting donors with transparent humanitarian and relief campaigns.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  category: "Humanitarian Organization",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  const supabase = getSupabaseOrNull();

  const settings = supabase
    ? (
        await supabase
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
          .maybeSingle()
      ).data
    : null;

  const primaryColor = settings?.primaryColor || "#0069D2";
  const accentColor = settings?.accentColor || "#F00F5A";

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

  const organizationId = `${SITE_URL}/#organization`;

  const websiteId = `${SITE_URL}/#website`;

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

        url: SITE_URL,

        description:
          "4Relief is an independent humanitarian foundation connecting donors with transparent humanitarian and relief campaigns.",

        logo: {
          "@type": "ImageObject",

          "@id": `${SITE_URL}/#logo`,

          url: `${SITE_URL}/brand/logo.png`,
        },

        image: `${SITE_URL}/brand/logo.png`,

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

        url: SITE_URL,

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

            urlTemplate: `${SITE_URL}/en/campaigns?search={search_term_string}`,
          },

          "query-input":
            "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`
        ${alexandria.variable}
        ${tajawal.variable}
        ${cairo.variable}
      `}
    >
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --brand: ${primaryColor};
                --accent: ${accentColor};
              }
            `,
          }}
        />
      </head>

      <body className="font-sans min-h-screen antialiased bg-cream text-ink">
        {gtmId && (
          <>
            <Script
              id="gtm-init"
              strategy="beforeInteractive"
            >
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
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{
                  display: "none",
                  visibility: "hidden",
                }}
              />
            </noscript>
          </>
        )}

        {children}

        {gaId && !gtmId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />

            <Script
              id="ga-init"
              strategy="afterInteractive"
            >
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
          </>
        )}
      </body>
    </html>
  );
}