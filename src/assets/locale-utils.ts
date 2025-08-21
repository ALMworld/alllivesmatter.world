import { i18n, Locale } from './i18config';

export function isValidLocale(locale: string): locale is Locale {
    return i18n.locales.includes(locale as Locale);
}

export function getValidLocale(locale?: string): Locale {
    if (locale && isValidLocale(locale)) {
        return locale;
    }
    return i18n.defaultLocale;
}

export function getLocaleFromPath(pathname: string): Locale | null {
    const segments = pathname.split('/');
    const potentialLocale = segments[1];

    if (potentialLocale && isValidLocale(potentialLocale)) {
        return potentialLocale;
    }

    return null;
}
