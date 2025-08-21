'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPreferredLocale } from '@/utils/locale';

interface LocaleRedirectProps {
    children?: React.ReactNode;
}

export function LocaleRedirect({ children }: LocaleRedirectProps) {
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(true);
    const [loadingText, setLoadingText] = useState('Detecting your language...');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        // Show loading for a few seconds before redirecting
        const loadingTimer = setTimeout(() => {
            console.log('Changing text to Redirecting...');
            setLoadingText('Redirecting...');
        }, 1000); // Show "Detecting..." for 2 seconds

        const redirectTimer = setTimeout(() => {
            const preferredLocale = getPreferredLocale();
            console.log('Redirecting to locale:', preferredLocale);

            // Use replace to avoid adding to history
            router.replace(`/${preferredLocale}`);
        }, 3000); // Hold for 4 seconds total

        return () => {
            clearTimeout(loadingTimer);
            clearTimeout(redirectTimer);
        };
    }, [router]);

    // Show loading state during redirection
    if (isRedirecting) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                    {/* ALM Logo with animation */}
                    <div className="mb-8">
                        {imageError ? (
                            <div className="w-64 h-64 mx-auto flex items-center justify-center bg-gray-800 rounded-full border-4 border-yellow-400 animate-pulse">
                                <span className="text-6xl font-bold text-yellow-400">ALM</span>
                            </div>
                        ) : (
                            <img
                                src="/alm.svg"
                                alt="ALM"
                                width={256}
                                height={256}
                                className={`mx-auto animate-pulse transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-70'}`}
                                onLoad={() => {
                                    console.log('Image loaded successfully');
                                    setImageLoaded(true);
                                }}
                                onError={() => {
                                    console.error('Failed to load image, showing fallback');
                                    setImageError(true);
                                }}
                            />
                        )}
                    </div>

                    {/* Loading spinner */}
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>

                    {/* Loading text */}
                    <p className="text-lg text-gray-300">{loadingText}</p>
                </div>
                {children}
            </div>
        );
    }

    return null;
}
