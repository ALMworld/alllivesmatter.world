import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ActionIconUnit from './AlmIconUnit';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Loader, X } from 'lucide-react';
import { useGallery } from '../data/gallery_provider';
import { MegaFilesPack, UnitFile } from '../data/gallery_types';
import ImageGalleryModal from './ImageGalleryModal';
import { useAboutData, useWhyData } from '../data/data_provider';
import Poster from './Poster';


const PrincipleIconDefaultImages = {
    love: '0_1_kindness_first',
    law: '0_2_fairness_always',
    money: '0_3_duki_in_action',
};

type AlmIconProps = {
    value: keyof typeof PrincipleIconDefaultImages | string;
    expand_image_list?: string[];
}

const AlmIcon = ({ value, expand_image_list = [],
    posterThoughts, posterFooter, ...props }: Omit<React.ComponentProps<any>, keyof AlmIconProps>) => {
    const { loadingState, error, getImageFiles } = useGallery();

    const [isExpanded, setIsExpanded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    const defaultExpandImages = useMemo(() => {
        let target_files = expand_image_list.length > 0 ? expand_image_list : ["love", "law", "money"].includes(value) ? [PrincipleIconDefaultImages[value]] : [];

        if (loadingState !== 'loaded') {
            return [];
        }

        let files = getImageFiles(target_files);
        return files;
    }, [loadingState, expand_image_list, value, getImageFiles]);


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

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsExpanded(true);
    };

    const handleCloseGallery = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setIsExpanded(false);
    };

    const closeExpandedImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsExpanded(false);
    };

    const nextImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % defaultExpandImages.length);
    }, [defaultExpandImages.length]);

    const prevImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentImageIndex(prevIndex => (prevIndex - 1 + defaultExpandImages.length) % defaultExpandImages.length);
    }, [defaultExpandImages.length]);

    if (expand_image_list.length === 0 && !(["love", "law", "money"].includes(value))) {
        return <ActionIconUnit value={value} {...props} />;
    }

    return (
        <div onClick={handleIconClick} className="cursor-pointer">
            <ActionIconUnit value={value} {...props} />

            <ImageGalleryModal
                images={defaultExpandImages}
                isOpen={isExpanded}
                onClose={handleCloseGallery}
            />
        </div>
    );
};

export default AlmIcon;