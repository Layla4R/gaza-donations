import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import PageEditor from "@/components/editor/PageEditor";
import { PageSection } from "@/lib/blocks";

export const revalidate = 0;

export default async function EditPagePage({
  params, searchParams,
}: {
  params: { id: string };
  searchParams: { locale?: string };
}) {
  try { await requireAdmin(); } catch { redirect("/admin/login"); }
  const supabase = getSupabase();
  const VALID_LOCALES = ["ar", "en", "fr", "tr"];
  const rawLocale = searchParams.locale;
  const locale = rawLocale && VALID_LOCALES.includes(rawLocale) ? rawLocale : "ar";

  // Always load the base page
  const { data: page } = await supabase
    .from("Page").select("*").eq("id", params.id).maybeSingle();
  if (!page) notFound();

  // For non-Arabic: load existing translation or start empty
  let editTitle = page.title;
  let editSections = (page.sections as unknown as PageSection[]) || [];
  let hasTranslation = false;

  if (locale !== "ar") {
    const { data: trans } = await supabase
      .from("PageTranslation")
      .select("*")
      .eq("pageId", page.id)
      .eq("locale", locale)
      .maybeSingle();

    if (trans) {
      editTitle = trans.title;
      editSections = (trans.sections as unknown as PageSection[]) || [];
      hasTranslation = true;
    } else {
      // Start from Arabic base as a starting point
      editTitle = page.title;
      editSections = (page.sections as unknown as PageSection[]) || [];
      hasTranslation = false;
    }
  }

  return (
    <PageEditor
      page={{
        id: page.id,
        title: editTitle,
        slug: page.slug,
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
