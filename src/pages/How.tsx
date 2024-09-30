import React, { useState } from 'react';
import { Users, GraduationCap, Briefcase, HeartPulse, Scale, MoreHorizontal, X } from 'lucide-react';
import ShareToWorld from '../components/ShareToWorld';
import { useAdvocacyData, useCommonData, useHowData } from '../data/data_provider';
import AlmIconUnit from '../components/AlmIconUnit';

const How = () => {
    const data = useHowData();
    const advocacyData = useAdvocacyData();
    const commonData = useCommonData();
    // const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);

    return (
        <div className="bg-gray-900 text-white p-8 w-full mb-8">
            <div className="max-w-6xl mx-auto">
                 {/* Poem section at the beginning */}
                 <div className="mb-12 text-center">
                    <h3 className="text-2xl mb-6 text-[#d20033] selectable-text">A Boy in the Universe</h3>
                    <div className="space-y-2">
                        {commonData.poem_a_boy_in_the_universe.map((line, index) => (
                            <p key={index} className="text-lg selectable-text italic">
                                {line || "\u00A0"}
                            </p>
                        ))}
                    </div>
                </div>

                {/* <h2 className="text-3xl font-semibold text-center selectable-text">{data.contribute_text}</h2> */}
                <main className="container mx-auto">
                    <p className="text-center text-gray text-[#d20033] selectable-text">{data.contribute_by_share_text}</p>
                    <ShareToWorld data={commonData} />
                    <div className="text-center">
                        <h3 className="text-2xl mb-6 text-[#d20033] selectable-text">{data.contribute_by_action_text}</h3>
                        <div className="space-y-6 mb-8">
                            {advocacyData.advocacy_details.map((advocate, index) => (
                                <div key={index} className="flex items-center justify-center space-x-2  ">
                                    <AlmIconUnit value={advocate.icon} className="text-yellow-500 " size={16} />
                                    <h4 className="text-2xl font-bold selectable-text">
                                        {advocate.content.replace(/DUKI/g, 'Dukiness')}
                                    </h4>
                                    <AlmIconUnit value={advocate.icon} className="text-yellow-500" size={16} />
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default How;