// Note: Do not use react-router-dom in Next.js app router

export const i18n = {
    // locales: ["en", "zh"] as const,
    locales: ["en"] as const,
    defaultLocale: "en",
} as const;

export type Locale = (typeof i18n)["locales"][number];


export const LANGUAGES = [
    { label: 'English', code: 'en' },
    // { label: '中文简体', code: 'zh' },
    // { label: 'Spanish', code: 'es' },
    // { label: 'Italian', code: 'it' },
]
