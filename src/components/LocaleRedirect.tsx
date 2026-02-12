'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartHandshake } from 'lucide-react';
import { getPreferredLocale } from '@/utils/locale';

interface LocaleRedirectProps {
    children?: React.ReactNode;
}

export function LocaleRedirect({ children }: LocaleRedirectProps) {
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(true);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        // Redirect quickly without showing text
        const redirectTimer = setTimeout(() => {
            const preferredLocale = getPreferredLocale();
            console.log('Redirecting to locale:', preferredLocale);

            // Use replace to avoid adding to history
            router.replace(`/${preferredLocale}`);
        }, 1500); // Faster redirect

        return () => {
            clearTimeout(redirectTimer);
        };
    }, [router]);

    // Show loading state during redirection
    if (isRedirecting) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
                {/* ALM Logo with animation */}
                <div className="mb-6">
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

                {/* Heart Handshake icon with heartbeat animation */}
                <div className="animate-heartbeat">
                    <HeartHandshake
                        size={48}
                        className="text-yellow-400"
                        strokeWidth={1.5}
                    />
                </div>
                {children}
            </div>
        );
    }

    return null;
}

