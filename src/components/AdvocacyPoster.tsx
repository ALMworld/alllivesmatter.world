'use client'

import React from 'react';
import { MantraDetail, CommonData } from '@/data/data_types';
import { EclipseShader } from './EclipseShader';
import Image from 'next/image';

type AdvocacyPosterProps = {
    mantra: MantraDetail;
    allMantras: string[];  // Array of all mantra names ["Kindness First", "Fairness Always", "DUKI In Action"]
    headline: string;
    mantraIndex?: number;  // 0, 1, or 2 - controls sun position
    onClose?: () => void;
    isOpen?: boolean;
}

/**
 * A decorative poster component that displays advocacy content.
 * Features a golden ornamental frame, animated sunrise, ALM logo, and i18n text content.
 * Shows previous mantras above the current highlighted one.
 */
const AdvocacyPoster = ({ mantra, allMantras, headline, mantraIndex = 0, onClose, isOpen = true }: AdvocacyPosterProps) => {
    const keyPoints = mantra?.keyPoints || [];

    // Map mantraIndex (0, 1, 2) to sun step (0-10)
    const sunStepMap = [3, 5, 7];
    const sunStep = sunStepMap[mantraIndex] ?? 2;

    // Get previous mantras (all mantras before the current index)
    const previousMantras = allMantras.slice(0, mantraIndex);

    const handleOutsideClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
            onClick={handleOutsideClick}
        >
            {/* Fixed 3:4 aspect ratio container with 90vh height */}
            <div
                className="relative bg-black flex flex-col items-center rounded-lg overflow-hidden"
                style={{ height: '95vh', width: 'calc(95vh * 0.80)', maxWidth: '95vw' }}
            >
                {/* WebGL Sunrise Animation at top */}
                <div className="absolute top-0 left-0 right-0 h-[25%] overflow-hidden">
                    <EclipseShader step={sunStep} />
                </div>

                {/* Inner content with padding */}
                <div className="flex flex-col items-center justify-between h-full w-full px-6 py-8 pt-[15%] z-10">
                    {/* Header with ALM logo on left and mantras on right */}
                    <div className="flex items-center gap-4 w-full justify-center">
                        {/* ALM Logo on left */}
                        <Image
                            src="/alm.svg"
                            alt="ALM"
                            width={64}
                            height={64}
                            className="opacity-90 flex-shrink-0"
                        />

                        {/* Mantra progression */}
                        <div className="text-left">
                            {/* Previous mantras (smaller, faded) */}
                            {previousMantras.length > 0 && (
                                <div className="mb-1">
                                    {previousMantras.map((prevMantra, idx) => (
                                        <p
                                            key={idx}
                                            className="text-[10px] md:text-xs text-[#cab331]/50 tracking-widest"
                                        >
                                            {prevMantra}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {/* Current mantra (highlighted) */}
                            <h1 className="font-serif text-xl md:text-2xl font-bold text-[#cab331] tracking-wide">
                                {mantra?.mantra}
                            </h1>
                        </div>
                    </div>

                    {/* Decorative divider */}
                    <div className="flex items-center justify-center w-full max-w-[280px] my-2">
                        <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[#cab331] to-transparent" />
                        <svg className="mx-2" viewBox="0 0 100 30" width="60" height="18">
                            <line x1="0" y1="15" x2="30" y2="15" stroke="#cab331" strokeWidth="1" />
                            <circle cx="38" cy="15" r="3" fill="#cab331" />
                            <path d="M50,5 L55,15 L50,25 L45,15 Z" fill="#cab331" />
                            <circle cx="62" cy="15" r="3" fill="#cab331" />
                            <line x1="70" y1="15" x2="100" y2="15" stroke="#cab331" strokeWidth="1" />
                        </svg>
                        <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[#cab331] to-transparent" />
                    </div>

                    {/* Main quote */}
                    <blockquote className="font-serif italic text-xs md:text-sm text-[#d20033] text-center max-w-[340px] leading-snug px-2">
                        {mantra?.description}
                    </blockquote>

                    {/* Key points */}
                    <div className="flex flex-col gap-3 text-center max-w-[340px] flex-1 justify-center py-2">
                        {keyPoints.map((point, index) => (
                            <div key={index}>
                                <h3 className="font-serif text-sm md:text-base font-bold text-[#cab331] whitespace-nowrap">
                                    {point.title}
                                </h3>
                                <p className="text-[10px] md:text-xs text-white/85 leading-snug">
                                    {point.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer URL */}
                    <div className="pt-2">
                        <span className="text-xs text-[#cab331] tracking-wider font-semibold">
                            {/* {commonData.share_url} */}
                            AllLivesMatter.World
                        </span>
                    </div>
                </div>


                {/* Ornate Golden Border Frame */}
                <img
                    src="/ornate-border.svg"
                    alt=""
                    className="absolute inset-0 w-full h-full pointer-events-none z-1 p-2 scale-x-110 opacity-80 scale-y-110 mt-1"
                    style={{ objectFit: 'fill' }}
                />
            </div>
        </div>
    );
};

export default AdvocacyPoster;
