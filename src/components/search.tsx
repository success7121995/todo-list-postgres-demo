"use client"

import { FormEvent, useRef, useState, useEffect } from 'react';

// SVG
import SearchIcon from '@/src/public/svg/search.svg';
import FilterIcon from '@/src/public/svg/filter.svg';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /**
     * Press ctrl + k to focus the search bar
     * @param e Keyboard event
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();

        searchRef.current?.focus();
      }
    }

    window.addEventListener('keydown', e => handleKeyDown(e));
    return () => window.removeEventListener('keydown', e => handleKeyDown(e));
  }, []);

  /**
   * Handle the search submit
   * @param e Search event
   */
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const searchValue = searchRef.current?.value.trim();

    if (searchValue) console.log('Press Enter');
  };

  /**
   * Toggle the filter drop down
   */
  const toggleFilterDropDown = () => setIsOpen(prev => !prev);

  return (<>
    <div className="px-3 flex justify-between items-center w-4/6 mx-auto bg-[#F6F8FA] h-[36px] rounded-[10px]">
    
      {/* Search Bar */}
      <div className="flex justify-between items-center gap-x-[5px]">
        <form onSubmit={e => handleSearch(e)} className="flex items-center gap-x-[3px]">
          <label>
            <SearchIcon />
          </label>

          <input
            ref={searchRef}
            type="text"
            className="font-publicSans text-xs bg-transparent text-[#C0C7D0] outline-none placeholder:font-publicSans placeholder:text-[#C0C7D0]"
            placeholder="Search..."/>
        </form>
        
        {/* Tips for CtrlK */}
        <p className="p-[2px] rounded-sm bg-[#C0C6C9] font-publicSansItalic text-[10px] text-white">CtrlK</p>
      </div>

      <div className="relative">
        {/*  */}
        <button onClick={toggleFilterDropDown}>
          <FilterIcon />
        </button>

        <div className={`${isOpen ? 'absolute top-3' : 'hidden'} bg-black w-[100px] h-[120px]`}></div>
      </div>
    </div>

  </>);
};

export default SearchBar;