import Link from "next/link";
import Image from "next/image";
import { getSupabaseOrNull } from "@/lib/supabase";
import { loadTranslations } from "@/lib/i18n";

export const revalidate = 0;

export default async function NewsPage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = getSupabaseOrNull();
  const [postsRes, dict] = await Promise.all([
    supabase ? supabase.from("NewsPost").select("*").eq("isPublished", true).order("publishedAt", { ascending: false }) : Promise.resolve({ data: [] }),
    loadTranslations(locale),
  ]);
  const posts = postsRes?.data || [];

  // Load translations for all posts if non-Arabic
  let displayPosts = posts;
  if (locale !== "ar" && supabase && posts.length > 0) {
    const ids = posts.map((p: any) => p.id);
    const { data: translations } = await supabase
      .from("NewsPostTranslation")
      .select("postId, title, excerpt")
      .eq("locale", locale)
      .in("postId", ids);
    if (translations?.length) {
      const tMap: Record<string, any> = {};
      for (const t of translations) tMap[t.postId] = t;
      displayPosts = posts.map((p: any) => tMap[p.id] ? { ...p, title: tMap[p.id].title, excerpt: tMap[p.id].excerpt } : p);
    }
  }

  const p = locale === "ar" ? "" : `/${locale}`;
  const dateLocale = locale === "ar" ? "ar-EG" : locale === "tr" ? "tr-TR" : locale === "fr" ? "fr-FR" : "en-GB";

  return (
    <div>
      <header className="relative py-16 sm:py-20 bg-brand-gradient text-center overflow-hidden">
        <div className="relative max-w-screen-xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 text-white/70 font-display font-semibold text-xs tracking-[0.3em] uppercase mb-4">
            <span className="inline-block w-6 h-px bg-white/40" />{dict["news.eyebrow"]}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">{dict["news.title"]}</h1>
        </div>
      </header>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {displayPosts.length === 0
          ? <p className="text-center text-muted py-20">{dict["news.no_posts"]}</p>
          : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(displayPosts as any[]).map(post => (
                <Link key={post.id} href={`${p}/news/${post.slug}`} className="group bg-white rounded-xl2 border border-line overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
                  {post.coverImage && (
                    <div className="relative h-44 overflow-hidden bg-beige">
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-xs text-muted mb-2">{new Date(post.publishedAt).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })}</p>
                    <h2 className="font-display font-bold text-ink text-base mb-2 line-clamp-2 group-hover:text-brand transition">{post.title}</h2>
                    <p className="text-muted text-sm line-clamp-3 flex-1">{post.excerpt}</p>
                    <span className="mt-3 text-brand text-sm font-semibold">{dict["news.read_more"]}</span>
                  </div>
                </Link>
              ))}
            </div>
        }
      </div>
    </div>
  );
}
