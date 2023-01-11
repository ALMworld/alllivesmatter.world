import React from 'react';

const HighlightText = ({ situation, question, questionEmphasis }) => {
  const highlightEmphasis = (text, emphasis) => {
    if (!emphasis) return text;
    
    const parts = text.split(emphasis);
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span className="text-yellow-400 font-bold">{emphasis}</span>
            )}
            {part}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-300">{situation}</p>
      <p className="text-white">
        {highlightEmphasis(question, questionEmphasis)}
      </p>
    </div>
  );
};

export default HighlightText;