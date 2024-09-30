import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Music, Video, Youtube } from 'lucide-react';
import { useAboutData } from '../data/data_provider';
import AllLivesMatterWorldSunflowPetal from '../components/AllLivesMatterWorldSunflowPetal';
import AlmIcon from '../components/AlmIcon';
import WillGallery from '../components/WillGallery';

const About = () => {
    const aboutData = useAboutData();
    const faqData = aboutData.faq_list;

    return (
        <div className="w-full bg-gray-900 text-white p-8">
            <div className='mx-auto max-w-4xl' >
                <h2 className="text-xl text-yellow-400 mb-4 selectable-text">
                    {aboutData.title}
                    <p className="text-sm text-[#d20033] mb-4 selectable-text">
                        {aboutData.sub_title}
                    </p>
                </h2>

                <WillGallery
                    text_wills_list={aboutData.His_will_and_our_good_free_will_text}
                    media_wills_list={aboutData.His_will_and_our_good_free_will_media}
                />

                <div className="flex items-center mt-4 relative z-10 ">
                    <span className="text-yellow-400 text-sm mr-2">
                        {aboutData.invitation_letter_text}:
                    </span>

                    <AlmIcon
                        value={'mail'}
                        expand_image_list={aboutData.invitation_letter}
                        className="text-[#d20033]"
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

                    <div className="flex-shrink-0 flex items-center justify-center mr-1">
                        <div className=' bg-yellow-500 text-gray-900 rounded-full w-8 h-8 '>
                            <span className="text-sm font-bold">{number}</span>
                        </div>

                        &nbsp;

                        <div className='flex items-center'>
                            {/* <span className="text-sm font-bold">{number}</span> */}
                            {item.media && (
                                <div className="flex items-center">
                                    {/* <Music className="text-[#d20033]" size={20} /> */}
                                    {/* <Video className="text-white mr-2" size={20} /> */}
                                    {/* <Youtube className="text-[#d20033] mr-2" size={20} /> */}
                                    {item.media.type === 'music' && (
                                        <Music className="text-[#d20033] mr-2 top-1/2 " size={20} />
                                    )}
                                    {item.media.type === 'video' && (
                                        // <Video className="text-[#d20033] mr-2" size={20} />
                                        <Youtube className="text-[#d20033] mr-2 bottom-1/2 " size={20} />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>



                    <span className="flex-grow text-white font-semibold text-start">{item.question}</span>
                </div>

                <div className="flex items-center ml-3">
                    {item.answer_image_list && item.answer_image_list.length > 0 && (
                        <AlmIcon value={'image-up'} expand_image_list={item.answer_image_list} />
                    )}
                    &nbsp;
                    {isOpen ? <ChevronUp className="text-[#d20033]" /> : <ChevronDown className="text-white hover:text-[#d20033]" />}
                </div>

            </button>
            {isOpen && (
                <div className="mt-2 p-4 bg-gray-700 rounded-lg">
                    <ul className="list-none pl-0">
                        {item.answers.map((answer, index) => (
                            <React.Fragment key={index}>

                                {index === 0 && item.media && item.media.url && (
                                    <li className="selectable-text text-lg text-gray-300 relative pl-4 faq-list-item">
                                        <AllLivesMatterWorldSunflowPetal
                                            // watch_interview_text={item.watch_tips}
                                            // watch_news_text={item.watch_tips}
                                            // disclaimer={item.sunflower_petals} 
                                            media={item.media}
                                        />
                                    </li>
                                )}
                                <li
                                    className="selectable-text text-lg text-gray-300 relative pl-4 mb-2 faq-list-item"
                                    dangerouslySetInnerHTML={{ __html: answer }}
                                />
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default About;