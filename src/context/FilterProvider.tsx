"use client"

import { ReactNode, useContext, createContext, useState, useEffect } from 'react';
import { type ItemProps } from './DataProvider';

interface FilterContextState {
  filters: FiltersProps[],
  sort: SortProps, 
  addFilter: (filter: FiltersProps) => void,
  removeFilter: (filter: FiltersProps) => void,
  filterItems: (filters: FiltersProps[]) =>  Promise<ItemProps[] | undefined>,
  sortItems: (sort: SortProps) => void
}

export type FiltersProps = 'completed' | 'important' | 'life' | 'family' | 'work';
export type SortProps =  'a-z' | 'z-a' | 'o-n' | 'n-o';

const FilterContext = createContext<FilterContextState | undefined>(undefined);

export const useFilter = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilter must be used within a FilterProvider');
  return ctx;
};

const FilterProvider = ({ children }: { children: ReactNode }) => {
  // Default no filter
  const [filters, setFilters] = useState<FiltersProps[]>([]);
  const [sort, setSort] = useState<SortProps>('a-z');

  useEffect(() => {
    console.log(sort);
  }, [sort]);

  /**
   * 
   * @param filter 
   */
  const addFilter = (filter: FiltersProps) => setFilters(prev => (!prev.includes(filter) ? [...prev, filter] : prev));

  /**
   * 
   * @param filter
   */
  const removeFilter = (filter: FiltersProps) => setFilters(prev => prev.filter(item => item !== filter));

  /**
   * 
   */
  const filterItems = async (filters: FiltersProps[]) => {
    try {
      const queryParams = new URLSearchParams();
  
      filters.forEach(filter => {
        if (filter === 'important' || filter === 'completed') {
          queryParams.set(filter, 'true');
        } else if (['life', 'family', 'work'].includes(filter)) {
          queryParams.append('category', filter);
        }
      });
  
      const queries = queryParams.toString();
      const res = await fetch(`/api/filter-items?${queries}`);
      if (!res.ok) {
        console.error('Failed to filter tasks:', res.statusText);
        return undefined;
      }

      const filteredItems: ItemProps[]  = await res.json();
      return filteredItems;
    } catch (err) {
      console.error('Error filtering tasks:', err);
      return undefined;
    }
  };

  /**
   * 
   * @param sort
   */
  const sortItems = (sort: SortProps) => {

    console.log(sort)
    setSort(sort);
  };

  return (
    <FilterContext.Provider value={{
      filters,
      sort,
      addFilter,
      removeFilter,
      filterItems,
      sortItems
    }}>
      {children}
    </FilterContext.Provider>
  )
};

export default FilterProvider;


