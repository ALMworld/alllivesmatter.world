import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader, X } from 'lucide-react';

const ImageGalleryModal = ({ images, isOpen, onClose, initialIndex = 0 }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            setCurrentImageIndex(initialIndex);
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, initialIndex]);

    const nextImage = useCallback((e) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsLoading(true);
    }, [images.length]);

    const prevImage = useCallback((e) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        setIsLoading(true);
    }, [images.length]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[2147483647]"
            onClick={onClose}
        >
            <div className="relative w-full h-full max-w-3xl max-h-[90vh] flex items-center justify-center">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <Loader className="w-12 h-12 text-[#d20033] animate-spin" />
                    </div>
                )}
                {images.length > 0 && (
                    <div key={images[currentImageIndex].base_name} className="w-full h-full flex items-center justify-center">
                        <img
                            src={images[currentImageIndex].file_uri}
                            alt={images[currentImageIndex].base_name}
                            className="max-w-full max-h-full object-contain"
                            style={{
                                opacity: isLoading ? 0 : 1,
                                borderRadius: '1rem',
                                transition: 'opacity 0.3s ease-in-out'
                            }}
                            onLoad={() => setIsLoading(false)}
                        />
                    </div>
                )}
                {images.length > 1 && (
                    <>
                        <button onClick={prevImage}
                            // className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#d20033] bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 transition-colors ${currentImageIndex === 0
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-[#d20033] bg-opacity-50 hover:bg-opacity-75'
                                }`}
                            disabled={currentImageIndex === 0}

                        >
                            <ChevronLeft size={24} color="white" />
                        </button>
                        <button onClick={nextImage}
                            // className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#d20033] bg-opacity-50 rounded-full p-2 hover:bg-opacity-75">
                            className={`absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full p-2 transition-colors ${currentImageIndex === images.length - 1
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-[#d20033] bg-opacity-50 hover:bg-opacity-75'
                                }`}
                            disabled={currentImageIndex === images.length - 1}>
                            <ChevronRight size={24} color="white" />
                        </button>
                    </>
                )}
                {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 text-black hover:bg-gray-200 transition-colors"
          aria-label="Close image gallery"
        >
          <X size={24} />
        </button> */}
            </div>
        </div>
    );
};

export default ImageGalleryModal;