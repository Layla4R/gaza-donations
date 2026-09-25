export type SiteId = "forrelief" | "destekol";
export const SITES = {
  forrelief: { id: "forrelief" as const, name: "4Relief", schema: "public", url: "https://forrelief.org" },
  destekol: { id: "destekol" as const, name: "Destekol", schema: "destekol", url: "https://destekol.org" },
};
export function siteForHost(host: string, previewSite?: string) {
  const hostname = host.toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
  if (hostname === "destekol.org" || hostname === "www.destekol.org") return SITES.destekol;
  if (hostname === "forrelief.org" || hostname === "www.forrelief.org") return SITES.forrelief;
  // Preview deployments must explicitly identify the tenant; request data cannot select a schema.
  if (previewSite === "destekol" || previewSite === "forrelief") return SITES[previewSite];
  if (["localhost", "127.0.0.1", "[::1]"].includes(hostname)) return SITES.forrelief;
  throw new Error("SITE_HOST_NOT_CONFIGURED");
}
export function isSiteSession(payload: Record<string, unknown>, site: SiteId) { return payload.site === site; }
