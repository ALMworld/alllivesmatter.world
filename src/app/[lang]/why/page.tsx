import { Locale, i18n } from "@/assets/i18config";
import { useWhyData } from "@/data/data_provider";
import Why from "@/app/views/Why";

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