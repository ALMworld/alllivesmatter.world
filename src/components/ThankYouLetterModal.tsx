import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ThanksLetterDatum } from './ThankYouLetter';
import ThankYouLetter from './ThankYouLetter';

interface ThankYouLetterModalProps {
    letters: ThanksLetterDatum[];
    signature: string[];
    isOpen: boolean;
    onClose: () => void;
    initialIndex?: number;
}

const ThankYouLetterModal: React.FC<ThankYouLetterModalProps> = ({
    letters,
    signature,
    isOpen,
    onClose,
    initialIndex = 0
}) => {
    const [currentLetterIndex, setCurrentLetterIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            setCurrentLetterIndex(initialIndex);
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, initialIndex]);

    const nextLetter = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentLetterIndex((prevIndex) => (prevIndex + 1) % letters.length);
    }, [letters.length]);

    const prevLetter = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentLetterIndex((prevIndex) => (prevIndex - 1 + letters.length) % letters.length);
    }, [letters.length]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[2147483647]"
            onClick={onClose}
        >
            <div className="relative w-[750px] h-[1000px] mx-auto h-full  max-h-[96vh] flex items-center justify-center">
                {letters.length > 0 && (
                    <div
                        key={currentLetterIndex}
                        className="flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full h-full overflow-auto bg-white rounded-lg">
                            <ThankYouLetter
                                className='w-full lg:w-[500px] aspect-[3/4]'
                                scale={1}
                                letter={letters[currentLetterIndex]}
                                signature={signature}
                            />
                        </div>
                    </div>
                )}
                {letters.length > 1 && (
                    <>
                        <button
                            onClick={prevLetter}
                            className={`absolute left-1 top-1/2 transform -translate-y-1/2 rounded-full p-2 transition-colors ${currentLetterIndex === 0
                                ? 'bg-gray-500 bg-opacity-50 cursor-not-allowed'
                                : 'bg-[#d20033] bg-opacity-50 hover:bg-opacity-75'
                                }`}
                            disabled={currentLetterIndex === 0}
                        >
                            <ChevronLeft size={24} color="white" />
                        </button>
                        <button
                            onClick={nextLetter}
                            className={`absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full p-2 transition-colors ${currentLetterIndex === letters.length - 1
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-[#d20033] bg-opacity-50 hover:bg-opacity-75'
                                }`}
                            disabled={currentLetterIndex === letters.length - 1}
                        >
                            <ChevronRight size={24} color="white" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ThankYouLetterModal;