'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Languages, Menu as MenuIcon } from 'lucide-react';
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
        return `text-base md:text-xl font-bold w-full md:w-auto px-3 py-2 md:p-0 rounded-md md:rounded-none transition-colors ${isActive
            ? 'text-yellow-400 bg-gray-700/50 md:bg-transparent'
            : 'hover:text-yellow-400 hover:bg-gray-700/30 md:hover:bg-transparent'
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
                    <div className="flex items-center gap-3" id="leftPart">
                        <Link
                            href="/"
                            className="text-2xl font-bold hover:text-yellow-400 whitespace-nowrap flex-shrink-0"
                        >
                            <img
                                src="/alm.svg"
                                alt="ALM"
                                width={48}
                                height={48}
                                className="transition-colors"
                            />
                        </Link>
                        <Link href={`/${lang}/`} className="flex flex-col leading-tight select-none hover:opacity-80 transition-opacity">
                            <span className="text-base font-bold tracking-wide text-yellow-400">
                                {menuData.tagline}
                            </span>
                            <span className="text-xs text-gray-400 tracking-wider">
                                {menuData.tagline_sub}
                            </span>
                        </Link>
                    </div>

                    <div className="flex-grow"></div>

                    <div className="relative ml-4 p-2" ref={langMenuRef}>
                        <button
                            className="flex items-center space-x-1 hover:text-yellow-400"
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                            aria-label="Switch language"
                            aria-expanded={langMenuOpen}
                        >
                            <Languages size={20} />
                        </button>
                        {langMenuOpen && (
                            <div className="absolute top-full left-0 mt-1 bg-gray-700 rounded shadow-lg z-10 min-w-[120px]">
                                {LANGUAGES.map(({ code, label }) => (
                                    <button
                                        key={code}
                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-600 text-sm whitespace-nowrap ${code === lang ? 'text-yellow-400' : ''}`}
                                        onClick={() => onChangeLang(code)}
                                    >
                                        {label}
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
                            aria-label="Toggle navigation menu"
                            aria-expanded={isOpen}
                        >
                            <MenuIcon size={24} />
                        </button>

                        {/* Menu Items */}
                        <div
                            className={`md:flex flex-col md:flex-row items-stretch md:items-center gap-1 md:gap-4 absolute md:relative right-0 top-full md:top-auto mt-2 md:mt-0 w-auto md:w-auto bg-gray-800/95 backdrop-blur-sm md:bg-transparent rounded-lg md:rounded-none border border-gray-700/50 md:border-none shadow-xl md:shadow-none p-2 md:p-0 z-20 transition-all duration-200 origin-top-right whitespace-nowrap ${isOpen ? 'flex scale-100 opacity-100' : 'hidden md:flex scale-95 opacity-0 md:scale-100 md:opacity-100'}`}
                            role="navigation"
                            aria-label="Main navigation"
                        >
                            <Link
                                href={`/${lang}/`}
                                className={getLinkClassName(pathname === `/${lang}` || pathname === `/${lang}/`)}
                                onClick={closeMenu}
                                aria-current={(pathname === `/${lang}` || pathname === `/${lang}/`) ? 'page' : undefined}
                            >
                                {menuData.advocacy}
                            </Link>

                            <Link
                                href={`/${lang}/why`}
                                className={getLinkClassName(pathname === `/${lang}/why`)}
                                onClick={closeMenu}
                                aria-current={pathname === `/${lang}/why` ? 'page' : undefined}
                            >
                                {menuData.why}
                            </Link>

                            <Link
                                href={`/${lang}/how`}
                                className={getLinkClassName(pathname === `/${lang}/how`)}
                                onClick={closeMenu}
                                aria-current={pathname === `/${lang}/how` ? 'page' : undefined}
                            >
                                {menuData.how}
                            </Link>

                            <Link
                                href={`/${lang}/about`}
                                className={getLinkClassName(pathname === `/${lang}/about`)}
                                onClick={closeMenu}
                                aria-current={pathname === `/${lang}/about` ? 'page' : undefined}
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