
import { loadTranslations } from "@/lib/i18n";
import DonateClient from "./client";
import CompanyIdentity from "@/components/site/CompanyIdentity";
import { getRequestSite } from "@/lib/request-site";
import { companyDonationFlow } from "@/lib/company-identity";

export default async function DonatePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { amount?: string; freq?: string; campaign?: string; story?: string };
}) {
  const dict = await loadTranslations(locale);
  const donationDict = getRequestSite().id === "destekol" ? dict : {
    ...dict,
    "donate.subtitle": companyDonationFlow[locale] || companyDonationFlow.en,
  };
  return (
    <>
    {getRequestSite().id !== "destekol" && <CompanyIdentity locale={locale} />}
    <DonateClient
      locale={locale}
      dict={donationDict}
      initialAmount={searchParams?.amount ? Number(searchParams.amount) : undefined}
      initialFreq={(searchParams?.freq as "ONE_TIME" | "MONTHLY") || "ONE_TIME"}
      campaignId={searchParams?.campaign}
      storyId={searchParams?.story}
    />
    </>
  );
}
