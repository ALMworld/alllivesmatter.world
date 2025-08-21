'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Music, Video, Youtube } from 'lucide-react';
import AllLivesMatterWorldSunflowPetal from '../../components/AllLivesMatterWorldSunflowPetal';
import AlmIcon from '../../components/AlmIcon';
import WillGallery from '../../components/WillGallery';
import { Locale } from '@/assets/i18config';
import { AboutData, CommonData, FAQList } from '@/data/data_types';
import KindKang from '@/components/KindKang';
import AlmIconPoster from '@/components/AlmIconPoster';

type AboutProps = {
    lang: Locale,
    aboutData: AboutData,
    faqData: FAQList[]
}

const About = ({ lang, aboutData, faqData }: AboutProps) => {
    // const aboutData = useAboutData(lang);
    // const faqData = aboutData.faq_list;

    return (
        <div className="bg-gray-900 text-white p-8">
            <div className='mx-auto max-w-4xl' >
                <h2 className="text-xl text-yellow-400 mb-4 selectable-text">
                    {aboutData.title}
                    <p className="text-sm text-[#d20033] mb-4 selectable-text">
                        {aboutData.sub_title}
                    </p>
                </h2>

                <WillGallery
                    aboutData={aboutData}
                />

                <div className="flex-col  mt-4 relative z-10 ">
                    <p className='text-white-300 selectable-text text-sm leading-none'>
                        {aboutData.video_spirit_disclaimer}
                    </p>
                    <div className='flex items-center'>

                        <span className="text-yellow-400 text-sm mr-2">
                            {aboutData.invitation_letter_text}:
                        </span>

                        <AlmIconPoster value={'mail'} posterData={aboutData.thoughtPosters[0]}
                            posterFooter={aboutData.posterFooter}
                            className="text-[#d20033] w-6 h-6"
                        />
                    </div>

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
                        aboutData={aboutData}
                    />
                ))}

            </div>
        </div>
    );
};

type FAQItemProps = {
    number: number,
    item: FAQList,
    aboutData: AboutData
}

const FAQItem = ({ number, item, aboutData }: FAQItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const getMediaIcon = (type: string) => {
        switch (type) {
            case 'music':
                return <Music className="inline-block align-text-bottom text-[#d20033]" size={20} />;
            case 'video':
                return <Youtube className="inline-block align-text-bottom text-[#d20033]" size={20} />;
            default:
                return null;
        }
    };

    return (
        <div className="mb-4">
            <div
                className="w-full flex items-start p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={(e) => {
                    // Only toggle if the click is on the main area, not on interactive elements
                    if (e.target === e.currentTarget || !((e.target as HTMLElement).closest('[data-interactive]'))) {
                        setIsOpen(!isOpen);
                    }
                }}
            >
                <div className="flex ">
                    {/* <span className="bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        {number}
                    </span> */}

                    <div className="flex-shrink-0 flex items-center justify-center mr-1">
                        <div className="bg-yellow-500 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-sm font-bold">{number}</span>
                        </div>

                        &nbsp;
                    </div>

                    {/* <span className="text-white font-semibold text-start flex items-center">
                        {item.media && getMediaIcon(item.media.type)}
                        <span>{item.question}</span>
                    </span> */}



                    <div className="flex-grow text-start">
                        <span className="text-white font-semibold">
                            {item.media && getMediaIcon(item.media.type)}{' '}
                            {item.question}
                        </span>
                    </div>
                </div>


                <div className="flex items-center ml-3">
                    {item.answer_image_list && item.answer_image_list.length > 0 && (
                        <div data-interactive onClick={(e) => e.stopPropagation()}>
                            <AlmIcon value={'image-up'} expand_image_list={item.answer_image_list}
                                posterThoughts={aboutData.thoughtPosters} posterFooter={aboutData.posterFooter} />
                        </div>
                    )}

                    {item.posterNumber && (
                        <div data-interactive onClick={(e) => e.stopPropagation()}>
                            <AlmIconPoster value={'image-up'} posterData={aboutData.thoughtPosters[item.posterNumber]}
                                posterFooter={aboutData.posterFooter} />
                        </div>
                    )}
                    &nbsp;
                    {isOpen ? <ChevronUp className="text-[#d20033]" /> : <ChevronDown className="text-white hover:text-[#d20033]" />}
                </div>

            </div>
            {isOpen && (
                <div className="mt-2 p-4 bg-gray-700 rounded-lg">
                    <ul className="list-none pl-0">
                        {item.answers.map((answer, index) => (
                            <React.Fragment key={index}>

                                {index === 0 && item.media && (
                                    <li className="selectable-text text-lg text-gray-300 relative pl-4 faq-list-item">
                                        {item.media.type === 'poem' && (
                                            <KindKang />
                                        )}
                                        {item.media?.type !== "poem" && item.media.url && (
                                            <AllLivesMatterWorldSunflowPetal
                                                // watch_interview_text={item.watch_tips}
                                                // watch_news_text={item.watch_tips}
                                                media={item.media}
                                            />
                                        )}
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