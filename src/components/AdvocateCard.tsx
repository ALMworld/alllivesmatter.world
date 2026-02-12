import React, { useState } from 'react';
import AlmIconUnit from './AlmIconUnit';
import DukiTermsCard from './DukiTermsCard';
import AdvocacyPoster from './AdvocacyPoster';

const AdvocateCard = ({ mantra, mantraIndex, allMantras, headline, commonData, isOpen, openModal, closeModal, children }) => {
    const dukiCard = mantra.icon === 'money'
    const [showDukiTerms, setShowDukiTerms] = useState(false);
    const [showPosterCard, setShowPosterCard] = useState(false);

    return (
        <>
            <div className="bg-gray-800 p-6 rounded-lg relative">
                {
                    dukiCard && (
                        <div className="absolute top-6 right-2 flex items-center">
                            <span className="text-yellow-400 text-sm mr-4 cursor-help" onClick={() =>
                                setShowDukiTerms(!showDukiTerms)
                            }>DUKI ? </span>
                            <span className="relative">
                                {showDukiTerms && (
                                    <div className="absolute right-0 top-full h-full mb-2 p-2 text-sm text-white bg-gray-700 rounded-md shadow-lg z-10">
                                        {mantra.tooltip}
                                        <div className="absolute w-full right-0 mb-2 z-20">
                                            <DukiTermsCard
                                                commonData={commonData}
                                                onClose={() => setShowDukiTerms(false)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </span>
                        </div>
                    )
                }

                <div className="flex justify-center mb-4">
                    <div
                        className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center text-black cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300"
                        onClick={() => setShowPosterCard(true)}
                        title="Click to view poster"
                    >
                        <AlmIconUnit value={mantra.icon} size={32} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 selectable-text" dangerouslySetInnerHTML={{ __html: mantra.content }} />
                <p className="text-gray-400 selectable-text">{mantra.description}</p>
                <button
                    className="mt-4 border border-yellow-400 text-yellow-400 px-4 py-2 rounded hover:bg-yellow-400 hover:text-black transition duration-300"
                    onClick={() => setShowPosterCard(true)}>
                    {mantra.mantra}
                </button>
            </div>

            {isOpen && React.cloneElement(children, { onClose: closeModal })}

            {showPosterCard && (
                <AdvocacyPoster
                    mantra={mantra}
                    mantraIndex={mantraIndex}
                    allMantras={allMantras}
                    headline={headline}
                    isOpen={showPosterCard}
                    onClose={() => setShowPosterCard(false)}
                />
            )}
        </>
    );
};

export default AdvocateCard;

