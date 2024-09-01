import React from 'react';

import  { LazyWorld } from '../components/LazyWorld';
import { useWhyData } from '../data/data_provider';
import BookButtons from '../components/BookButtons';



const Why = () => {
    const data = useWhyData();
    // if (!emphasis || !text.includes(emphasis)) return text;
    const parts = data.highlight.question.split(data.highlight.question_emphasis);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8" id="theory-dashboard">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                    <div className="w-full md:w-1/2 mb-8 md:mb-0">
                        <h1 className="text-2xl sm:text-3xl mb-4 selectable-text">
                            {data.books[0].author}
                        </h1>
                        <blockquote className="border-l-4 border-gray-300 pl-4  mb-4 ">
                            <span className='italic text-sm sm:text-sm selectable-text'>
                                {data.highlight.situation}
                            </span>

                            <br />

                            {parts.map((part, index) => (
                                <React.Fragment key={index}>
                                    <span className="selectable-text">{part}</span>
                                    {index === 0 && parts.length > 1 && (
                                        <span className="text-yellow-400 font-bold selectable-text">{data.highlight.question_emphasis}</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </blockquote>
                    </div>
                    <div className="w-full md:w-1/2 w-[300px] h-[300px] flex items-center justify-center" id="globe-container">
                        <LazyWorld />
                    </div>
                </div>


                <div className="space-y-4">
                    {data.books.map((book, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-1">
                            <div className="bg-gray-800 col-span-1 md:col-span-3 p-6 rounded-lg flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-2xl font-bold text-yellow-400 selectable-text">
                                            <a href={book.book_link} target="_blank" rel="noopener noreferrer selectable-text">
                                                <span className='selectable-text'>
                                                    {book.title}
                                                </span>
                                            </a>
                                        </span>
                                        <span className="text-xl text-[#FFA823]">
                                            <a href={book.author_link} target="_blank" rel="noopener noreferrer ">
                                                <span className='selectable-text'>
                                                    {book.author}
                                                </span>
                                            </a>
                                        </span>
                                    </div>
                                    <p className="mb-4 text-sm selectable-text">
                                        {book.intro}
                                    </p>
                                </div>
                                <div className="mt-auto">
                                    <BookButtons getBook={book.get_book} />
                                </div>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg flex flex-col justify-between col-span-1 md:col-span-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-yellow-600 selectable-text">{book.topic1.headline}</h3>
                                    <p className="text-sm selectable-text">{book.topic1.content}</p>
                                </div>
                                <div className='mt-2'>
                                    <h3 className="text-lg font-semibold text-yellow-600 selectable-text">{book.topic2.headline}</h3>
                                    <p className="text-sm selectable-text">{book.topic2.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Why;