import { redirect } from "next/navigation";
import { getSupabaseOrNull } from "@/lib/supabase";

export default async function RootPage() {
  const supabase = getSupabaseOrNull();
  const settings = supabase
    ? (await supabase.from("SiteSettings").select("facebookUrl, twitterUrl, instagramUrl, youtubeUrl, linkedinUrl").eq("id", "default").maybeSingle()).data
    : null;

  const sameAsLinks = [
    settings?.facebookUrl,
    settings?.twitterUrl,
    settings?.instagramUrl,
    settings?.youtubeUrl,
    settings?.linkedinUrl,
  ].filter(Boolean);

  const rootSchema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": "https://forrelief.org/#organization",
    "name": "4Relief Humanitarian Foundation",
    "url": "https://forrelief.org",
    "logo": "https://forrelief.org/logo.png",
    "description": "An independent humanitarian donation platform dedicated to full transparency and direct relief campaigns.",
    "sameAs": sameAsLinks,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchema) }}
      />
      {redirect("/ar")}
    </>
  );
}