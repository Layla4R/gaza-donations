
import { loadTranslations } from "@/lib/i18n";
import DonateClient from "./client";

export default async function DonatePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { amount?: string; freq?: string; campaign?: string };
}) {
  const dict = await loadTranslations(locale);
  return (
    <DonateClient
      locale={locale}
      dict={dict}
      initialAmount={searchParams?.amount ? Number(searchParams.amount) : undefined}
      initialFreq={(searchParams?.freq as "ONE_TIME" | "MONTHLY") || "ONE_TIME"}
    />
  );
}
