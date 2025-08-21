'use client'

import React from 'react';
import { Globe, Target, Lightbulb, Zap, CheckCircle, Rocket, MessageSquare, TrendingUp, Shield, Coins, Users, Database } from 'lucide-react';
import { AdvocacyData, CommonData, HowData } from '@/data/data_types';

type HowProps = {
    data: HowData
}

const How = ({ data }: HowProps) => {
    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-[#d20033] bg-clip-text text-transparent mb-6">
                        {data.header.title}
                    </h1>
                    <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                        {data.header.subtitle}
                    </p>
                </div>

                {/* Part 1: Why DUKI Captures ALL Attention */}
                <section className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-yellow-400 mb-4 flex items-center justify-center gap-3">
                            <Target className="w-8 h-8" />
                            {data.sections.why_duki_captures_attention.title}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {data.sections.why_duki_captures_attention.benefits.map((benefit, index) => {
                            const icons = [Zap, Globe, Lightbulb, Target];
                            const colors = ['text-yellow-400', 'text-green-400', 'text-yellow-500', 'text-[#d20033]'];
                            const IconComponent = icons[index];
                            const colorClass = colors[index];

                            return (
                                <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                                    <div className="flex items-center mb-4">
                                        <IconComponent className={`w-6 h-6 ${colorClass} mr-3`} />
                                        <h3 className="text-xl font-semibold text-yellow-300">{benefit.title}</h3>
                                    </div>
                                    <p className="text-gray-200 leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Part 2: How Any Business Can Implement DUKI Marketing */}
                <section className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-yellow-500 mb-4">
                            {data.sections.implementation_guide.title}
                        </h2>
                        <p className="text-gray-300 max-w-3xl mx-auto mb-6">
                            {data.sections.implementation_guide.subtitle}
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {data.sections.implementation_guide.steps.map((step, index) => {
                            const icons = [Shield, Database, Users];
                            const IconComponent = icons[index];
                            const gradientClasses = [
                                'from-yellow-400 to-yellow-600',
                                'from-yellow-400 to-yellow-600',
                                'from-[#d20033] to-red-700'
                            ];
                            const borderClasses = [
                                'border-yellow-500/20 hover:border-yellow-500/40',
                                'border-yellow-500/20 hover:border-yellow-500/40',
                                'border-[#d20033]/20 hover:border-[#d20033]/40'
                            ];
                            const tagClasses = [
                                'bg-yellow-500/20 text-yellow-300',
                                'bg-yellow-500/20 text-yellow-300',
                                'bg-[#d20033]/20 text-red-300'
                            ];
                            const iconColors = [
                                'text-yellow-400',
                                'text-yellow-400',
                                'text-[#d20033]'
                            ];

                            return (
                                <div key={index} className={`bg-gray-800/60 border ${borderClasses[index]} rounded-2xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300`}>
                                    <div className="flex items-start mb-6">
                                        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${gradientClasses[index]} rounded-xl flex items-center justify-center ${index === 2 ? 'text-white' : 'text-gray-900'} font-bold text-lg mr-4`}>
                                            {step.step_number}
                                        </div>
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <IconComponent className={`w-6 h-6 ${iconColors[index]} mr-2`} />
                                                <h3 className="text-xl font-bold text-yellow-300">{step.title}</h3>
                                            </div>
                                            <h4 className="text-lg font-semibold text-white mb-3">{step.subtitle}</h4>
                                        </div>
                                    </div>
                                    <p className="text-gray-200 leading-relaxed">
                                        {step.description}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {step.tags.map((tag, tagIndex) => (
                                            <span key={tagIndex} className={`px-3 py-1 ${tagClasses[index]} rounded-full text-sm`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </section>

                {/* Part 3: Proof of Concept Examples */}
                <section className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-yellow-400 mb-4">
                            {data.sections.proof_of_concept.title}
                        </h2>
                        <p className="text-gray-200 max-w-3xl mx-auto mb-4">
                            {data.sections.proof_of_concept.subtitle}
                        </p>
                        <p className="text-gray-400 text-sm italic">
                            {data.sections.proof_of_concept.disclaimer}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.sections.proof_of_concept.projects.map((project, index) => {
                            const hoverColors = [
                                'hover:border-purple-400/50',
                                'hover:border-blue-400/50',
                                'hover:border-orange-400/50',
                                'hover:border-green-400/50',
                                'hover:border-pink-400/50'
                            ];
                            const titleColors = [
                                'text-purple-400',
                                'text-blue-400',
                                'text-orange-400',
                                'text-green-400',
                                'text-pink-400'
                            ];
                            const statusColors = {
                                'Live': 'bg-green-500/20 text-green-400',
                                'In Progress': 'bg-yellow-500/20 text-yellow-400',
                                'Concept': 'bg-blue-500/20 text-blue-400',
                                'Planning': 'bg-gray-500/20 text-gray-300',
                                'Future': 'bg-pink-500/20 text-pink-300'
                            };

                            const ProjectCard = () => (
                                <div className={`bg-gray-800/50 border border-gray-700 rounded-lg p-6 ${hoverColors[index] || 'hover:border-gray-400/50'} transition-all cursor-pointer hover:scale-105 h-80 flex flex-col`}>
                                    <div className="text-4xl mb-4">{project.emoji}</div>
                                    <h3 className={`text-xl font-bold ${titleColors[index] || 'text-gray-400'} mb-3`}>
                                        {project.name}
                                    </h3>
                                    <p className="text-gray-200 text-sm mb-4 flex-grow">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {project.tags.map((tag, tagIndex) => {
                                            const isStatusTag = tag === project.status;
                                            const tagClass = isStatusTag
                                                ? statusColors[project.status as keyof typeof statusColors]
                                                : titleColors[index]?.replace('text-', 'bg-').replace('400', '500/20') + ' ' + titleColors[index]?.replace('400', '300');

                                            return (
                                                <span key={tagIndex} className={`px-2 py-1 ${tagClass} rounded text-xs`}>
                                                    {tag}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            );

                            return project.link ? (
                                <a key={index} href={project.link} target="_blank" rel="noopener noreferrer" className="block">
                                    <ProjectCard />
                                </a>
                            ) : (
                                <div key={index}>
                                    <ProjectCard />
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Call to Action */}
                <footer className="text-center mb-4">
                    <div className="bg-gradient-to-r from-yellow-900/30 to-red-900/30 border border-yellow-500/30 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                            {data.sections.call_to_action.title}
                        </h2>
                        <p className="text-gray-200 leading-relaxed max-w-3xl mx-auto mb-6">
                            {data.sections.call_to_action.description}
                        </p>
                        <p className="text-lg font-semibold text-yellow-300">
                            {data.sections.call_to_action.tagline}
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default How;
