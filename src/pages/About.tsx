import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAboutData } from '../data/data_provider';
import FightWarWithHumanity from '../components/FightWarWithHumanity';

const About = () => {
    const aboutData = useAboutData();
    const faqData = aboutData.faq_list;

    return (
        <div className="w-full bg-gray-900 text-white p-8 rounded-xl">
            <div className='mx-auto max-w-4xl' >
                <h2 className="text-xl text-yellow-400 mb-4 selectable-text">
                    {aboutData.title}
                </h2>

                <FightWarWithHumanity watch_interview_text={aboutData.watch_interview_text} watch_news_text={aboutData.watch_news_text} disclaimer={aboutData.video_spirit_disclaimer} />

                {aboutData.sections.map((section, index) => (
                    <p className="text-gray-300 mb-4 selectable-text" dangerouslySetInnerHTML={{ __html: section }} />
                ))}

                {faqData.map((item, index) => (
                    <FAQItem
                        key={index}
                        number={index + 1}
                        question={item.question}
                        answers={item.answers}
                    />
                ))}

            </div>
        </div>
    );
};

const FAQItem = ({ number, question, answers }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4">
            <button
                className="w-full flex items-start p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex ">
                    {/* <span className="bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        {number}
                    </span> */}
                    <div className="flex-shrink-0 bg-yellow-500 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center mr-4">
                        <span className="text-sm font-bold">{number}</span>
                    </div>

                    <span className="flex-grow text-white font-semibold text-start">{question}</span>

                </div>
                {isOpen ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
            </button>
            {isOpen && (
                <div className="mt-2 p-4 bg-gray-700 rounded-lg">
                    <ul className="list-none pl-0">
                        {answers.map((item, index) => (
                            <li
                                key={index}
                                className="selectable-text text-lg text-gray-300 relative pl-4 mb-2 faq-list-item"
                                dangerouslySetInnerHTML={{ __html: item }}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default About;