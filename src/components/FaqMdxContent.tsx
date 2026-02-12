'use client';

import React, { useEffect, useState, ComponentType, Suspense } from 'react';
import { Locale } from '@/assets/i18config';

interface FaqMdxContentProps {
    locale: Locale;
    answersFile: string;
    fallbackAnswers?: string[];
}

/**
 * Client component that dynamically loads and renders FAQ MDX content
 */
export default function FaqMdxContent({ locale, answersFile, fallbackAnswers }: FaqMdxContentProps) {
    const [MdxComponent, setMdxComponent] = useState<ComponentType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function loadMdx() {
            try {
                // Dynamic import of MDX file
                const mdxModule = await import(`@/assets/i18n/${locale}/faq/${answersFile}.mdx`);
                if (mounted) {
                    setMdxComponent(() => mdxModule.default);
                    setLoading(false);
                }
            } catch (err) {
                console.warn(`Failed to load FAQ MDX: ${locale}/faq/${answersFile}.mdx`, err);
                if (mounted) {
                    setError(true);
                    setLoading(false);
                }
            }
        }

        loadMdx();

        return () => {
            mounted = false;
        };
    }, [locale, answersFile]);

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-600 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-600 rounded w-5/6"></div>
            </div>
        );
    }

    // Fallback to inline answers if MDX failed to load
    if (error && fallbackAnswers && fallbackAnswers.length > 0) {
        return (
            <>
                {fallbackAnswers.map((answer, index) => (
                    <p
                        key={index}
                        className="text-lg text-gray-300 mb-4"
                        dangerouslySetInnerHTML={{ __html: answer }}
                    />
                ))}
            </>
        );
    }

    if (!MdxComponent) {
        return null;
    }

    return (
        <div className="faq-mdx-content">
            <MdxComponent />
        </div>
    );
}
