import { Locale, i18n } from "@/assets/i18config";
import { useAdvocacyData, useCommonData } from "@/data/data_provider";
import Advocacy from "@/app/views/Advocacy";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const commonData = useCommonData(lang);
  const data = useAdvocacyData(lang);

  return (
    <Advocacy lang={lang} commonData={commonData} data={data} />
  );
}
