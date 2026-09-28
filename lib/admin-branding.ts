import { SITES, type SiteId } from "./tenant";

export function getAdminBranding(siteId: SiteId) {
  return {
    name: SITES[siteId].name,
    logo: siteId === "destekol"
      ? "/brand/destekol-logo.png"
      : "/brand/logo-horizontal-transparent.png",
  };
}
