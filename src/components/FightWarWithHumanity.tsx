import { BarChart, Film, Loader2, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AlmIcon from './AlmIcon';

function FightWarWithHumanity({ watch_interview_text, watch_news_text, disclaimer }: { watch_interview_text: string, watch_news_text: string, disclaimer: string }) {
    const [isLoading, setIsLoading] = useState(true);

    const [iframeOpacity, setIframeOpacity] = useState(0);
    useEffect(() => {
        if (!isLoading) {
            // Delay the iframe fade-in to allow the loader to fade out first
            const timer = setTimeout(() => setIframeOpacity(1), 250);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    return (
        <div className="flex items-center w-full mb-6">
            <div className="w-full sm:w-[400px] md:w-[500px] lg:w-[560px]">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                    <div className={`absolute inset-0 bg-[#cb0001] rounded-sm transition-all duration-500 ease-in-out ${isLoading ? 'bg-opacity-10' : 'bg-opacity-10'}`}>
                        <div className={`w-full h-full flex items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
                            <BarChart className="w-16 h-16 text-white animate-pulse" />
                        </div>
                    </div>
                    <iframe
                        className="absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out"
                        style={{ opacity: iframeOpacity }}
                        src="https://www.youtube-nocookie.com/embed/L07fMoafVh4?si=6AhpvFdH3h84Zx-6"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        onLoad={() => setIsLoading(false)}
                    ></iframe>
                </div>
                <span className='text-red-300 selectable-text'>{watch_interview_text}&nbsp;</span>
                <span>
                    {watch_news_text}
                    <a target='new' className='inline_ref' href="https://web.archive.org/web/20240817021327/https://www.google.com/search?q=Trump+war&sca_esv=e02c8f39a8b85279&sca_upv=1&sxsrf=ADLYWIJaEuHA9_5gVAAAGxhr2iB3aS0kog%3A1723860058037&source=lnt&tbs=cdr%3A1%2Ccd_min%3A5%2F9%2F2023%2Ccd_max%3A5%2F16%2F2023&tbm=">
                        &nbsp;»
                    </a>
                </span>
                <br />
                <p className='text-white-300 selectable-text text-sm leading-none'>{disclaimer}</p>
            </div>
        </div >
    );
}

export default FightWarWithHumanity;