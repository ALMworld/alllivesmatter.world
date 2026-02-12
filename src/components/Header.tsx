'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Globe, Menu as MenuIcon } from 'lucide-react';
import { useMenuData } from '../data/data_provider';
import Link from 'next/link';
import { LANGUAGES, Locale } from '@/assets/i18config';
import { usePathname, useRouter } from 'next/navigation';
import { setPreferredLocale } from '@/utils/locale';

export const Header = ({ lang }: { lang: Locale }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const menuData = useMenuData(lang);
    const langMenuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter(); // Import and use the useRouter hook

    const getLinkClassName = (isActive: boolean) => {
        return `text-xl font-bold w-full md:w-auto ${isActive ? 'text-yellow-400' : 'hover:text-yellow-400'
            }`;
    };

    const onChangeLang = (newLang: string) => {
        // Store user's preference in localStorage
        setPreferredLocale(newLang as Locale);

        // Construct the new path by replacing the current language segment
        const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
        router.push(newPath);
        setLangMenuOpen(false); // Close the language menu after selection
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setLangMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-gray-800 text-white w-full">
            <nav className="px-8 py-4">
                <div className="flex w-full items-center justify-between">
                    {/* Left side: ALM and Language settings */}
                    <div className="flex items-center" id="leftPart">
                        <Link
                            href="/"
                            className="text-2xl font-bold hover:text-yellow-400 whitespace-nowrap"
                        >
                            <img
                                src="/alm.svg"
                                alt="ALM"
                                width={48}
                                height={48}
                                className="transition-colors"
                            />
                        </Link>
                    </div>

                    <div className="flex-grow"></div>

                    <div className="relative ml-4 p-2" ref={langMenuRef}>
                        <button
                            className="flex items-center space-x-1 hover:text-yellow-400"
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                        >
                            <Globe size={20} />
                            <span>{lang.toUpperCase()}</span>
                        </button>
                        {langMenuOpen && (
                            <div className="absolute top-full left-0 mt-1 bg-gray-700 rounded shadow-lg z-10 min-w-[150px]">
                                {LANGUAGES.map(({ code, label }) => (
                                    <button
                                        key={code}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-600 text-sm whitespace-nowrap"
                                        onClick={() => onChangeLang(code)}
                                    >
                                        {code.toUpperCase()} - {label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center relative" id="rightPart">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden bg-yellow-400 text-black p-2 rounded"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <MenuIcon size={24} />
                        </button>

                        {/* Menu Items */}
                        <div className={`md:flex ${isOpen ? 'flex' : 'hidden'} flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 absolute md:relative right-0 top-full md:top-auto w-auto bg-gray-800 md:bg-transparent p-4 md:p-0 z-20`} style={{ right: '0' }}>
                            <Link
                                href={`/${lang}/`}
                                className={getLinkClassName(pathname === `/${lang}` || pathname === `/${lang}/`)}
                                onClick={closeMenu}
                            >
                                {menuData.advocacy}
                            </Link>

                            <Link
                                href={`/${lang}/why`}
                                className={getLinkClassName(pathname === `/${lang}/why`)}
                                onClick={closeMenu}
                            >
                                {menuData.why}
                            </Link>

                            <Link
                                href={`/${lang}/how`}
                                className={getLinkClassName(pathname === `/${lang}/how`)}
                                onClick={closeMenu}
                            >
                                {menuData.how}
                            </Link>

                            <Link
                                href={`/${lang}/about`}
                                className={getLinkClassName(pathname === `/${lang}/about`)}
                                onClick={closeMenu}
                            >
                                {menuData.about}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};