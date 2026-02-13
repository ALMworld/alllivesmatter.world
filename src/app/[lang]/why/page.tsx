import { Locale, i18n } from "@/assets/i18config";
import { useMenuData, useWhyData } from "@/data/data_provider";
import Why from "@/app/views/Why";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const menu = useMenuData(lang);
    const why = useWhyData(lang);
    return {
        title: menu.why,
        description: why.highlight.question,
    };
}

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const whyData = useWhyData(lang);

    return (
        <Why data={whyData} />
    );
}