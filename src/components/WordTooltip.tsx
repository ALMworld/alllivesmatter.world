import React, { useState } from 'react';
import { Info } from 'lucide-react';

const WordTooltip = ({ text, word, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const parts = text.split(new RegExp(`(${word})`, 'gi'));

  return (
    <>
      {parts.map((part, index) => {
        if (part.toLowerCase() === word.toLowerCase()) {
          return (
            <span
              key={index}
              className="relative inline-block"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {part}
              <Info className="inline-block ml-1 absolute bottom-3 text-gray-400 cursor-help" size={16} />
              {showTooltip && (
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-md whitespace-nowrap z-10"
                dangerouslySetInnerHTML={{ __html: tooltip }}
                />
              )}
            </span>
          );
        }
        return part;
      })}
    </>
  );
};

export default WordTooltip;