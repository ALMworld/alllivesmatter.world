import React, { useState, useEffect } from 'react';
import ActionIconUnit from './AlmIconUnit';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Loader, X } from 'lucide-react';

const AlmIcon = ({ value, expand_image_list = [], ...props }) => {
    const { i18n, t } = useTranslation();
    const expandImageMap = {
        love: [`/images/${i18n.language}/0_1_kindness_first`],
        law: [`/images/${i18n.language}/0_2_fairness_always`],
        money: [`/images/${i18n.language}/0_3_duki_in_action`]
    };
    const defaultExpandImages = expandImageMap[value] || expand_image_list;
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        let loaderTimer;
        if (isLoading) {
            loaderTimer = setTimeout(() => {
                setShowLoader(true);
            }, 1000);
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
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isExpanded]);

    if (defaultExpandImages === undefined || defaultExpandImages === null || defaultExpandImages.length === 0) {
        return <ActionIconUnit value={value} {...props} />;
    }

    const handleIconClick = () => {
        setIsExpanded(true);
        setIsLoading(true);
        setImageError(false);
    };

    const closeExpandedImage = (e) => {
        e.stopPropagation();
        setIsExpanded(false);
        setIsLoading(false);
        setImageError(false);
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setIsLoading(true);
        setImageError(false);
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % defaultExpandImages.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setIsLoading(true);
        setImageError(false);
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + defaultExpandImages.length) % defaultExpandImages.length);
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setImageError(true);
    };

    return (
        <>
            <div
                onClick={handleIconClick}
                className="p-1 rounded-full rounded-lg hover:bg-[#d20033] cursor-pointer"
            >
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

                        <picture className="w-full h-full flex items-center justify-center">
                            <source srcSet={`${defaultExpandImages[currentImageIndex]}.avif`} type="image/avif" />
                            <source srcSet={`${defaultExpandImages[currentImageIndex]}.webp`} type="image/webp" />
                            <img
                                src={`${defaultExpandImages[currentImageIndex]}.webp`}
                                alt={`${value} details`}
                                className="max-w-full max-h-full object-contain"
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                style={{
                                    opacity: isLoading ? 0 : 1,
                                    borderRadius: '1rem',
                                    transition: 'opacity 0.3s ease-in-out'
                                }}
                            />
                        </picture>

                        {imageError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                                {t('Image failed to load')}
                            </div>
                        )}

                        {defaultExpandImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#d20033] bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                                >
                                    <ChevronLeft size={24} color="white" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#d20033] bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                                >
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