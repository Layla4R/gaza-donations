import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/icons";

interface ProjectArticleLayoutProps {
  data: {
    title: string;
    excerpt: string;
    body: string;
    body2?: string;
    coverImage?: string | null;
    secondaryImage?: string | null;
    gallery: string[];
    videoUrl?: string | null;
    publishedAtISO: string;
    updatedAtISO: string;
    authorName: string;
    trustBadge: string;
  };
  context: {
    locale: string;
    dict: Record<string, string>;
    isAr: boolean;
    brandName: string;
    backLink: string;
    backText: string;
    categoryLabel: string;
    donateUrl?: string;
  };
}

function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
}

export default function ProjectArticleLayout({ data, context }: ProjectArticleLayoutProps) {
  const { locale, dict, isAr, backLink, backText, categoryLabel, donateUrl } = context;
  const youtubeEmbed = getYouTubeEmbedUrl(data.videoUrl);

  const txtWrittenBy = locale === "en" ? "Supervised by:" : locale === "tr" ? "Sorumlu:" : locale === "fr" ? "Supervisé par:" : "إشراف وتوثيق:";
  const txtPublishedAt = locale === "en" ? "Published:" : locale === "tr" ? "Yayınlanma:" : locale === "fr" ? "Publié:" : "تاريخ التوثيق:";

  const renderFormattedBody = (content: string) => {
    if (!content) return null;
    const hasHtml = /<[a-z][\s\S]*>/i.test(content);
    if (hasHtml) {
      return (
        <div
          className="prose prose-base sm:prose-lg max-w-none text-slate-800 leading-relaxed prose-p:leading-relaxed prose-headings:font-bold"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    return (
      <div className="space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed">
        {content.split("\n").map((paragraph, idx) =>
          paragraph.trim() ? <p key={idx} className="leading-relaxed">{paragraph}</p> : null
        )}
      </div>
    );
  };

  return (
    <article className="mx-auto max-w-screen-xl px-4 sm:px-6 py-6 sm:py-10 bg-white min-h-screen">
      
      {/* 1. Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href={locale === "ar" ? "/" : `/${locale}/`} className="transition hover:text-brand">
          {dict["nav.home"] || (isAr ? "الرئيسية" : "Home")}
        </Link>
        <span>/</span>
        <Link href={backLink} className="transition hover:text-brand">
          {backText}
        </Link>
        <span>/</span>
        <span className="max-w-xs truncate text-slate-700 font-bold">{data.title}</span>
      </nav>

      {/* 2. Header */}
      <header className="max-w-4xl mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand mb-2">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span>{categoryLabel}</span>
        </div>

        <h1 className="mb-4 text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug sm:leading-normal tracking-normal">
          {data.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-bold text-brand">
              <Icon name="shield-check" size={16} />
            </div>
            <div>
              <p className="font-bold text-slate-900">
                {txtWrittenBy} <span className="text-brand">{data.authorName}</span>
              </p>
              <p className="text-[11px] text-slate-500">{data.trustBadge}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-slate-600 hidden sm:block">
              {txtPublishedAt}{" "}
              <time dateTime={data.publishedAtISO}>
                {new Date(data.publishedAtISO).toLocaleDateString(locale)}
              </time>
            </span>
            {/* زر التبرع في حال المشاريع */}
            {donateUrl && (
              <Link href={donateUrl} className="px-5 py-2 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl text-xs transition shadow-sm">
                {dict["campaign.donate"] || (isAr ? "تبرع الآن للمشروع" : "Donate Now")}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 3. Cover Image */}
      {data.coverImage && (
        <div className="relative mb-8 h-56 sm:h-[400px] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm border border-slate-100">
          <Image src={data.coverImage} alt={data.title} fill sizes="(max-width: 768px) 100vw, 1200px" className="object-cover" priority />
        </div>
      )}

      {/* 4. Excerpt / Summary */}
      {data.excerpt && (
        <section className="mb-8 border-s-4 border-brand bg-brand/5 p-4 rounded-e-xl text-xs sm:text-sm leading-relaxed text-slate-800">
          <strong className="block mb-1 text-xs uppercase tracking-wider text-brand font-bold flex items-center gap-1.5">
            <Icon name="check-circle" size={14} />
            {isAr ? "ملخص المشروع الإغاثي" : "Project Summary"}
          </strong>
          <p className="font-medium text-slate-700 leading-relaxed">{data.excerpt}</p>
        </section>
      )}

      {/* 5. Main Content Grid */}
      <div className={`grid grid-cols-1 ${data.videoUrl ? "lg:grid-cols-12" : "max-w-4xl mx-auto"} gap-8 items-start`}>
        
        {/* Main Body Column */}
        <div className={`${data.videoUrl ? "lg:col-span-8" : "w-full"} space-y-6`}>
          {data.body && (
            <div className="text-slate-800 text-sm sm:text-base leading-relaxed">
              {renderFormattedBody(data.body)}
            </div>
          )}

          {data.secondaryImage && (
            <figure className="my-6">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
                <Image src={data.secondaryImage} alt={data.title} fill sizes="(max-width: 768px) 100vw, 70vw" className="object-cover" />
              </div>
            </figure>
          )}

          {data.body2 && (
            <div className="text-slate-800 text-sm sm:text-base leading-relaxed pt-2">
              {renderFormattedBody(data.body2)}
            </div>
          )}

          {/* Gallery */}
          {data.gallery.length > 0 && (
            <section className="pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                <Icon name="image" size={16} className="text-brand" />
                {isAr ? "مشاهد وسائط من الميدان" : "Field Photo Gallery"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.gallery.map((imgUrl, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm">
                    <Image src={imgUrl} alt={`Gallery media ${idx + 1}`} fill sizes="(max-width: 640px) 100vw, 40vw" className="object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 6. Sticky Sidebar Video */}
        {data.videoUrl && (
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-slate-900 rounded-2xl p-3.5 text-white shadow-lg border border-slate-800">
              <div className="flex items-center gap-2 mb-2 px-1 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {isAr ? "تغطية مرئية خاصة" : "Special Video Coverage"}
              </div>

              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
                {youtubeEmbed ? (
                  <iframe src={youtubeEmbed} className="w-full h-full border-0" allowFullScreen title={data.title} />
                ) : (
                  <video src={data.videoUrl} controls playsInline className="w-full h-full object-cover" />
                )}
              </div>

              <p className="text-[11px] text-slate-300 mt-2.5 px-1 leading-relaxed">
                {isAr ? "تقرير توثيقي مصور يستعرض استجابة فرق 4Relief الميدانية للأزمة." : "Documentary video highlighting field response."}
              </p>
            </div>
          </aside>
        )}
      </div>

      {/* 7. Footer Strip */}
      <div className="mt-10 border-t border-slate-100 pt-6">
        <Link href={backLink} className="inline-flex items-center gap-2 font-bold text-brand hover:underline text-xs sm:text-sm">
          <Icon name="arrow-left" size={14} className={isAr ? "rotate-180" : ""} />
          {backText}
        </Link>
      </div>
    </article>
  );
}