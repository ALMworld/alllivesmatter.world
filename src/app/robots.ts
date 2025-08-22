import { MetadataRoute } from 'next'

// Required for static export
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alllivesmatter.world'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/_next/'], // Add any paths you want to exclude
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
