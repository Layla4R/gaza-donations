
import { loadTranslations } from "@/lib/i18n";
import DonateClient from "./client";
import CompanyIdentity from "@/components/site/CompanyIdentity";
import { getRequestSite } from "@/lib/request-site";

export default async function DonatePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { amount?: string; freq?: string; campaign?: string; story?: string };
}) {
  const dict = await loadTranslations(locale);
  return (
    <>
    {getRequestSite().id !== "destekol" && <CompanyIdentity locale={locale} />}
    <DonateClient
      locale={locale}
      dict={dict}
      initialAmount={searchParams?.amount ? Number(searchParams.amount) : undefined}
      initialFreq={(searchParams?.freq as "ONE_TIME" | "MONTHLY") || "ONE_TIME"}
      campaignId={searchParams?.campaign}
      storyId={searchParams?.story}
    />
    </>
  );
}
