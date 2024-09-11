import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ActionIconUnit from './AlmIconUnit';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Loader, X } from 'lucide-react';
import { useGallery } from '../data/gallery_provider';
import { MegaFilesPack, UnitFile } from '../data/gallery_types';


export function queryFiles(keys: string[] = [], galleryData: MegaFilesPack): UnitFile[] {
    if (!galleryData || !galleryData.files) return [];

    return Object.entries(galleryData.files)
        .filter(([key]) => keys.length === 0 || keys.includes(key))
        .map(([_, file]) => file);
}

const AlmIcon = ({ value, expand_image_list = [], ...props }) => {
    const { i18n, t } = useTranslation();
    const { prefill } = useGallery();

    const [isExpanded, setIsExpanded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [galleryData, setGalleryData] = useState<MegaFilesPack | null>(null);

    const defaultExpandImages = useMemo(() => {
        if (!galleryData) return [];
        let target_files = expand_image_list.length > 0 ? expand_image_list : ["love", "law", "money"].includes(value) ? [value] : [];
        let files =  queryFiles(target_files, galleryData);
        return files;
    }, [galleryData, expand_image_list, value]);

    const loadGalleryData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await prefill(i18n.language);
            setGalleryData(data);
        } catch (err) {
            setImageError(true);
            console.error('Error loading gallery data:', err);
        } finally {
            setIsLoading(false);
        }
    }, [prefill, i18n.language]);

    useEffect(() => {
        let loaderTimer;
        if (isLoading) {
            loaderTimer = setTimeout(() => setShowLoader(true), 1000);
        } else {
            setShowLoader(false);
        }
        return () => {
            if (loaderTimer) clearTimeout(loaderTimer);
        };
    }, [isLoading]);

    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
            loadGalleryData();
        } else {
            document.body.style.overflow = 'auto';
            setCurrentImageIndex(0);
            setImageError(false);
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isExpanded, loadGalleryData]);

    const handleIconClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(true);
    }, []);

    const closeExpandedImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(false);
    }, []);

    const nextImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % defaultExpandImages.length);
    }, [defaultExpandImages.length]);

    const prevImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex(prevIndex => (prevIndex - 1 + defaultExpandImages.length) % defaultExpandImages.length);
    }, [defaultExpandImages.length]);

    if (expand_image_list.length === 0 && !(["love", "law", "money"].includes(value))) {
        return <ActionIconUnit value={value} {...props} />;
    }

    return (
        <>
            <div onClick={handleIconClick} className="cursor-pointer">
                <ActionIconUnit value={value} {...props} />
            </div>
            {isExpanded && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closeExpandedImage}>
                    <div className="relative w-full h-full max-w-3xl max-h-[90vh] flex items-center justify-center">
                        {showLoader && !imageError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <Loader className="w-12 h-12 text-[#d20033] animate-spin" />
                            </div>
                        )}
                        {defaultExpandImages.length > 0 && (
                            <div key={defaultExpandImages[currentImageIndex].base_name} className="w-full h-full flex items-center justify-center">
                                <img
                                    src={defaultExpandImages[currentImageIndex].file_uri}
                                    alt={defaultExpandImages[currentImageIndex].base_name}
                                    // loading="lazy"
                                    className="max-w-full max-h-full object-contain"
                                    style={{
                                        opacity: isLoading ? 0 : 1,
                                        borderRadius: '1rem',
                                        transition: 'opacity 0.3s ease-in-out'
                                    }}
                                />
                            </div>
                        )}
                        {imageError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                                {t('Image failed to load')}
                            </div>
                        )}
                        {defaultExpandImages.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#d20033] bg-opacity-50 rounded-full p-2 hover:bg-opacity-75">
                                    <ChevronLeft size={24} color="white" />
                                </button>
                                <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#d20033] bg-opacity-50 rounded-full p-2 hover:bg-opacity-75">
                                    <ChevronRight size={24} color="white" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AlmIcon;