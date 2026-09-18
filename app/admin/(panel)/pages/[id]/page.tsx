import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import PageEditor from "@/components/editor/PageEditor";
import { PageSection } from "@/lib/blocks";

export const revalidate = 0;

export default async function EditPagePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { locale?: string };
}) {
  try { await requireAdmin(); } catch { redirect("/admin/login"); }
  const supabase = getSupabase();
  const VALID_LOCALES = ["ar", "en", "fr", "tr"];
  const rawLocale = searchParams.locale;
  const locale = rawLocale && VALID_LOCALES.includes(rawLocale) ? rawLocale : "ar";

  const { data: page } = await supabase
    .from("Page").select("*").eq("id", params.id).maybeSingle();
  if (!page) notFound();

  let editTitle = page.title;
  let editSections = (page.sections as unknown as PageSection[]) || [];
  let editBody = page.body || "";
  let editBody2 = page.body2 || "";
  let editVideoUrl = page.videoUrl || "";
  let hasTranslation = false;

  if (locale !== "ar") {
    const { data: trans } = await supabase
      .from("PageTranslation")
      .select("*")
      .eq("pageId", page.id)
      .eq("locale", locale)
      .maybeSingle();

    if (trans) {
      editTitle = trans.title || editTitle;
      editSections = (trans.sections as unknown as PageSection[]) || editSections;
      editBody = trans.body || editBody;
      editBody2 = trans.body2 || editBody2;
      editVideoUrl = trans.videoUrl || editVideoUrl;
      hasTranslation = true;
    }
  }

  return (
    <PageEditor
      page={{
        id: page.id,
        title: editTitle,
        slug: page.slug,
        description: page.description || "",
        body: editBody,
        body2: editBody2,
        coverImage: page.coverImage || null,
        secondaryImage: page.secondaryImage || null,
        gallery: Array.isArray(page.gallery) ? page.gallery : [],
        videoUrl: editVideoUrl,
        isPublished: page.isPublished,
        showInMenu: page.showInMenu,
        isSystem: page.isSystem,
        sections: editSections,
      }}
      locale={locale}
      isTranslation={locale !== "ar"}
      hasExistingTranslation={hasTranslation}
    />
  );
}