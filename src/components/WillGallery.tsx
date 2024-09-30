import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Slider from 'react-slick';
import { HisWillAndOurGoodFreeWill } from '../data/data_types';
import { useGallery } from '../data/gallery_provider';
import { UnitFile } from '../data/gallery_types';

// Note: You need to import the CSS for react-slick and its default theme
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { createPortal } from 'react-dom';
import ImageGalleryModal from './ImageGalleryModal';


type DeliveryState = 'unknown' | 'delivered';

interface WillWithState extends HisWillAndOurGoodFreeWill {
  deliveryState: DeliveryState;
  unitFile: UnitFile | null;
}

interface WillGalleryProps {
  text_wills_list: HisWillAndOurGoodFreeWill[];
  media_wills_list: HisWillAndOurGoodFreeWill[];
}

const WillGallery: React.FC<WillGalleryProps> = ({ text_wills_list, media_wills_list }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { loadingState, error, getImageFiles } = useGallery();
  console.log('text_wills_list', text_wills_list);

  const thanksLettersWithState: WillWithState[] = useMemo(() => {
    const imageKeys = text_wills_list.map(will => will.free_will);
    const unitFiles = loadingState === 'loaded' ? getImageFiles(imageKeys) : [];
    return text_wills_list.map((will, index) => ({
      ...will,
      deliveryState: Math.random() < 0.5 ? 'unknown' : 'delivered',
      unitFile: unitFiles[index] || null
    }));
  }, [text_wills_list, loadingState, getImageFiles]);

  const thanksLettersImages: UnitFile[] = useMemo(() => {
    const imageKeys = text_wills_list.map(will => will.free_will);
    const unitFiles = loadingState === 'loaded' ? getImageFiles(imageKeys) : [];
    return text_wills_list.map((will, index) =>
      unitFiles[index]
    );
  }, [text_wills_list, loadingState, getImageFiles]);


  const images = useMemo(() => {
    // If selectedImage is just a single image object, we wrap it in an array
    return selectedImage ? [selectedImage] : [];
  }, [selectedImage]);

  const openImage = (index: number) => {
    setSelectedImage(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
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

  if (loadingState === 'loading') {
    return <div>Loading...</div>;
  }

  if (loadingState === 'error') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div>
        <div className="bg-[#d20033] rounded-t-lg mt-2 flex items-center" style={{ minHeight: '150px' }}>
          <Slider {...thanksLetterSliderSettings} className="w-full">
            {thanksLettersWithState.map((will, index) => (
              <div key={index} className="px-2">
                <div className="h-[120px] rounded-lg cursor-pointer relative">
                  {will.unitFile && (
                    <>
                      <img
                        src={will.unitFile.file_uri}
                        alt={will.will_summary}
                        className="w-full h-[100px] object-contain hover:opacity-80 transition-opacity"
                        onClick={() => openImage(index)}
                      />
                      <div className="absolute bottom-[-1] left-0 right-0 text-center text-sm text-white py-1 text-yellow-300">
                        {will.from}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div >
          <Slider {...sliderSettings} className="bg-[#d20033] rounded-b-lg  ">
            {media_wills_list.map((will, index) => {
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

      {selectedImage != null && <ImageGalleryModal images={thanksLettersImages} isOpen={openImage} onClose={closeImage} initialIndex={selectedImage} />}


    </div>
  );
};

export default WillGallery;