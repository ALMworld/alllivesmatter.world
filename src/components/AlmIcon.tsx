import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ActionIconUnit from './AlmIconUnit';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Loader, X } from 'lucide-react';
import { useGallery } from '../data/gallery_provider';
import { MegaFilesPack, UnitFile } from '../data/gallery_types';
import ImageGalleryModal from './ImageGalleryModal';


const PrincipleIconDefaultImages = {
    love: '0_1_kindness_first',
    law: '0_2_fairness_always',
    money: '0_3_duki_in_action',
};

const AlmIcon = ({ value,expand_image_list = [], ...props }) => {
    console.log(   value )

    const { loadingState, error, getImageFiles } = useGallery();

    const [isExpanded, setIsExpanded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const defaultExpandImages = useMemo(() => {
        // if (!galleryData) return [];
        let target_files = expand_image_list.length > 0 ? expand_image_list : ["love", "law", "money"].includes(value) ? [PrincipleIconDefaultImages[value]] : [];
        // let files =  queryFiles(target_files, galleryData);

        if (loadingState !== 'loaded') return [];
        let files = getImageFiles(target_files);
        return files;
    }, [loadingState, expand_image_list, value]);


    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
            // loadGalleryData();
        } else {
            document.body.style.overflow = 'auto';
            setCurrentImageIndex(0);
            // setImageError(false);
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isExpanded]);
    // }, [isExpanded, loadGalleryData]);

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

    const handleCloseGallery = () => setIsExpanded(false);

    if (expand_image_list.length === 0 && !(["love", "law", "money"].includes(value))) {
        return <ActionIconUnit value={value} {...props} />;
    }

    return (
        <>
            <div onClick={handleIconClick} className="cursor-pointer">
                <ActionIconUnit value={value} {...props} />
            </div>

            <ImageGalleryModal 
                images={defaultExpandImages}
                isOpen={isExpanded}
                onClose={handleCloseGallery}
            />
        </>
    );
};

export default AlmIcon;