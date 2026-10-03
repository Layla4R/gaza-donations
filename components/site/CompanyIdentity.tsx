import { companyIdentity } from '@/lib/company-identity';
export default function CompanyIdentity({ locale }: { locale: string }) {
  return <p className="mx-auto max-w-screen-xl px-6 py-4 text-sm leading-relaxed text-slate-600" dir={locale === 'ar' ? 'rtl' : 'ltr'}>{companyIdentity[locale] || companyIdentity.en}</p>;
}
