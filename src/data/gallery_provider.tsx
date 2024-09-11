import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { MegaFilesPack, UnitFile } from './gallery_types';
import metadata from '../assets/metadata.json';

interface GalleryContextType {
    prefill: (lang: string) => Promise<MegaFilesPack>;

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
        const response = await fetch(pack.blob_uri);
        pack.blob = await response.blob();
    }

    const processedFiles = await Promise.all(
        Object.entries(pack.files).map(async ([key, file]) => {
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
    const prefill = useCallback(async (lang: string): Promise<MegaFilesPack> => {
        // Check if we already have prefilled data for this language
        if (prefilledDataCache.has(lang)) {
            return prefilledDataCache.get(lang)!;
        }

        let data: MegaFilesPack = metadata[lang];
        if (!data) {
            throw new Error(`No data found for language: ${lang}`);
        }

        // Fetch the blob if it doesn't exist
        if (!data.blob) {
            const response = await fetch(data.blob_uri, {
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
        return solidatedPack;
    }, [metadata]);


    const cleanup = useCallback(() => {
        // console.log('Cleaning up prefilled data cache');
        prefilledDataCache.forEach((data) => {
            data.blob_uri && URL.revokeObjectURL(data.blob_uri);
            Object.values(data.files).forEach((file) => {
                if (file.file_uri) {
                    URL.revokeObjectURL(file.file_uri);
                    // console.log(`Revoked URL: ${file.file_uri}`);
                }
            });
        });
        prefilledDataCache.clear();
    }, []);

    useEffect(() => {
        // Global cleanup when the app is closed or refreshed
        window.addEventListener('beforeunload', cleanup);
        return () => {
            window.removeEventListener('beforeunload', cleanup);
            cleanup();
        };
    }, [cleanup]);

    return (
        <GalleryContext.Provider value={{ prefill }}>
            {children}
        </GalleryContext.Provider>
    );
};

export default GalleryProvider;