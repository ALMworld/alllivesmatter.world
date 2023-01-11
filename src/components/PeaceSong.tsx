import React from 'react';

function AlmPeaceSong() {
    return (
        <div className="flex  items-center w-full">
            <div className="w-full sm:w-[400px] md:w-[500px] lg:w-[560px]">
                <iframe
                    className="w-full aspect-video"
                    src="https://www.youtube-nocookie.com/embed/PQuq4umpb3Q?si=5WbRVwYgKW2xU_Lq"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            </div>
        </div>
    );
}

export default AlmPeaceSong;