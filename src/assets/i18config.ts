// Single source of truth for all locale/language definitions
// To add a new language, update locales, LANGUAGES, and LOCALE_TAGS

export const i18n = {
    locales: ["en", "zh", "zh-TW"] as const,
    defaultLocale: "en",
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const LANGUAGES = [
    { label: 'English', code: 'en' },
    { label: '中文简体', code: 'zh' },
    { label: '中文繁體', code: 'zh-TW' },
]

// BCP-47 locale tags — OG format (en_US) derived via ogLocale() helper
export const LOCALE_TAGS: Record<string, string> = { en: 'en-US', zh: 'zh-CN', 'zh-TW': 'zh-TW' };
export const ogLocale = (lang: string) => (LOCALE_TAGS[lang] || lang).replace('-', '_');


