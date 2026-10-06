export type SiteId = "forrelief";
export const SITE = { id: "forrelief" as const, name: "4Relief", schema: "public", url: "https://forrelief.org" };
export const SITES = { forrelief: SITE };
export function siteForHost(_host: string, _previewSite?: string) { return SITE; }
export function isSiteSession(payload: Record<string, unknown>, site: SiteId) { return payload.site === site; }
