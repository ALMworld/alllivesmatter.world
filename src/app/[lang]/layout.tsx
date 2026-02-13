
import "@/app/globals.css";
import { i18n, Locale, LOCALE_TAGS, ogLocale } from "@/assets/i18config";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import PeaceMusicPlayer from "@/components/PeaceMusicPlayer";
import GalleryProvider from "@/data/gallery_provider";
import { Metadata } from "next";
import { useAdvocacyData, useCommonData } from "@/data/data_provider";

const BASE_URL = "https://alllivesmatter.world";

// Derive site metadata from i18n data — single source of truth, language-agnostic
function getSiteMetadata(lang: Locale) {
    const advocacy = useAdvocacyData(lang);
    const common = useCommonData(lang);

    const title = `${advocacy.slogan_headline} · ${advocacy.slogan_headline_suffix}`;
    const description = common.advocacy_in_peace;

    // OG: headline + mantras from advocacy data
    const mantras = advocacy.mantra_details.map((m: { mantra: string }) => m.mantra).join(', ');
    const ogTitle = `${advocacy.slogan_headline} · ${advocacy.slogan_headline_suffix}`;
    const ogDescription = `${advocacy.mantra} — ${mantras}`;

    return { title, description, ogTitle, ogDescription };
}

// Generate metadata dynamically based on locale
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const meta = getSiteMetadata(lang);
    const currentUrl = `${BASE_URL}/${lang}`;

    return {
        title: {
            default: meta.title,
            template: `%s | ${meta.title}`,
        },
        description: meta.description,
        keywords: "ALL LIVES MATTER WORLDWIDE, ALL LIVES MATTER WORLD, ALL LIVES MATTER, world peace, humanity, compassion, kindness, fairness, DUKI, UBI, freedom, global outreach, global movement, free will, universal kindness income",
        authors: [{ name: "ALL LIVES MATTER WORLD" }],
        metadataBase: new URL(BASE_URL),
        openGraph: {
            title: meta.ogTitle,
            description: meta.ogDescription,
            url: currentUrl,
            siteName: "All Lives Matter World",
            images: [
                {
                    url: `${BASE_URL}/alm.png`,
                    width: 1200,
                    height: 1200,
                    alt: "All Lives Matter World logo",
                },
            ],
            locale: ogLocale(lang),
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            site: "@alm_world",
            title: meta.ogTitle,
            description: meta.ogDescription,
            images: [`${BASE_URL}/alm.png`],
        },
        alternates: {
            canonical: currentUrl,
            languages: Object.fromEntries(
                i18n.locales.map(l => [l, `${BASE_URL}/${l}`])
            ),
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

// JSON-LD structured data
function JsonLd({ lang }: { lang: Locale }) {
    const meta = getSiteMetadata(lang);

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "All Lives Matter World",
        url: BASE_URL,
        logo: `${BASE_URL}/alm.png`,
        description: meta.description,
        sameAs: [
            "https://x.com/alm_world",
        ],
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: meta.title,
        url: `${BASE_URL}/${lang}`,
        description: meta.description,
        inLanguage: LOCALE_TAGS[lang] || lang,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
        </>
    );
}

export default async function Root({ params, children }: { params: Promise<{ lang: Locale }>; children: React.ReactNode; }) {
    const { lang } = await params;
    return (
        <GalleryProvider>
            <JsonLd lang={lang} />
            <Header lang={lang} />
            {children}
            <Footer lang={lang} />
            <PeaceMusicPlayer lang={lang} />
        </GalleryProvider>
    );
}

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

