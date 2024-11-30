"use client"

import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useEffect } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/dropdown";

// SVG
import SearchIcon from '@/src/public/svg/search.svg';
import FilterIcon from '@/src/public/svg/filter.svg';

const SearchBar = () => {
  const { push, replace } = useRouter();

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
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const searchValue = searchRef.current?.value.trim();

    if (searchValue) {
      push(`?search=${encodeURIComponent(searchValue)}`);
    } else {
      replace('/');
    }
  };

  return (<>

    <div className="px-3 flex justify-between items-center w-5/6 mx-auto bg-[#F6F8FA] h-[36px] rounded-[10px] md:w-4/6">
    
      {/* Search Bar */}
      <form onSubmit={e => handleSearch(e)} className="flex items-center gap-x-[3px]">
        <label>
          <SearchIcon className="stroke-[#C0C6C9] h-[13px] w-[13px] md:h-[16px] md:w-[16px]"/>
        </label>

        <input
          ref={searchRef}
          type="text"
          className="font-publicSans text-xs bg-transparent text-[#C0C7D0] outline-none placeholder:font-publicSans placeholder:text-[#C0C7D0]"
          placeholder="Search..."/>
      </form>

      <div className="relative flex justify-between items-center gap-x-[5px]">
        {/* Tips for CtrlK */}
        <p className="px-[3px] rounded-sm bg-[#C0C6C9] font-publicSansItalic text-1xs md:text-xs text-white md:py-[1px]">CtrlK</p>

        <Dropdown>
          <DropdownTrigger>
            <FilterIcon className="stroke-[#C0C6C9] h-[15px] w-[15px] md:h-[18px] md:w-[18px] cursor-pointer"/>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Filter"
            itemClasses={{
              base: [
                'font-publicSans',
                'rounded-md',
                'text-darkText',
                'transition-opacity',
                'data-[hover=true]:bg-disable',
                'outline-none',
                'px-full',
                'py-[3px]'
              ],
            }}
          >
            <DropdownItem key="a-z" textValue="a-z"><span className="text-xs">Sort A to Z</span></DropdownItem>
            <DropdownItem key="z-a" textValue="z-a"><span className="text-xs">Sort Z to A</span></DropdownItem>
            <DropdownItem key="o-n" textValue="o-n"><span className="text-xs">Sort Newest to Oldest</span></DropdownItem>
            <DropdownItem key="n-o" textValue="n-o"><span className="text-xs">Sort Oldest to Newest</span></DropdownItem>
          </DropdownMenu>
        </Dropdown>

        
      </div>
    </div>

  </>);
};

export default SearchBar;