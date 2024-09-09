import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAboutData } from '../data/data_provider';
import FightWarWithHumanity from '../components/FightWarWithHumanity';
import AlmIcon from '../components/AlmIcon';

const About = () => {
    const aboutData = useAboutData();
    const faqData = aboutData.faq_list;

    return (
        <div className="w-full bg-gray-900 text-white p-8">
            <div className='mx-auto max-w-4xl' >
                <h2 className="text-xl text-yellow-400 mb-4 selectable-text">
                    {aboutData.title}
                </h2>

                <FightWarWithHumanity watch_interview_text={aboutData.watch_interview_text} watch_news_text={aboutData.watch_news_text} disclaimer={aboutData.video_spirit_disclaimer} />

                <div className="flex items-center">
                    <span className="text-yellow-400 text-sm mr-2">
                        {aboutData.invitation_letter_text}:
                    </span>
                    <AlmIcon
                        value={'mail'}
                        expand_image_list={[aboutData.invitation_letter]}
                        className="text-[#d20033] hover:text-yellow-400 "
                    />
                </div>
{/* 
                <div>
                    <span>
                        <span className="items-center text-yellow-400 text-sm ">
                            {aboutData.invitation_letter_text}:
                        </span>
                        <AlmIcon value={'mail'} expand_image_list={[aboutData.invitation_letter]} className="pt-1 text-yellow-400 text-[#d20033]" />
                    </span>
                </div> */}

                {aboutData.sections.map((section, index) => (
                    <p key={index} className="text-gray-300 mb-4 selectable-text" dangerouslySetInnerHTML={{ __html: section }} />
                ))}

                {faqData.map((item, index) => (
                    <FAQItem
                        key={index}
                        number={index + 1}
                        item={item}
                    />
                ))}

            </div>
        </div>
    );
};

const FAQItem = ({ number, item }) => {
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
                    <span className="flex-grow text-white font-semibold text-start">{item.question}</span>
                </div>

                <div className="flex items-center ml-2">
                    {isOpen ? <ChevronUp className="text-[#d20033]" /> : <ChevronDown className="text-white hover:text-[#d20033]" />}
                    &nbsp;
                    {item.answer_image_list && item.answer_image_list.length > 0 && (
                        <AlmIcon value={'image-up'} expand_image_list={item.answer_image_list} />
                    )}
                </div>

            </button>
            {isOpen && (
                <div className="mt-2 p-4 bg-gray-700 rounded-lg">
                    <ul className="list-none pl-0">
                        {item.answers.map((item, index) => (
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