import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Heart, Loader2, X } from 'lucide-react';
import Slider from 'react-slick';
import { AboutData, HisWillAndOurGoodFreeWill } from '../data/data_types';
import { useGallery } from '../data/gallery_provider';
import { UnitFile } from '../data/gallery_types';

// Note: You need to import the CSS for react-slick and its default theme
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageGalleryModal from './ImageGalleryModal';


type DeliveryState = 'unknown' | 'delivered';

interface WillWithState extends HisWillAndOurGoodFreeWill {
  deliveryState: DeliveryState;
  unitFile: UnitFile | null;
}

interface WillGalleryProps {
  // text_wills_list: HisWillAndOurGoodFreeWill[];
  // media_wills_list: HisWillAndOurGoodFreeWill[];
  aboutData: AboutData
}

const WillGallery: React.FC<WillGalleryProps> = ({ aboutData }) => {
  // text_wills_list, media_wills_list
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { loadingState, error, getImageFiles } = useGallery();
  // console.log('text_wills_list', text_wills_list);

  const thanksLettersWithState: WillWithState[] = useMemo(() => {
    const imageKeys = aboutData.His_will_and_our_good_free_will_text.map(will => will.free_will);
    const unitFiles = loadingState === 'loaded' ? getImageFiles(imageKeys) : [];
    return aboutData.His_will_and_our_good_free_will_text.map((will, index) => ({
      ...will,
      deliveryState: Math.random() < 0.5 ? 'unknown' : 'delivered',
      unitFile: unitFiles[index] || null
    }));
  }, [aboutData, loadingState, getImageFiles]);

  const thanksLettersImages: UnitFile[] = useMemo(() => {
    const imageKeys = aboutData.His_will_and_our_good_free_will_media.map(will => will.free_will);
    const unitFiles = loadingState === 'loaded' ? getImageFiles(imageKeys) : [];
    return aboutData.His_will_and_our_good_free_will_media.map((will, index) =>
      unitFiles[index]
    );
  }, [aboutData, loadingState, getImageFiles]);


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

  const renderImageGallery = () => {
    if (loadingState === 'loading') {
      return (
        <div className="w-full h-[150px] flex flex-col items-center justify-center bg-[#d20033] rounded-lg">
          <div className="relative">
            <Heart className="w-12 h-12 text-yellow-400" />
            <Heart className="absolute inset-0 w-12 h-12 text-yellow-300 animate-ping" />
          </div>
          <p className="text-lg font-medium text-yellow-300 mt-4">
            {aboutData.will_success_representation_hint}
          </p>
        </div>
      );
    }

    if (loadingState === 'error') {
      return (
        <div className="w-full h-[150px] flex flex-col items-center justify-center bg-[#d20033] rounded-lg">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
          <p className="text-lg font-medium text-yellow-400">
            {aboutData.will_fail_representation_hint}
          </p>
        </div>
      );
    }

    return (
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
    );
  };



  return (
    <div className="w-full max-w-4xl mx-auto">
      <div>
        <div className="bg-[#d20033] rounded-t-lg mt-2 flex items-center" style={{ minHeight: '150px' }}>
          {renderImageGallery()}
        </div>

        <div >
          <Slider {...sliderSettings} className="bg-[#d20033] rounded-b-lg  ">
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

      {selectedImage != null && <ImageGalleryModal images={thanksLettersImages} isOpen={openImage} onClose={closeImage} initialIndex={selectedImage} />}


    </div>
  );
};

export default WillGallery;