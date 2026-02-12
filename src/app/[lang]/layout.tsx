
import "@/app/globals.css";
import { i18n, Locale } from "@/assets/i18config";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import PeaceMusicPlayer from "@/components/PeaceMusicPlayer";
import GalleryProvider from "@/data/gallery_provider";
import { Metadata } from "next";

// Generate metadata dynamically based on locale
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;

    // You can customize these based on locale in the future
    const baseUrl = "https://www.alllivesmatter.world";
    const currentUrl = `${baseUrl}/${lang}`;

    return {
        title: "ALL LIVES MATTER · WORLD",
        description: "ALL LIVES MATTER · WORLD: Cultivate LOVE And Make All Great Again. Love is the way - Kindness First, Fairness Always, and DUKI in action. Join our movement for a world where all lives truly matter.",
        keywords: "ALL LIVES MATTER WORLDWIDE,ALL LIVES MATTER WORLD, ALL LIVES MATTER, world peace, humanity, compassion, kindness, fairness, DUKI,UBI, freedom, global outreach, authority, power, global movement, free will",
        authors: [{ name: "ALL LIVES MATTER WORLD" }],
        openGraph: {
            title: "ALL LIVES MATTER WORLD: BOTH TRUTH AND SUPERPOWER",
            description: "Cultivate LOVE And Make All Great Again. LOVE IS THE WAY - Kindness First, Fairness Always, and DUKI In Action.",
            url: currentUrl,
            siteName: "All Lives Matter World",
            images: [
                {
                    url: `${baseUrl}/alm.jpg`,
                    width: 1200,
                    height: 630,
                    alt: "All Lives Matter Worldwide logo",
                },
            ],
            locale: lang === 'en' ? 'en_US' : lang,
            type: "website",
        },
        twitter: {
            card: "summary",
            site: "@alm_world",
            title: "ALL LIVES MATTER WORLD: BOTH TRUTH AND SUPERPOWER",
            description: "Cultivate LOVE And Make All Great Again. LOVE IS THE WAY - Kindness First, Fairness Always, and DUKI In Action.",
            images: [`${baseUrl}/alm.jpg`],
        },
        alternates: {
            canonical: currentUrl,
            languages: {
                'en': `${baseUrl}/en`,
                'zh': `${baseUrl}/zh`,
                // 'es': `${baseUrl}/es`,
                // Add more locales as needed
            },
        },
    };
}


// Remove static metadata since we'll generate it dynamically
// export const metadata = {
//     title: "Next.js i18n Dashboard Template",
//     description: "How to create internationalized dasboard with Next.js",
// };

export default async function Root({ params, children }: { params: Promise<{ lang: Locale }>; children: React.ReactNode; }) {
    const { lang } = await params;
    console.log("langRoot", lang);
    return (
        <GalleryProvider>
            {/* <DataProvider>
            <GalleryProvider> */}
            <Header lang={lang} />
            {children}
            <Footer lang={lang} />
            <PeaceMusicPlayer lang={lang} />
            {/* </GalleryProvider>
        </DataProvider> */}
        </GalleryProvider>
    );
}

// export async function generateStaticParams() {
//     return i18n.locales.map((locale) => ({ lang: locale }));
// }
// This function tells Next.js which pages to build


export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}
