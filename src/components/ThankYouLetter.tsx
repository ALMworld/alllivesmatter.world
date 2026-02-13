
import React from 'react';

export interface ThanksLetterDatum {
  letterToUser: string;
  letterTo: string;
  content_paragraphs: Array<string[]>;
  special?: boolean;
}

interface ThankYouLetterProps {
  letter: ThanksLetterDatum;
  signature: string[];
  className?: string;
  scale: number;
  textScale?: number;
}

const ThankYouLetter: React.FC<ThankYouLetterProps> = ({ letter, signature, className, scale }) => {
  const viewBoxWidth = 600;
  const viewBoxHeight = 800;
  // const startY = viewBoxHeight * 0.28;
  const startY = viewBoxHeight * (letter.special ? 0.2 : 0.28)
  // const startXPct = '13.6%';
  const startXPct = letter.special ? '33%' : '13.6%';
  const lineHeight = viewBoxHeight * 0.025; // Controls space between lines
  const paragraphSpacing = viewBoxHeight * 0.02; // Controls extra space between paragraphs

  // This variable will track the vertical position for each line of text.
  let currentY = startY;

  return (
    <div
      className={`w-full h-full bg-cover bg-center mx-auto ${className}`}
      style={{ backgroundImage: letter.special ? "url('/thanks_letter_bg_special.webp')" : "url('/thanks_letter_bg.webp')", transform: `scale(${scale})` }}
    >
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ userSelect: 'text' }}
      >
        {/* Top Label - "Dear..." */}
        <text
          x={startXPct}
          y={startY}
          textAnchor="start"
          fontFamily="sans-serif"
          fontSize="20"
          fill="black"
          className="font-medium"
          style={{ userSelect: 'text' }}
        >
          {letter.letterTo}
        </text>

        {/* Content Paragraphs and Lines */}
        {letter.content_paragraphs.flatMap((paragraph, pIndex) => {
          // Increment Y for the start of a new paragraph (except the first one)
          console.log(paragraph, pIndex);
          if (pIndex > 0) {
            currentY += paragraphSpacing;
          }

          // Map over the lines in the current paragraph
          return paragraph.map((line, lIndex) => {
            // Increment Y position for each line
            currentY += lineHeight;

            return (
              <text
                key={`${pIndex}-${lIndex}`}
                x={startXPct}
                y={currentY}
                textAnchor="start"
                fontFamily="sans-serif"
                fontSize="17"
                fill="black"
                style={{ userSelect: 'text' }}
              >
                {line}
              </text>
            );
          });
        })}

        {/* Signature - Bottom right */}
        {!letter.special && signature.map((line, index) => (
          <text
            key={index}
            x="88%"
            y={viewBoxHeight * 0.8 + index * (viewBoxHeight * 0.03)}
            textAnchor="end"
            fontFamily="serif"
            fontSize="18"
            fill="black"
            style={{ userSelect: 'text' }}
          >
            {line}
          </text>
        ))}

      </svg>
    </div>
  );
};

export default ThankYouLetter;