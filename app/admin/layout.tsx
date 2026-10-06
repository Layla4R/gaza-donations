import { AdminBrandingProvider } from "@/components/admin/AdminBranding";
import { getRequestSite } from "@/lib/request-site";
import type { Metadata } from "next";
export function generateMetadata(): Metadata {
    const site = getRequestSite();
    return {};
}
// Admin area: no site Header/Footer, LTR English layout
export default function AdminRootLayout({ children }: {
    children: React.ReactNode;
}) {
    return (<AdminBrandingProvider siteId={getRequestSite().id}>
      <div dir="ltr" className="min-h-screen bg-dashbg font-sans">
        {children}
      </div>
    </AdminBrandingProvider>);
}
