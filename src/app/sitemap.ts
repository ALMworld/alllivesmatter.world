import { MetadataRoute } from 'next'

// Required for static export
export const dynamic = 'force-static'

// Define your supported languages
const languages = ['en'] as const
type Language = typeof languages[number]

// Define your routes (without the [lang] parameter)
const routes = [
    '',        // home page
    'about',
    'how',
    'why'
] as const

// Base URL of your website
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alllivesmatter.world'

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemap: MetadataRoute.Sitemap = []

    // Add routes for each language
    languages.forEach((lang) => {
        routes.forEach((route) => {
            const url = route === ''
                ? `${baseUrl}/${lang}`
                : `${baseUrl}/${lang}/${route}`

            sitemap.push({
                url,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1 : 0.8,
            })
        })
    })

    // Add root redirect (optional - this might redirect to default language)
    sitemap.push({
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
    })

    return sitemap
}
