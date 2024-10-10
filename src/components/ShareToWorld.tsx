import React, { useState, useEffect, useCallback } from 'react';
import { Heart, AlertTriangle } from 'lucide-react';
import ShareTargets from "./ShareTargets";

// Define an enum for the share modes
const ShareMode = {
    PEACE: 'peace',
    ANGER: 'anger',
};

export default function ShareToWorld({ data }) {
    const [mindMode, setMindMode] = useState(null);
    const popupRef = React.useRef(null);
    const buttonRef = React.useRef(null);

    const handleClickOutside = useCallback((event) => {
        if (popupRef.current && !popupRef.current.contains(event.target) &&
            buttonRef.current && !buttonRef.current.contains(event.target)) {
            setMindMode(null);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleShareClick = (mode) => {
        setMindMode(mode);
    };

    const shareUrl = data.share_url;

    return (
        <div className="relative w-full sm:w-4/5 md:w-full space-y-4">
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 ml:px-6 sm:px-6" ref={buttonRef}>
                <button
                    className={`px-6 py-3 rounded-full sm:w-auto text-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-300 ${
                        mindMode === ShareMode.PEACE 
                        ? 'bg-[#d20033] text-yellow-400' 
                        : 'bg-yellow-400 text-[#d20033]'
                    }`}
                    onClick={() => handleShareClick(ShareMode.PEACE)}
                >
                    <Heart /> <span>{data.advocate_with_peace}</span>
                </button>
                <button
                    className={`px-6 py-3 rounded-full text-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-300 ${
                        mindMode === ShareMode.ANGER 
                        ? 'bg-[#d20033] text-yellow-400' 
                        : 'bg-yellow-400 text-[#d20033]'
                    }`}
                    onClick={() => handleShareClick(ShareMode.ANGER)}
                >
                    <AlertTriangle /> <span>{data.advocate_with_anger}</span>
                </button>
            </div>
            {mindMode === null && (
                <p className="text-yellow-400 text-center text-ml mt-4 selectable-text">
                    {data.all_lives_matter_world_belief}
                </p>
            )}
            {mindMode && (
                <div ref={popupRef} className="mt-4">
                    <p className="text-white mb-4 text-center selectable-text ">
                        {mindMode === ShareMode.PEACE ? data.peaceful_mind : data.angry_mind}
                    </p>
                    <ShareTargets 
                        shareUrl={shareUrl} 
                        shareContent={(mindMode === ShareMode.PEACE ? data.advocacy_in_peace : data.advocacy_in_anger) + " " + data.common_hash_tags} 
                    />
                </div>
            )}
        </div>
    );
}