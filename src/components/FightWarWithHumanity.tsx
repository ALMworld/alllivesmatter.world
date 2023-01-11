import React from 'react';

function FightWarWithHumanity({ watch_interview_text, watch_news_text, disclaimer }: { watch_interview_text: string, watch_news_text: string, disclaimer: string }) {
    return (
        <div className="flex  items-center w-full mb-6">
            <div className="w-full sm:w-[400px] md:w-[500px] lg:w-[560px]">
                <iframe
                    className="w-full aspect-video"
                    src="https://www.youtube-nocookie.com/embed/L07fMoafVh4?si=6AhpvFdH3h84Zx-6"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>

                <span className='text-red-300 selectable-text '>{watch_interview_text}&nbsp;</span>

                <span>
                        {watch_news_text}
                    <a target='new' className='inline_ref' href="https://web.archive.org/web/20240817021327/https://www.google.com/search?q=Trump+war&sca_esv=e02c8f39a8b85279&sca_upv=1&sxsrf=ADLYWIJaEuHA9_5gVAAAGxhr2iB3aS0kog%3A1723860058037&source=lnt&tbs=cdr%3A1%2Ccd_min%3A5%2F9%2F2023%2Ccd_max%3A5%2F16%2F2023&tbm=">
                    &nbsp;»
                    </a>
                </span>
                <br />
                <p className='text-white-300 selectable-text text-sm leading-none' >{disclaimer}</p>
            </div>
        </div>
    );
}

export default FightWarWithHumanity;