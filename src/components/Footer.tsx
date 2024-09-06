import React from 'react';
import { Github, Facebook } from 'lucide-react';
import { useAdvocacyData, useCommonData } from '../data/data_provider';

const Footer = () => {

  const advocacyData = useAdvocacyData();

  return (
    <footer className="bg-black-300 text-white py-3">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p>&copy; 2024 AllLivesMatter.World  &nbsp; All Rights Reserved.</p>
          </div>
          <div className="text-center md:text-right mb-4 md:mb-0">
            <p className="text-lg font-semibold text-yellow-500">{advocacyData.attitude}</p>
            <p className="text-sm text-gray-400 mt-1">{advocacyData.bestwishes}</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0 items-center mr-4">

            <a href="https://x.com/OrdKindKang" target='_blank' className="text-gray-400 hover:text-yellow-500 transition-colors">
              <svg width="18" height="18" viewBox="0 0 1200 1227" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="transition-colors">
                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
              </svg>
            </a>


            <a href="https://github.com/kindkang/alllivesmatter.world" target='_blank' className="text-gray-400 hover:text-yellow-500 transition-colors ">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>

            {/* <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
              <Facebook size={24} />
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;