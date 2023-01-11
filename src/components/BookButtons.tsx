import React from 'react';

const BookButton = ({ buyUrl, buyText, storeIcon }) => (
  <a
    href={buyUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center px-2 py-2 text-sm font-bold text-white bg-amber-800 rounded-md transition-colors duration-300 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
  >
    {storeIcon && (
      <img 
        src={`/icons/${storeIcon}`}
        alt={`${buyText} icon`} 
        className="w-5 h-5 mr-1"
      />
    )}
    {buyText}
  </a>
);

const BookButtons = ({ getBook }) => (
  <div className="flex flex-wrap items-center gap-2 mt-4">
    {getBook.map((bookGet, index) => (
      <BookButton
        key={index}
        buyUrl={bookGet.buy_url}
        buyText={bookGet.buy_text}
        storeIcon={bookGet.store_icon}
      />
    ))}
  </div>
);

export default BookButtons;