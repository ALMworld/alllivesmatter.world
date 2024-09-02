import React, { useState, useRef, useEffect } from 'react';
import { Music, Minimize2, X, PictureInPicture } from 'lucide-react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const PeaceMusicPlayer = () => {
    const [playerState, setPlayerState] = useState('hidden'); // 'hidden', 'expanded', 'shrunk'
    const playerRef = useRef(null);
    const iframeRef = useRef(null);

    const toggleExpand = () => {
        setPlayerState(playerState === 'expanded' ? 'hidden' : 'expanded');
    };

    const toggleShrink = () => {
        setPlayerState(playerState === 'shrunk' ? 'expanded' : 'shrunk');
    };


    if (playerState === 'hidden') {
        return (
            // <button
            //     onClick={toggleExpand}
            //     className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"
            // >
            //     <Music size={24} />

            // </button>
            <div
                className="fixed bottom-16 right-8 z-50 w-12 h-12 rounded-full bg-[#d20033] text-white flex items-center justify-center shadow-lg bg-opacity-80 flex items-center justify-center cursor-pointer"
                onClick={toggleExpand}             >
                <Music size={24} color="yellow" className="slow-float"  />
            </div>
        );
    }

    const playerStyle = { position: 'fixed', bottom: '3.6rem', right: '2rem', zIndex: 50 } as React.CSSProperties;

    const handleShrunkClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleShrink();
    };

    return (
        <div>
            <div
                className="flex items-start"
                style={playerStyle}
            >
                {playerState === 'expanded' && (
                    <div className="absolute top-0 left-0 transform -translate-x-full">
                        <div className="flex flex-col text-yellow-300 p-1 rounded-lg handle cursor-move">
                            <button onClick={toggleShrink} className="hover:bg-gray-700 bg-[#d20033] p-1 rounded transition-colors mb-1">
                                {/* <Minimize2 size={16} /> */}
                                <PictureInPicture size={16} />

                            </button>
                            <button onClick={toggleExpand} className="hover:bg-[#d20033] bg-[#d20033] p-1 rounded transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}
                <div
                    ref={playerRef}
                    className={`bg-white shadow-lg overflow-hidden ${playerState === 'shrunk' ? 'cursor-pointer rounded-full' : 'rounded'}`}
                >
                    <ResizableBox
                        width={playerState === 'shrunk' ? 98 : 300}
                        height={playerState === 'shrunk' ? 98 : 200}
                        minConstraints={[300, 169]}
                        maxConstraints={[800, 450]}
                        resizeHandles={['se']}
                        disableDragging={playerState === 'shrunk'}
                        className={playerState === 'shrunk' ? 'w-full h-full' : ''}
                    >
                        <div className="relative w-full h-full">
                            <iframe
                                ref={iframeRef}
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/PQuq4umpb3Q?si=5WbRVwYgKW2xU_Lq&loop=1&playlist=PQuq4umpb3Q"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;web-share"
                                allowFullScreen
                                referrerPolicy="strict-origin-when-cross-origin"
                            />
                            {playerState === 'shrunk' && (
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center cursor-pointer"
                                    onClick={handleShrunkClick}
                                >
                                    {/* <Music size={24} color="white" /> */}
                                </div>
                            )}
                        </div>
                    </ResizableBox>
                </div>
            </div>
        </div>
    );
};

export default PeaceMusicPlayer;