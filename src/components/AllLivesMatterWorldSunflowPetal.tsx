import { BarChart, Film, Loader2, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AlmIcon from './AlmIcon';

function AllLivesMatterWorldSunflowPetal({ media }) {
    // watch_interview_text, watch_news_text, disclaimer
    // { watch_interview_text: string, watch_news_text: string, disclaimer: string }
    const [isLoading, setIsLoading] = useState(true);
    console.log('item', media);
    console.log('item.url', media.url);

    const [iframeOpacity, setIframeOpacity] = useState(0);
    useEffect(() => {
        if (!isLoading) {
            // Delay the iframe fade-in to allow the loader to fade out first
            const timer = setTimeout(() => setIframeOpacity(1), 250);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    return (
        <div className="flex items-center w-full mb-3">
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
                        src={media.url}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        onLoad={() => setIsLoading(false)}
                    ></iframe>
                </div>
                {/* <span className='text-red-300 selectable-text'>{item.watch_interview_text}&nbsp;</span> */}
                <span className='text-red-300 selectable-text '>{media.sunflower_petal}&nbsp;</span>
                <br />
                <span>
                    <span className='His-color'>  {media.watch_tips} </span>
                    {media.unsafe_media_html && (
                                                            
                                                            <>
                                                            <span dangerouslySetInnerHTML={{ __html: media.unsafe_media_html }} />
                                                            </>
         
                    )}
                </span>
                {/* <p className='text-white-300 selectable-text text-sm leading-none'>{disclaimer}</p> */}
            </div>
        </div >
    );
}

export default AllLivesMatterWorldSunflowPetal;