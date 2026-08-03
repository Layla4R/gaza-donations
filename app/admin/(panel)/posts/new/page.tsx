import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import PostForm from "@/components/admin/PostForm";

export default async function NewPostPage() {
  try { await requireAdmin(); } catch { redirect("/admin/login"); }
  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <PostForm />
    </div>
  );
}
