import { Locale } from '@/assets/i18config';
import { FAQList } from '@/data/data_types';
import { ComponentType } from 'react';

// Cache for loaded MDX content
const mdxCache = new Map<string, ComponentType>();

/**
 * Dynamically loads FAQ MDX content based on locale and filename
 * @param locale - The current locale (e.g., 'en', 'zh')
 * @param answersFile - The filename without extension
 * @returns A promise that resolves to the MDX component
 */
export async function loadFaqMdx(locale: Locale, answersFile: string): Promise<ComponentType | null> {
    const cacheKey = `${locale}/${answersFile}`;

    if (mdxCache.has(cacheKey)) {
        return mdxCache.get(cacheKey)!;
    }

    try {
        // Dynamic import of MDX file
        const mdxModule = await import(`@/assets/i18n/${locale}/faq/${answersFile}.mdx`);
        const Component = mdxModule.default;
        mdxCache.set(cacheKey, Component);
        return Component;
    } catch (error) {
        console.warn(`Failed to load FAQ MDX: ${cacheKey}`, error);
        return null;
    }
}

/**
 * Gets answers from FAQ item - either from MDX file reference or inline answers array
 * For use in server components, returns the answersFile if available
 */
export function getFaqAnswersFile(faq: FAQList): string | null {
    return faq.answersFile ?? null;
}

