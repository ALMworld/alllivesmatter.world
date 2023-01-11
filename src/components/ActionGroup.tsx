import React, { useState } from 'react';
import { Users, GraduationCap, Briefcase, HeartPulse, Scale, MoreHorizontal, X } from 'lucide-react';
import ShareToWorld from '../components/ShareToWorld';
import AlmIcon from '../components/AlmIcon';
import ActionIcons from '../components/AlmIcons';
import ActionModal from './ActionModal';

const ActionGroup = ({ index, detail, isSelected, onSelect }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const hasMoreItems = detail.actions.length > 3;

    const handleGroupClick = () => {
        onSelect(index);
    };

    const renderActionItem = (action, actionIndex, showNumber = true) => (
        <li key={actionIndex} className="flex items-start py-2">
            {showNumber && (
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-yellow-500 text-gray-900 rounded-full mr-3 font-semibold text-sm">
                    {actionIndex + 1}
                </span>
            )}
            <div className="flex-grow mr-3">
                <p className="text-sm leading-5">{action.description}</p>
            </div>
            <div className="flex-shrink-0 mt-0.5">
                <ActionIcons money={action.money} love={action.love} law={action.law} />
            </div>
        </li>
    );

    return (
        <div 
            className={`rounded-lg overflow-hidden ${isSelected ? 'ring-2 ring-yellow-500' : ''}`}
            onClick={handleGroupClick}
        >
            <div
                className={`p-4 cursor-pointer ${isSelected ? 'bg-yellow-500' : 'bg-gray-800'}`}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <detail.Icon className={`mr-2 ${isSelected ? 'text-gray-900' : ''}`} size={24} />
                        <h3 className={`text-lg font-semibold ${isSelected ? 'text-gray-900' : ''}`}>{detail.title}</h3>
                    </div>
                    {hasMoreItems && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                            className={`focus:outline-none ${isSelected ? 'text-gray-900' : 'text-gray-400'} hover:text-white`}
                        >
                            <MoreHorizontal size={20} />
                        </button>
                    )}
                </div>
            </div>
            <ol className="bg-gray-900 p-4 space-y-2 list-none">
                {detail.actions.slice(0, 3).map((action, idx) => renderActionItem(action, idx))}
            </ol>
            <ActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`${detail.title}`}
            >
                <ol className="space-y-2 list-none">
                    {detail.actions.map((action, idx) => renderActionItem(action, idx))}
                </ol>
            </ActionModal>
        </div>
    );
};

export default ActionGroup;