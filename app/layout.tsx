import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
// 1. استيراد دالة جلب قاعدة البيانات
import { getSupabaseOrNull } from "@/lib/supabase"; 

// ... (أكواد الـ Metadata تبقى كما هي بدون تغيير) ...

// 2. تحويل RootLayout إلى دالة غير متزامنة (async) لجلب الإعدادات
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId  = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  // 3. جلب الألوان من قاعدة البيانات عند تحميل الموقع
  const supabase = getSupabaseOrNull();
  const settings = supabase
    ? (await supabase.from("SiteSettings").select("primaryColor, accentColor").eq("id", "default").maybeSingle()).data
    : null;

  const primaryColor = settings?.primaryColor || "#0069D2";
  const accentColor = settings?.accentColor || "#F00F5A";

  return (
    <html suppressHydrationWarning>
      <head>
        {/* ... (روابط الـ head والـ scripts تبقى كما هي) ... */}
        
        {/* 🌟 4. حقن الألوان كمتغيرات CSS على مستوى الـ HTML بالكامل */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --brand: ${primaryColor};
              --accent: ${accentColor};
            }
          `
        }} />
      </head>
      
      <body className="font-sans min-h-screen">
        {/* ... (باقي محتوى الـ body يبقى كما هو) ... */}
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