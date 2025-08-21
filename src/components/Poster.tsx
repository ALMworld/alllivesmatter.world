import React from 'react';

type PosterProps = {
  title: string;
  titleSegments: string[];
  paragraphs: string[];
  footerMain: string;
  footerSubtitle: string;
}

const Poster = ({ title, titleSegments, paragraphs, footerMain, footerSubtitle }: PosterProps) => {
  return (
    <div className="bg-black">
      <div
        className="border-4 border-yellow-500 p-2 sm:p-4 bg-black max-w-[480px] mx-auto font-sans text-white flex flex-col transition-all duration-300"
        style={{
          minHeight: '400px',
          height: 'clamp(400px, 85vh, 645px)'
        }}
      >
        {/* Header Section */}
        <div className="flex items-center mb-2 h-10 sm:h-12 flex-shrink-0">
          <img
            src="/alm.svg"
            alt="Duality"
            width="32"
            height="32"
            className="mr-2 sm:w-10 sm:h-10"
          />


          <div className="px-2 flex-1 flex items-center justify-center">

            {title.length > 0 && (
              <h1
                className="w-full text-xl text-medium flex items-center justify-center bg-red-500 h-10 sm:h-12 text-yellow-300 text-xs"
                style={{ userSelect: 'text' }}>
                {title}
              </h1>)
            }

            {titleSegments && titleSegments.length > 0 && (
              <div className='bg-red-500 text-center flex flex-col justify-center w-full h-10 sm:h-12' style={{ userSelect: 'text' }}>
                <div className="text-black text-[8px]">
                  {titleSegments[0]}
                </div>
                {titleSegments.slice(1).map((segment, index) => (
                  <div key={index} className="font-medium text-yellow-300 text-xs">
                    {segment}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow overflow-auto text-xs sm:text-sm leading-tight mb-2" style={{ userSelect: 'text' }}>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-2 leading-tight text-justify">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Footer Section */}
        <div className="bg-red-500 px-2 py-1 text-center h-12 sm:h-16 flex-shrink-0" style={{ userSelect: 'text' }}>
          <div className="text-yellow-300 font-medium text-xs sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
            AllLivesMatter.World
          </div>
          <div className="text-black text-[10px] sm:text-xs whitespace-nowrap overflow-hidden text-ellipsis">
            {footerMain}
          </div>
          <div className="text-black text-[10px] sm:text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            {footerSubtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poster;