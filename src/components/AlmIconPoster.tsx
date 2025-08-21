import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ActionIconUnit from './AlmIconUnit';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Loader, X } from 'lucide-react';
import { useGallery } from '../data/gallery_provider';
import { MegaFilesPack, UnitFile } from '../data/gallery_types';
import ImageGalleryModal from './ImageGalleryModal';
import { useAboutData, useWhyData } from '../data/data_provider';
import Poster from './Poster';
import { PosterFooter, ThoughtPoster } from '@/data/data_types';


type AlmIconProps = {
    value: string,
    posterData: ThoughtPoster;
    posterFooter: PosterFooter;
}

const AlmIconPoster = ({ value = "mail-up", posterData, posterFooter, ...props }: Omit<React.ComponentProps<any>, keyof AlmIconProps>) => {

    const { loadingState, error, getImageFiles } = useGallery();

    // const aboutData = useAboutData();
    // const posterThoughts = aboutData.thoughts;
    // const posterFooter = aboutData.posterFooter;

    const [isExpanded, setIsExpanded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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


    return (
        <div onClick={handleIconClick} className="cursor-pointer">
            <ActionIconUnit value={value} {...props} />

            {
                isExpanded && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeExpandedImage}>
                        <div className="relative" onClick={e => { e.stopPropagation(); e.preventDefault(); }}>
                            <Poster
                                title={posterData.title}
                                titleSegments={posterData.titleSegments ?? []}
                                paragraphs={posterData.paragraphs}
                                footerMain={posterFooter.mainTitle}
                                footerSubtitle={posterFooter.subtitle}
                            />
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default AlmIconPoster;