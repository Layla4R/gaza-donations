import { MetadataRoute } from 'next';
import { getSupabaseOrNull } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://forrelief.org';
  const supabase = getSupabaseOrNull();

  let campaignUrls: any[] = [];
  if (supabase) {
    const { data: campaigns } = await supabase.from('Campaign').select('slug, updatedAt').eq('isPublished', true);
    if (campaigns) {
      campaignUrls = campaigns.flatMap((c) => 
        ['ar', 'en', 'fr', 'tr'].map((locale) => ({
          url: `${baseUrl}/${locale}/campaigns/${c.slug}`,
          lastModified: c.updatedAt || new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        }))
      );
    }
  }

  const staticPages = ['', '/about', '/contact', '/transparency', '/campaigns'];
  const staticUrls = staticPages.flatMap((page) =>
    ['ar', 'en', 'fr', 'tr'].map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1.0 : 0.7,
    }))
  );

  return [...staticUrls, ...campaignUrls];
}