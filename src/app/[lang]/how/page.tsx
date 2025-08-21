import { Locale, i18n } from "@/assets/i18config";
import { useAboutData, useAdvocacyData, useCommonData, useHowData } from "@/data/data_provider";
import How from "@/app/views/How";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const howData = useHowData(lang);
  // const advocacyData = useAdvocacyData(lang);
  // const commonData = useCommonData(lang);
  // data: HowData
  // advocacyData: AdvocacyData
  // commonData: CommonData


  return (
    <How data={howData} />
  );
}