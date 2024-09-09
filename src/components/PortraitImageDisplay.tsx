import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const ExpandableImageIcon = ({ imageUrl, alt }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsExpanded(true)} 
        className="p-1 rounded-full hover:bg-gray-100"
      >
        <ImageIcon size={20} />
      </button>
      
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
          onClick={() => setIsExpanded(false)}
        >
          <div className="bg-white rounded-lg overflow-hidden" style={{ width: '300px', height: '450px' }}>
            <picture>
              <source srcSet={`${imageUrl}.avif`} type="image/avif" />
              <source srcSet={`${imageUrl}.webp`} type="image/webp" />
              <img src={`${imageUrl}.webp`} alt={alt} className="w-full h-full object-cover" />
            </picture>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpandableImageIcon;