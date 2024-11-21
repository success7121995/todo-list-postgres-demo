"use client"

import { FormEvent, useRef, useState } from 'react';

// SVG
import SearchIcon from '@/src/public/svg/search.svg';
import FilterIcon from '@/src/public/svg/filter.svg';

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLInputElement>(null);

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