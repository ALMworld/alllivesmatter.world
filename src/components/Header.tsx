import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { LANGUAGES } from '../constants/index';
import { Globe, Menu as MenuIcon, Share2 } from 'lucide-react';
import { useMenuData } from '../data/data_provider';
import almLogo from '/alm.svg';  // assuming the SVG is in the public folder
// love_be_ye_way-will_duality_evolve_through_conflict_duality like rightousness vs unrightousness or known vs unknown
import dualityLogo from '/duality.svg';  // assuming the SVG is in the public folder


export const Header = () => {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const menuData = useMenuData();
    const langMenuRef = useRef(null);


    const onChangeLang = (code: string) => {
        i18n.changeLanguage(code);
        setLangMenuOpen(false);
    };
    const closeMenu = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
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
                        <NavLink
                            to="/"
                            className={({ isActive }) => isActive ? "text-2xl font-bold text-yellow-400 whitespace-nowrap" : "text-2xl font-bold hover:text-yellow-400 whitespace-nowrap"}
                        >
                            {/* ALM */}
                            <img
                                src={almLogo}
                                alt="ALM"
                                width="48"
                                height="48"
                                className="transition-colors"
                            />
                        </NavLink>
                    </div>

                    <div className="flex-grow"></div>

                    <div className="relative ml-4 p-2" ref={langMenuRef}>
                        <button
                            className="flex items-center space-x-1 hover:text-yellow-400"
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                        >
                            <Globe size={20} />
                            <span>{i18n.language.toUpperCase()}</span>
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
                            <NavLink
                                to="/"
                                className={({ isActive }) => isActive ? "text-xl font-bold text-yellow-400 w-full md:w-auto" : "text-xl font-bold hover:text-yellow-400 w-full md:w-auto"}
                                onClick={closeMenu}
                            >

                                {menuData.advocacy}

                            </NavLink>

                            <NavLink
                                to="/why"
                                className={({ isActive }) => isActive ? "text-xl font-bold text-yellow-400 w-full md:w-auto" : "text-xl font-bold hover:text-yellow-400 w-full md:w-auto"}
                                onClick={closeMenu}
                            >

                                {menuData.why}

                            </NavLink>

                            <NavLink
                                to="/how"
                                className={({ isActive }) => isActive ? "text-xl font-bold text-yellow-400 w-full md:w-auto" : "text-xl font-bold hover:text-yellow-400 w-full md:w-auto"}
                                onClick={closeMenu}
                            >
                                {menuData.how}
                            </NavLink>

                            <NavLink
                                to="/about"
                                className={({ isActive }) => isActive ? "text-xl  font-bold  text-yellow-400 w-full md:w-auto" : "text-xl  font-bold  hover:text-yellow-400 w-full md:w-auto"}
                                onClick={closeMenu}
                            >
                                {menuData.about}
                            </NavLink>
                        </div>
                    </div>

                        {/* un-comment to add other link here  */}
                    {/* <div className="flex">
                        <NavLink
                            to="/"
                            className={({ isActive }) => isActive ? "text-2xl font-bold text-yellow-400 whitespace-nowrap" : "text-2xl font-bold hover:text-yellow-400 whitespace-nowrap"}
                        >
                            <img
                                src={dualityLogo}
                                alt="ALM"
                                width="32"
                                height="32"
                                className="transition-colors"
                            />
                        </NavLink>
                    </div> */}
                </div>
            </nav>
        </header>
    );
};
