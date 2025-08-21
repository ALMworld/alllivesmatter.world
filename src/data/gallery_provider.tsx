'use client'

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { getBlobUri, MegaFilesPack, UnitFile } from './gallery_types';
import metadata from '../assets/metadata.json';
import { i18n } from '@/assets/i18config';
import { usePathname } from 'next/navigation';

type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';



// interface GalleryContextType {
//     prefill: (lang: string) => Promise<MegaFilesPack>;

// }
// const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

interface GalleryContextType {
    loadingState: LoadingState;
    error: string | null;
    getImageFiles: (keys: string[]) => (UnitFile | null)[];

}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export const useGallery = () => {
    const context = useContext(GalleryContext);
    if (context === undefined) {
        throw new Error('useGallery must be used within a GalleryProvider');
    }
    return context;
};

interface GalleryProviderProps {
    children: React.ReactNode;
}

// Cache to store prefilled data
const prefilledDataCache = new Map<string, MegaFilesPack>();

export async function prefillMegaFilesPack(pack: MegaFilesPack): Promise<MegaFilesPack> {
    if (!pack.blob) {
        // If blob is not set, fetch it from blob_uri
        // https://assets.alllivesmatter.world/blobs/en_3ed5d1c7b02edcc99f326e444a4d6332.blob
        const response = await fetch(getBlobUri(pack));
        pack.blob = await response.blob();
    }

    const processedFiles = await Promise.all(
        Object.entries(pack.files).map(async ([key, file]) => {
            // Only create blob URL if it doesn't already exist
            if (!file.file_uri && pack.blob) {
                const imageBlob = pack.blob.slice(file.range[0], file.range[1]);
                const blobWithMimeType = new Blob([imageBlob], { type: "image/webp" });
                file.file_uri = URL.createObjectURL(blobWithMimeType);
            }
            return [key, file] as [string, UnitFile];
        })
    );

    pack.files = Object.fromEntries(processedFiles);
    return pack;
}


export const GalleryProvider: React.FC<GalleryProviderProps> = ({ children }) => {
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [currentPack, setCurrentPack] = useState<MegaFilesPack | null>(null);
    const pathname = usePathname();

    // Extract language from pathname (e.g., /en/about -> en)
    const language = pathname?.split('/')[1] || i18n.defaultLocale;

    const loadGalleryData = useCallback(async (lang: string): Promise<MegaFilesPack | void> => {
        console.log(`loadGalleryData called for language: ${lang}`);
        setLoadingState('loading');
        setError(null);

        try {
            // Check if we already have prefilled data for this language
            if (prefilledDataCache.has(lang)) {
                const cachedPack = prefilledDataCache.get(lang)!;
                setCurrentPack(cachedPack);
                setLoadingState('loaded');
                return cachedPack;
            }

            console.log(`Loading new data for language: ${lang}`);
            let data: MegaFilesPack = metadata[lang];
            if (!data) {
                data = metadata[i18n.defaultLocale];

                // throw new Error(`No data found for language: ${lang}`);
            }

            // Fetch the blob if it doesn't exist
            if (!data.blob) {
                console.log(`Fetching blob for language: ${lang}`);
                const response = await fetch(getBlobUri(data), {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/alllivematter.world.blob,application/octet-stream',
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch blob data');
                }
                data.blob = await response.blob();
            }

            const solidatedPack = await prefillMegaFilesPack(data);
            // Cache the prefilled data
            prefilledDataCache.set(lang, solidatedPack);
            setCurrentPack(solidatedPack);
            setLoadingState('loaded');
            return solidatedPack;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            setLoadingState('error');
        }
    }, []);

    useEffect(() => {
        loadGalleryData(language);
    }, [loadGalleryData, language]);


    const getImageFiles = useCallback((keys: string[]): UnitFile[] => {
        if (!currentPack) {
            return [];
        }

        const result = keys.reduce((acc: UnitFile[], key) => {
            const file = currentPack.files[key];
            if (file) {
                acc.push(file);
            }
            return acc;
        }, []);

        return result;
    }, [currentPack]);

    useEffect(() => {
        // Global cleanup when the app is closed or refreshed
        const handleBeforeUnload = () => {
            prefilledDataCache.forEach((data) => {
                let blob_uri = getBlobUri(data);
                blob_uri && URL.revokeObjectURL(blob_uri);
                Object.values(data.files).forEach((file) => {
                    if (file.file_uri) {
                        URL.revokeObjectURL(file.file_uri);
                    }
                });
            });
            prefilledDataCache.clear();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Only cleanup on actual page unload, not during navigation
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // Don't cleanup cache during navigation - only on actual page unload
        };
    }, []);

    return (
        <GalleryContext.Provider value={{ loadingState, error, getImageFiles }}>
            {/* <GalleryContext.Provider value={{ prefill }}> */}
            {children}
        </GalleryContext.Provider>
    );
};

export default GalleryProvider;