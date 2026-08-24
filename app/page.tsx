import LocaleLayout from "./[locale]/layout";
import HomePage, { generateMetadata as generateHomeMetadata } from "./[locale]/page";

export async function generateMetadata() {
  return generateHomeMetadata({ params: { locale: "ar" } });
}

export default async function RootPage() {
  return (
    <LocaleLayout params={{ locale: "ar" }}>
      <HomePage params={{ locale: "ar" }} />
    </LocaleLayout>
  );
}