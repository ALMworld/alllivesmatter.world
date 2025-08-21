import { i18n, Locale } from '@/assets/i18config';

const LOCALE_STORAGE_KEY = 'alm-preferred-locale';

/**
 * Get the user's preferred locale based on:
 * 1. Previously stored user preference
 * 2. Browser language detection
 * 3. Default locale as fallback
 */
export function getPreferredLocale(): Locale {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
        return i18n.defaultLocale;
    }

    // 1. Check user's stored preference first
    try {
        const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
        if (storedLocale && i18n.locales.includes(storedLocale as Locale)) {
            return storedLocale as Locale;
        }
    } catch (error) {
        // localStorage might not be available
        console.warn('Could not access localStorage for locale preference');
    }

    // 2. Detect browser language
    const browserLang = detectBrowserLocale();
    if (browserLang && i18n.locales.includes(browserLang as Locale)) {
        return browserLang as Locale;
    }

    // 3. Fall back to default
    return i18n.defaultLocale;
}

/**
 * Store user's locale preference
 */
export function setPreferredLocale(locale: Locale): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch (error) {
        console.warn('Could not store locale preference');
    }
}

/**
 * Detect browser locale based on navigator.language and navigator.languages
 */
function detectBrowserLocale(): string | null {
    if (typeof window === 'undefined' || !navigator) {
        return null;
    }

    // Get browser languages in order of preference
    const browserLanguages = [
        navigator.language,
        ...(navigator.languages || [])
    ];

    console.log('Browser languages detected:', browserLanguages);

    for (const lang of browserLanguages) {
        // Extract the primary language code (e.g., 'en' from 'en-US')
        const primaryLang = lang.split('-')[0].toLowerCase();

        console.log('Checking language:', primaryLang);

        // Check if we support this language
        if (i18n.locales.includes(primaryLang as Locale)) {
            console.log('Matched supported locale:', primaryLang);
            return primaryLang;
        }
    }

    console.log('No matching locale found, using default');
    return null;
}

/**
 * Check if the current path matches a supported locale
 */
export function getCurrentLocaleFromPath(): Locale | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];

    if (firstSegment && i18n.locales.includes(firstSegment as Locale)) {
        return firstSegment as Locale;
    }

    return null;
}
