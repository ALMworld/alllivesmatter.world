import React from 'react';
import { GetBook } from '../data/data_types';

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

const BookButtons: React.FC<{ getBook: GetBook[] }> = ({ getBook }) => (
  <div className="flex flex-wrap items-center gap-2 mt-4">
    {getBook.map((book_get, index) => (
      <BookButton
        key={index}
        buyUrl={book_get.buy_url}
        buyText={book_get.buy_text}
        storeIcon={book_get.store_icon}
      />
    ))}
  </div>
);

export default BookButtons;