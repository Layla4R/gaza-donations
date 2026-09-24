import { policies } from './current-policies';
const titles: Record<string, string[]> = {
  "ar": [
    "سياسة الخصوصية وحماية البيانات",
    "شروط استخدام الموقع",
    "سياسة التبرعات والاسترداد",
    "سياسة ملفات الارتباط",
    "مكافحة غسل الأموال وتمويل الإرهاب",
    "الشكاوى والتواصل الرسمي",
    "الشفافية المالية والتقارير",
    "كيفية استخدام التبرعات",
    "حقوق المحتوى والمعلومات الرسمية"
  ],
  "en": [
    "Privacy and data protection policy",
    "Website terms of use",
    "Donation and refund policy",
    "Cookie policy",
    "Anti-money laundering and counter-terrorist financing",
    "Complaints and official contact",
    "Financial transparency and reports",
    "How donations are used",
    "Content rights and official information"
  ],
  "fr": [
    "Confidentialité et protection des données",
    "Conditions d’utilisation du site",
    "Politique de dons et de remboursement",
    "Politique de cookies",
    "Lutte contre le blanchiment et le financement du terrorisme",
    "Réclamations et contact officiel",
    "Transparence financière et rapports",
    "Utilisation des dons",
    "Droits des contenus et informations officielles"
  ],
  "tr": [
    "Gizlilik ve veri koruma politikası",
    "Site kullanım koşulları",
    "Bağış ve iade politikası",
    "Çerez politikası",
    "Kara para aklama ve terörün finansmanıyla mücadele",
    "Şikâyetler ve resmî iletişim",
    "Mali şeffaflık ve raporlar",
    "Bağışların kullanımı",
    "İçerik hakları ve resmî bilgiler"
  ]
};
const slugs = ['privacy','terms','refund-policy','cookie-policy','aml-policy','complaints','financial-transparency','how-we-use-donations','license'];
export function getPolicyMetadata(slug: string, locale: string) {
  const language = titles[locale] ? locale : 'ar';
  const title = titles[language][slugs.indexOf(slug)] || slug;
  const introduction = policies[language][slug]?.[0].text || '';
  return { title, description: title + ': ' + introduction.split(/[.!؟]/)[0] + '.' };
}
