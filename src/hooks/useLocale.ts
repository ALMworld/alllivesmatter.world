'use client'

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Locale } from '@/assets/i18config';
import { getCurrentLocaleFromPath, getPreferredLocale } from '@/utils/locale';

export function useLocale() {
    const [locale, setLocale] = useState<Locale | null>(null);
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsClient(true);

        // Get current locale from URL path
        const currentLocale = getCurrentLocaleFromPath();

        if (currentLocale) {
            setLocale(currentLocale);
        } else {
            // Fallback to preferred locale
            const preferred = getPreferredLocale();
            setLocale(preferred);
        }
    }, [pathname]);

    return {
        locale,
        isClient,
        isLoading: !isClient || !locale
    };
}
