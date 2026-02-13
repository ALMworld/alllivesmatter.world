import { MetadataRoute } from 'next'
import { i18n } from '@/assets/i18config'

// Required for static export
export const dynamic = 'force-static'

const languages = i18n.locales

// Define your routes (without the [lang] parameter)
const routes = [
    '',        // home page
    'about',
    'how',
    'why'
] as const

// Base URL of your website
const baseUrl = 'https://alllivesmatter.world'

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemap: MetadataRoute.Sitemap = []

    // Add routes for each language with alternates for hreflang
    languages.forEach((lang) => {
        routes.forEach((route) => {
            const url = route === ''
                ? `${baseUrl}/${lang}`
                : `${baseUrl}/${lang}/${route}`

            // Build alternates for hreflang
            const alternateLanguages: Record<string, string> = {}
            languages.forEach((altLang) => {
                alternateLanguages[altLang] = route === ''
                    ? `${baseUrl}/${altLang}`
                    : `${baseUrl}/${altLang}/${route}`
            })

            sitemap.push({
                url,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1 : 0.8,
                alternates: {
                    languages: alternateLanguages,
                },
            })
        })
    })

    // Add root URL (redirects to default language)
    sitemap.push({
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
    })

    return sitemap
}
