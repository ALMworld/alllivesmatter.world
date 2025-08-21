import React, { useMemo, useState } from 'react';
import { AlertTriangle, Heart } from 'lucide-react';
import Slider from 'react-slick';
import { AboutData, ThanksLetterDatum } from '../data/data_types';
import ThankYouLetter from './ThankYouLetter';

// Note: You need to import the CSS for react-slick and its default theme
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ThankYouLetterModal from './ThankYouLetterModal';
import { useCommonData } from '../data/data_provider';

interface WillGalleryProps {
  aboutData: AboutData
}

const WillGallery: React.FC<WillGalleryProps> = ({ aboutData }) => {

  const modifiedThanksLetterData: ThanksLetterDatum[] = aboutData.thanks_letter_data.map((letter) => {
    if (letter.special) {
      return letter;
    }
    return {
      ...letter,
      content_paragraphs: [
        ...letter.content_paragraphs.slice(0, 1),   // Gets the first paragraph
        aboutData.thanks_letter_almworld_intro,       // CORRECT: Inserts the intro paragraph array as one element
        ...letter.content_paragraphs.slice(1)     // Gets all remaining paragraphs
      ]
    };
  });

  const signature = aboutData.thanks_letter_signature;
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);

  const openLetter = (index: number) => {
    setSelectedLetter(index);
  };

  const closeLetter = () => {
    setSelectedLetter(null);
  };

  const thanksLetterSliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
        }
      }
    ]
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const renderLetterGallery = () => {
    return (
      <Slider {...thanksLetterSliderSettings} className="w-full h-[260px]">
        {modifiedThanksLetterData.map((letter, index) => (
          <div key={index} className="px-2">
            <div
              className="p-8 rounded-lg cursor-pointer flex flex-col items-center"
              onClick={() => openLetter(index)}
            >
              <div className='w-[120px] h-[160px]'>
                <div
                  className="rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                  style={{
                    transform: 'scale(1)',
                    transformOrigin: 'center'
                  }}
                >
                  <ThankYouLetter
                    scale={1}
                    letter={letter}
                    signature={signature}
                  />
                </div>
              </div>
              <div className="text-center text-sm text-yellow-300 mt-2">
                {letter.letterToUser}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div>
        <div className="bg-[#d20033] rounded-t-lg mt-2 flex items-center" style={{ minHeight: '150px' }}>
          {renderLetterGallery()}
        </div>

        <div>
          <Slider {...sliderSettings} className="bg-[#d20033] rounded-b-lg">
            {aboutData.His_will_and_our_good_free_will_media.map((will, index) => {
              const videoId = will.free_will
              return (
                <div key={index} className="px-2">
                  <div className="aspect-video overflow-hidden rounded-lg">
                    {videoId ? (
                      <>
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={`YouTube video player ${index + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Invalid video URL</span>
                      </div>
                    )}
                  </div>

                  <div className="min-h-[60px] p-2 rounded">
                    <p className="text-yellow-300 text-sm break-words">
                      {will.will_summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>

      {selectedLetter !== null && (
        <ThankYouLetterModal
          letters={modifiedThanksLetterData}
          signature={signature}
          isOpen={selectedLetter !== null}
          onClose={closeLetter}
          initialIndex={selectedLetter}
        />
      )}
    </div>
  );
};

export default WillGallery;