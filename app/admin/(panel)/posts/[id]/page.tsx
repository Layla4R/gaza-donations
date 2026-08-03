import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import PostForm from "@/components/admin/PostForm";
import NewsPostTranslationsPanel from "@/components/admin/NewsPostTranslationsPanel";

export const revalidate = 0;

export default async function EditPostPage({ params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { redirect("/admin/login"); }
  const supabase = getSupabase();
  const { data: post } = await supabase.from("NewsPost").select("*").eq("id", params.id).maybeSingle();
  if (!post) notFound();
  return (
    <div className="p-6 sm:p-8 max-w-3xl space-y-8">
      <PostForm initial={post} />
      <div>
        <NewsPostTranslationsPanel
          postId={post.id}
          baseTitle={post.title}
          baseExcerpt={post.excerpt}
          baseBody={post.body}
        />
      </div>
    </div>
  );
}
