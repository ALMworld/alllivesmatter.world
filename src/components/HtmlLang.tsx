'use client'

import { useEffect } from 'react';
import { LOCALE_TAGS } from '@/assets/i18config';

/**
 * Sets the <html lang> attribute dynamically based on the active locale.
 * Critical for screen readers — they use lang to determine pronunciation rules.
 * Without this, Chinese content is read with English pronunciation.
 */
export default function HtmlLang({ lang }: { lang: string }) {
    useEffect(() => {
        const bcp47 = LOCALE_TAGS[lang] || lang;
        document.documentElement.lang = bcp47;
    }, [lang]);

    return null;
}
