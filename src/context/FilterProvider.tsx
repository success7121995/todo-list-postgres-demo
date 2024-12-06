'use client';

import { ReactNode, useContext, createContext, useState, useEffect } from 'react';
import { useRouter, useSearchParams,  type ReadonlyURLSearchParams } from 'next/navigation';

export type FiltersProps = 'completed' | 'important' | 'life' | 'family' | 'work';
export type SortProps = 'a-z' | 'z-a' | 'o-n' | 'n-o';

interface FilterContextState {
  filters: FiltersProps[],
  sort: SortProps,
  search: string,
  page: number,
  addFilter: (filter: FiltersProps) => void,
  removeFilter: (filter: FiltersProps) => void,
  setSort: (sort: SortProps) => void,
  setPage: (page: number) => void,
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
  const [sort, setSortState] = useState<SortProps>('n-o');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // Initialize filters and sort from URL on mount or when searchParams change
  useEffect(() => {
    const initialSort = (searchParams.get('sort') as SortProps);
    const initialSearch = searchParams.get('search') as string;
    const initialFilters = extractFilters(searchParams);
    const initialPage =  parseInt(searchParams.get('page') ?? '1', 10);

    setFilters(initialFilters);
    setSortState(initialSort);
    setSearch(initialSearch);
    setPage(initialPage);
  }, [searchParams]);

  // Sync URL when filters or sort change
  useEffect(() => {
    updateURL(filters, sort, search, page);
  }, [filters, sort, search, page]);

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
  const updateURL = (updatedFilters: FiltersProps[], updatedSort: SortProps, updatedSearch: string, updatedPage: number) => {
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

    if (updatedPage && updatedPage > 1) {
      params.set('page', updatedPage.toString());
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
        setPage(1);
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
    setPage(1);
    setFilters(prev => prev.filter(item => item !== filter));
  };

  /**
   * Set the sort option
   * @param newSort 
   */
  const setSort = (newSort: SortProps) => {
    setPage(1);
    setSortState(newSort);
  };

  return (
    <FilterContext.Provider value={{
      filters,
      sort,
      search,
      page,
      addFilter,
      removeFilter,
      setSort,
      setPage,
      extractFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;