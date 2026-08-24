import HomePage, { generateMetadata as generateHomeMetadata } from "./[locale]/page";

export async function generateMetadata() {
  return generateHomeMetadata({ params: { locale: "ar" } });
}

export default async function RootPage() {
  return <HomePage params={{ locale: "ar" }} />;
}