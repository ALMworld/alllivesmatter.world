import { Locale, i18n } from "@/assets/i18config";
import { useHowData, useMenuData } from "@/data/data_provider";
import How from "@/app/views/How";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const menu = useMenuData(lang);
  const how = useHowData(lang);
  return {
    title: menu.how,
    description: how.header.subtitle,
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const howData = useHowData(lang);

  return (
    <How data={howData} />
  );
}