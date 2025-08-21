import { Locale, i18n } from "@/assets/i18config";
import { useAboutData } from "@/data/data_provider";
import About from "@/app/views/About";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const aboutData = useAboutData(lang);
  const faqData = aboutData.faq_list;

  return (
    <About lang={lang} aboutData={aboutData} faqData={faqData} />
  );

}