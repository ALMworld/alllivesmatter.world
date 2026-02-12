import { Locale, i18n } from "@/assets/i18config";
import { useAboutData } from "@/data/data_provider";
import About from "@/app/views/About";
import { ReactNode } from "react";

// Import locale-specific FAQ content (statically bundled)
import { enFaqContent } from "@/assets/i18n/en/faq";
import { zhFaqContent } from "@/assets/i18n/zh/faq";
import { ComponentType } from "react";

// Map locale to FAQ content
const faqContentByLocale: Record<string, Record<string, ComponentType>> = {
  en: enFaqContent,
  zh: zhFaqContent,
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const aboutData = useAboutData(lang);
  const faqData = aboutData.faq_list;
  const faqComponents = faqContentByLocale[lang] || {};

  // Pre-render MDX content on server - pass rendered ReactNodes instead of components
  const faqMdxContent: Record<string, ReactNode> = {};
  for (const [key, MdxComponent] of Object.entries(faqComponents)) {
    faqMdxContent[key] = <MdxComponent />;
  }

  return (
    <About lang={lang} aboutData={aboutData} faqData={faqData} faqMdxContent={faqMdxContent} />
  );
}