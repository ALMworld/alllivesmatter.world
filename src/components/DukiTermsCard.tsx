import React from 'react';
import { CircleCheckBig, X } from 'lucide-react';
import { useCommonData } from '../data/data_provider';
import AlmIcon from './AlmIcon';


const DukiTermsCard = ({ onClose }) => {
    const commonData = useCommonData();
    const terms = commonData.duki_terms;

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4 sm:p-0"
            onClick={handleOutsideClick}
        >
            <div className="bg-slate-800 text-white p-6 rounded-lg shadow-lg max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
                <div className="flex justify-between items-center mb-6 w-full">
                    {/* <h2 className="text-xl font-bold text-yellow-500" dangerouslySetInnerHTML={{__html: advocate.content}}  /> */}
                    {/* <div className="text-yellow-500">
                        <AlmIcon value='money' size={24} />
                    </div> */}
                </div>
                <div className="space-y-6">
                    {terms.map((item, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center space-x-2">
                                {/* <CircleCheckBig size={20} className="text-yellow-500" /> */}
                                <AlmIcon className="text-yellow-500" value={item.icon} size={20} />
                                <h3 className="text-sm font-semibold text-left selectable-text">{item.term}</h3>
                            </div>
                            <div className="space-x-2">
                                <p className="text-gray-400 text-sm ml-6 text-left selectable-text"> {item.definition} </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DukiTermsCard;