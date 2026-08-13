import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { getSupabaseOrNull } from "@/lib/supabase"; 
// 🌟 استيراد خط Alexandria بدلاً من Cairo
import { Alexandria, Tajawal } from "next/font/google";

// 🌟 إعداد خط العناوين الجديد
const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-display",
});

// إعداد خط النصوص (можно تركه تجوال أو تغييره أيضاً)
const tajawal = Tajawal({
  weight: ['400', '500', '700', '800'],
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | 4Relief",
    default: "4Relief Humanitarian Foundation",
  },
  description: "An independent humanitarian donation platform with full transparency.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId  = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  const supabase = getSupabaseOrNull();
  const settings = supabase
    ? (await supabase.from("SiteSettings").select("primaryColor, accentColor").eq("id", "default").maybeSingle()).data
    : null;

  const primaryColor = settings?.primaryColor || "#0069D2";
  const accentColor = settings?.accentColor || "#F00F5A";

  return (
    // 🌟 تمرير متغيرات الخطوط الجديدة للـ HTML
    <html suppressHydrationWarning className={`${alexandria.variable} ${tajawal.variable}`}>
      <head>
        {gtmId && (
          <Script id="gtm-init" strategy="beforeInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
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
      
      <body className="font-sans min-h-screen antialiased">
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