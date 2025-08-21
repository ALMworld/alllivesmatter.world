'use client'

import { Locale } from '@/assets/i18config';
import { AdvocacyData, CommonData } from '@/data/data_types';
import { useState } from 'react';
import AdvocateCard from '../../components/AdvocateCard';
import AdvocateModalCard from '../../components/AdvocateModalCard';
import ShareToWorld from '../../components/ShareToWorld';


export type AdvocacyProps = {
    lang: Locale,
    commonData: CommonData,
    data: AdvocacyData

}

const Advocacy = ({ lang, commonData, data }: AdvocacyProps) => {
    // const commonData = useCommonData(lang);
    // const data = useAdvocacyData(lang);

    const [activePrincipleIndex, setActivePrincipleIndex] = useState<number | null>(null);

    const openPrincipleModal = (modalId: number|null) => {
        setActivePrincipleIndex(modalId);
    };

    const closeAdvocateModal = () => {
        setActivePrincipleIndex(null);
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-6xl font-bold mb-4 selectable-text">
                    <span className="text-yellow-400 selectable-text">{data.slogan_headline} 
                        <span className='text-[#d20033] text-xl2 selectable-text'>.</span>
                        <span className='text-sm selectable-text'>&nbsp;{data.slogan_headline_suffix}</span>
                    </span>
                    <p className="text-sm py-6 selectable-text">
                        {data.slogan}
                    </p>
                    <p className="text-4xl font-bold selectable-text His-color">
                        {data.mantra}
                    </p>
                </h1>

                <ShareToWorld data={commonData} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    {data.mantra_details.map((mantra, index) => (
                        <AdvocateCard
                            key={index}
                            mantra={mantra}
                            isOpen={activePrincipleIndex === index}
                            openModal={() => openPrincipleModal(index)}
                            closeModal={closeAdvocateModal}
                        >
                            <AdvocateModalCard key={index} mantra={mantra} onClose={closeAdvocateModal} />
                        </AdvocateCard>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Advocacy;
