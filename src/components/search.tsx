'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useFilter } from '../context/FilterProvider';
import { FormEvent, useRef, useEffect } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/dropdown";

// SVG Imports
import SearchIcon from '@/src/public/svg/search.svg';
import FilterIcon from '@/src/public/svg/filter.svg';

type Sort = 'a-z' | 'z-a' | 'o-n' | 'n-o' | undefined;

const SearchBar = () => {
  const { setSort } = useFilter();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /**
     * Press Ctrl + K to focus the search bar
     * @param e KeyboardEvent
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Handle the search submit
   * @param
   */
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const searchValue = searchRef.current?.value.trim();

    // Get current search params
    const params = new URLSearchParams(searchParams.toString());

    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }

    const queryString = params.toString();
    console.log(queryString);
    router.push(queryString ? `?${queryString}` : '/');
  };

  return (
    <div className="px-3 flex justify-between items-center w-5/6 mx-auto bg-[#F6F8FA] h-[36px] rounded-[10px] md:w-4/6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-x-[3px]">
        <label><SearchIcon className="stroke-[#C0C6C9] h-[13px] w-[13px] md:h-[16px] md:w-[16px}" /></label>

        <input
          ref={searchRef}
          type="text"
          defaultValue={searchParams.get('search') || ''}
          className="font-publicSans text-xs bg-transparent text-[#C0C7D0] outline-none placeholder:font-publicSans placeholder:text-[#C0C7D0]"
          placeholder="Search..."
        />
      </form>

      <div className="relative flex justify-between items-center gap-x-[5px]">
        {/* Shortcut Tip */}
        <p className="px-[3px] rounded-sm bg-[#C0C6C9] font-publicSansItalic text-1xs md:text-xs text-white md:py-[1px]">
          CtrlK
        </p>

        <Dropdown>
          <DropdownTrigger>
            <FilterIcon className="stroke-[#C0C6C9] h-[15px] w-[15px] md:h-[18px] md:w-[18px] cursor-pointer" />
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Sort Options"
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
            <DropdownItem key="a-z" textValue="a-z" onClick={() => setSort('a-z')}>
              <span className="text-xs">Sort A to Z</span>
            </DropdownItem>
            <DropdownItem key="z-a" textValue="z-a" onClick={() => setSort('z-a')}>
              <span className="text-xs">Sort Z to A</span>
            </DropdownItem>
            <DropdownItem key="o-n" textValue="o-n" onClick={() => setSort('o-n')}>
              <span className="text-xs">Sort Oldest to Newest</span>
            </DropdownItem>
            <DropdownItem key="n-o" textValue="n-o" onClick={() => setSort('n-o')}>
              <span className="text-xs">Sort Newest to Oldest</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default SearchBar;