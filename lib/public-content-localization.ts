import translations from "./generated/public-content-translations.json";

type Language = "en" | "fr" | "tr";
const dictionaries = translations as Record<Language, Record<string, string>>;
const identifiers = new Set([
    "id", "type", "slug", "icon", "category", "categorySlug", "campaignId",
    "pageId", "postId", "sectionId", "locale", "language", "currency", "frequency",
    "email", "contactEmail", "url", "href", "src", "image", "coverImage", "videoUrl",
    "buttonLink", "link", "createdAt", "updatedAt", "publishedAt", "authorName", "authorRole",
]);

/** Resolve reviewed, local translations without calling an API during rendering. */
export function localizePublicText(value: string, locale: string): string {
    const dictionary = dictionaries[locale as Language];
    if (!dictionary || !/[\u0621-\u064a\u066e-\u06d3]/.test(value)) return value;
    return value.split(/(<[^>]*>|https?:\/\/[^\s<>]+|\r?\n+)/g).filter(Boolean).map(part => {
        if (/^(<|https?:\/\/|\r?\n)/.test(part)) return part;
        let rest = part, output = "";
        while (rest.length) {
            let end = Math.min(700, rest.length);
            if (end < rest.length) {
                const space = rest.lastIndexOf(" ", end - 1);
                if (space > 0) end = space + 1;
            }
            const chunk = rest.slice(0, end);
            rest = rest.slice(end);
            const core = chunk.trim();
            if (!core) { output += chunk; continue; }
            output += (chunk.match(/^\s*/)?.[0] || "") + (dictionary[core] || core) + (chunk.match(/\s*$/)?.[0] || "");
        }
        return output;
    }).join("");
}

/** Public editorial data only. Technical values and Arabic content stay intact. */
export function localizePublicContent<T>(value: T, locale: string): T {
    if (locale === "ar") return value;
    if (typeof value === "string") return localizePublicText(value, locale) as T;
    if (Array.isArray(value)) return value.map(item => localizePublicContent(item, locale)) as T;
    if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
        return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [
            key, identifiers.has(key) ? item : localizePublicContent(item, locale),
        ])) as T;
    }
    return value;
}
