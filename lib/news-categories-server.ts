import "server-only";
import { getSupabase } from "@/lib/supabase";
import { getRequestSite } from "@/lib/request-site";
import type { NewsCategory } from "@/lib/news-categories";

export async function getNewsCategories(): Promise<NewsCategory[]> {
  if (getRequestSite().id !== "destekol") return [];
  const { data, error } = await getSupabase().from("NewsCategory").select("slug,labels,sortOrder").order("sortOrder").order("slug");
  if (error) throw new Error(`Could not load news categories: ${error.message}`);
  return data || [];
}

export async function validNewsCategory(slug: unknown) {
  if (slug === null || slug === "") return true;
  if (typeof slug !== "string") return false;
  const { data, error } = await getSupabase().from("NewsCategory").select("slug").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return !!data;
}
