import { headers } from "next/headers";
import { siteForHost } from "./tenant";
export function getRequestSite() {
  return siteForHost(headers().get("host") || "", process.env.SITE_ID);
}
export function siteEnv(name: string): string | undefined {
  const site = getRequestSite();
  return process.env[`${site.id.toUpperCase()}_${name}`] || (site.id === "forrelief" ? process.env[name] : undefined);
}
