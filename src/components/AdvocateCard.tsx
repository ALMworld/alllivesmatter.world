import React, { useState } from 'react';
import AlmIcon from './AlmIcon';
import { HelpCircle } from 'lucide-react';
import DukiTermsCard from './DukiTermsCard';

const AdvocateCard = ({ advocate, isOpen, openModal, closeModal, children }) => {
    const dukiCard = advocate.icon === 'money'
    const [showDukiTerms, setShowDukiTerms] = useState(false);

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
                                    <div className="absolute right-0 top-full h-full mb-2 w-64 p-2 text-sm text-white bg-gray-700 rounded-md shadow-lg z-10">
                                        {advocate.tooltip}
                                        <div className="absolute w-full right-0 mb-2 z-20">
                                            <DukiTermsCard
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
                    <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center text-black">
                        <AlmIcon value={advocate.icon} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 selectable-text" dangerouslySetInnerHTML={{ __html: advocate.content }} />
                <p className="text-gray-400 selectable-text">{advocate.description}</p>
                <button
                    className="mt-4 border border-yellow-400 text-yellow-400 px-4 py-2 rounded hover:bg-yellow-400 hover:text-black transition duration-300"
                    onClick={openModal}>
                    {advocate.buttonText}
                </button>
            </div>

            {isOpen && React.cloneElement(children, { onClose: closeModal })}
        </>
    );
};

export default AdvocateCard;
