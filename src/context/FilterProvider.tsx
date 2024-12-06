'use client';

import { ReactNode, useContext, createContext, useState, useEffect } from 'react';
import { useRouter, useSearchParams,  type ReadonlyURLSearchParams } from 'next/navigation';

export type FiltersProps = 'completed' | 'important' | 'life' | 'family' | 'work';
export type SortProps = 'a-z' | 'z-a' | 'o-n' | 'n-o';

interface FilterContextState {
  filters: FiltersProps[],
  sort: SortProps,
  addFilter: (filter: FiltersProps) => void,
  removeFilter: (filter: FiltersProps) => void,
  setSort: (sort: SortProps) => void,
  extractFilters: (searchParams: ReadonlyURLSearchParams) => FiltersProps[]
}

const FilterContext = createContext<FilterContextState | undefined>(undefined);

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

const FilterProvider = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FiltersProps[]>([]);
  const [sort, setSortState] = useState<SortProps>('a-z');
  const [search, setSearch] = useState<string>('');

  // Initialize filters and sort from URL on mount or when searchParams change
  useEffect(() => {
    const initialSort = (searchParams.get('sort') as SortProps) || 'n-o';
    const initialSearch = searchParams.get('search') as string;
    const initialFilters = extractFilters(searchParams);

    setFilters(initialFilters);
    setSortState(initialSort);
    setSearch(initialSearch)
  }, [searchParams]);

  /**
   * Extract filters to a new array
   */
  const extractFilters = (searchParams: ReadonlyURLSearchParams): FiltersProps[] => {
    const initialFilters: FiltersProps[] = [];

    if (searchParams.has('important') && searchParams.get('important') === 'true') {
      initialFilters.push('important');
    }
    if (searchParams.has('completed') && searchParams.get('completed') === 'true') {
      initialFilters.push('completed');
    }

    // Categories
    const categories = searchParams.getAll('category') as FiltersProps[];
    initialFilters.push(...categories.filter(cat => ['life', 'family', 'work'].includes(cat)));

    return initialFilters;
  };

  /**
   * Update the URL search parameters based on current filters and sort
   * @param updatedFilters 
   * @param updatedSort 
   * @param updatedSearch 
   */
  const updateURL = (updatedFilters: FiltersProps[], updatedSort: SortProps, updatedSearch: string) => {
    const params = new URLSearchParams();

    // Set search parameters based on filters
    updatedFilters.forEach(filter => {
      if (filter === 'important' || filter === 'completed') {
        params.set(filter, 'true');
      } else if (['life', 'family', 'work'].includes(filter)) {
        params.append('category', filter);
      }
    });

    // Set sort parameter
    if (updatedSort) {
      params.set('sort', updatedSort);
    }

    if (updatedSearch) {
      params.set('search', updatedSearch);
    }

    const queryString = params.toString();
    push(queryString ? `?${queryString}` : '/');
  };

  /**
   * Add a filter
   * @param filter 
   */
  const addFilter = (filter: FiltersProps) => {
    setFilters(prev => {
      if (!prev.includes(filter)) {
        return [...prev, filter];
      }
      return prev;
    });
  };

  /**
   * Remove a filter
   * @param filter 
   */
  const removeFilter = (filter: FiltersProps) => {
    setFilters(prev => prev.filter(item => item !== filter));
  };

  /**
   * Set the sort option
   * @param newSort 
   */
  const setSort = (newSort: SortProps) => {
    setSortState(newSort);
  };

  // Sync URL when filters or sort change
  useEffect(() => {
    updateURL(filters, sort, search);
  }, [filters, sort]);

  return (
    <FilterContext.Provider value={{
      filters,
      sort,
      addFilter,
      removeFilter,
      setSort,
      extractFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;