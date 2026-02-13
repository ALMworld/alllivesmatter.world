import { Locale, i18n } from "@/assets/i18config";
import { useAboutData, useMenuData } from "@/data/data_provider";
import About from "@/app/views/About";
import { ReactNode } from "react";
import { Metadata } from "next";

// Import locale-specific FAQ content (statically bundled)
import { enFaqContent } from "@/assets/i18n/en/faq";
import { zhFaqContent } from "@/assets/i18n/zh/faq";
import { zhTWFaqContent } from "@/assets/i18n/zh-TW/faq";
import { ComponentType } from "react";

// Map locale to FAQ content
const faqContentByLocale: Record<string, Record<string, ComponentType>> = {
  en: enFaqContent,
  zh: zhFaqContent,
  'zh-TW': zhTWFaqContent,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const menu = useMenuData(lang);
  const about = useAboutData(lang);
  return {
    title: menu.about,
    description: about.sub_title,
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

// FAQPage JSON-LD for Google Rich Results
// thoughtPosters[0] is the intro; indices 1–12 correspond to faq_list[0–11]
function FaqJsonLd({ faqList, thoughtPosters }: {
  faqList: { question: string }[];
  thoughtPosters: { title: string; paragraphs: string[] }[];
}) {
  // Build FAQ entries from questions + thoughtPosters answers
  const faqEntries: { "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }[] = [];
  for (let i = 0; i < faqList.length && i + 1 < thoughtPosters.length; i++) {
    const question = faqList[i].question;
    const answerParagraphs = thoughtPosters[i + 1]?.paragraphs;
    if (question && answerParagraphs?.length) {
      faqEntries.push({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answerParagraphs.join(" "),
        },
      });
    }
  }

  if (faqEntries.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
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
    <>
      <FaqJsonLd faqList={aboutData.faq_list} thoughtPosters={aboutData.thoughtPosters} />
      <About lang={lang} aboutData={aboutData} faqData={faqData} faqMdxContent={faqMdxContent} />
    </>
  );
}