import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/icons";

interface Post {
  id: string; slug: string; title: string;
  excerpt: string; coverImage?: string | null; publishedAt: string;
}

interface NewsSectionProps {
  posts: Post[];
  locale: string;
  dict: Record<string, string>;
  data?: any; // إضافة خاصية الداتا لاستقبال التعديلات من لوحة التحكم
}

export default function NewsSection({ posts, locale, dict, data }: NewsSectionProps) {
  const p = locale === "ar" ? "" : `/${locale}`;
  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);
  const dateLocale = locale === "ar" ? "ar-EG" : locale === "tr" ? "tr-TR" : locale === "fr" ? "fr-FR" : "en-GB";

  // قراءة القيم من الداتا القادمة من الأدمن، أو استخدام القيم الافتراضية
  const sectionTitle = data?.title || t("news.title","الأخبار والمقالات","News & Articles","Actualités & Articles","Haberler & Makaleler");
  const sectionEyebrow = data?.subtitle || t("news.eyebrow","من ميدان العمل","From the Field","Du Terrain","Sahadan");

  return (
    <section className="py-20 bg-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-brand font-semibold text-xs tracking-[0.3em] uppercase mb-3">
              <span className="w-6 h-px bg-brand/40 inline-block" />
              {sectionEyebrow}
            </span>
            <h2 className="font-display text-4xl font-extrabold text-ink">
              {sectionTitle}
            </h2>
          </div>
          <Link href={`${p}/news`} className="flex items-center gap-2 text-brand font-bold hover:underline text-sm">
            {t("news.view_all","عرض جميع المقالات","View All Articles","Voir tous les Articles","Tüm Makaleleri Gör")}
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Link key={post.id} href={`${p}/news/${post.slug}`}
              className={`group bg-white rounded-2xl border border-line overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col ${i === 0 ? "sm:col-span-1" : ""}`}>
              {/* Image — full height, no overlay */}
              <div className="relative h-48 overflow-hidden bg-beige shrink-0">
                {post.coverImage ? (
                  <Image src={post.coverImage} alt={post.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand/5 to-brand/15">
                    <Icon name="file-text" size={40} className="text-brand/25" />
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-muted mb-2">
                  {new Date(post.publishedAt).toLocaleDateString(dateLocale, { year:"numeric", month:"long", day:"numeric" })}
                </p>
                <h3 className="font-display font-bold text-ink text-base mb-2 line-clamp-2 group-hover:text-brand transition leading-snug">
                  {post.title}
                </h3>
                <p className="text-muted text-sm line-clamp-3 flex-1 leading-relaxed">{post.excerpt}</p>
                <span className="mt-3 text-brand text-sm font-bold flex items-center gap-1 transition-all">
                  {t("news.read_more","اقرأ المزيد","Read More","Lire la Suite","Devamını Oku")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}