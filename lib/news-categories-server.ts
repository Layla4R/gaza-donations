import type { NewsCategory } from "@/lib/news-categories";
import { getSupabase } from "@/lib/supabase";
import "server-only";
export async function getNewsCategories(): Promise<NewsCategory[]> {
    return [];
}
export async function validNewsCategory(slug: unknown) {
    if (slug === null || slug === "")
        return true;
    if (typeof slug !== "string")
        return false;
    const { data, error } = await getSupabase().from("NewsCategory").select("slug").eq("slug", slug).maybeSingle();
    if (error)
        throw error;
    return !!data;
}
