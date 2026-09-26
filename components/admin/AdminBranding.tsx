"use client";

import { createContext, useContext } from "react";
import { getAdminBranding } from "@/lib/admin-branding";
import type { SiteId } from "@/lib/tenant";

const AdminBrandingContext = createContext(getAdminBranding("forrelief"));

export function AdminBrandingProvider({ siteId, children }: {
  siteId: SiteId;
  children: React.ReactNode;
}) {
  return (
    <AdminBrandingContext.Provider value={getAdminBranding(siteId)}>
      {children}
    </AdminBrandingContext.Provider>
  );
}

export const useAdminBranding = () => useContext(AdminBrandingContext);
