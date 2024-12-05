'use client';

import { ReactNode, useContext, createContext, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export type FiltersProps = 'completed' | 'important' | 'life' | 'family' | 'work';
export type SortProps = 'a-z' | 'z-a' | 'o-n' | 'n-o';

interface FilterContextState {
  filters: FiltersProps[];
  sort: SortProps;
  addFilter: (filter: FiltersProps) => void;
  removeFilter: (filter: FiltersProps) => void;
  toggleFilter: (filter: FiltersProps) => void;
  setSort: (sort: SortProps) => void;
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FiltersProps[]>([]);
  const [sort, setSortState] = useState<SortProps>('a-z');

  // Initialize filters and sort from URL on mount or when searchParams change
  useEffect(() => {
    const initialFilters: FiltersProps[] = [];
    const initialSort = (searchParams.get('sort') as SortProps) || 'a-z';

    // Extract filters from URL
    if (searchParams.has('important') && searchParams.get('important') === 'true') {
      initialFilters.push('important');
    }
    if (searchParams.has('completed') && searchParams.get('completed') === 'true') {
      initialFilters.push('completed');
    }
    // Categories
    const categories = searchParams.getAll('category') as FiltersProps[];
    initialFilters.push(...categories.filter(cat => ['life', 'family', 'work'].includes(cat)));

    setFilters(initialFilters);
    setSortState(initialSort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /**
   * Update the URL search parameters based on current filters and sort.
   */
  const updateURL = (updatedFilters: FiltersProps[], updatedSort: SortProps) => {
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

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : '/');
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
   * Toggle a filter
   * @param filter 
   */
  const toggleFilter = (filter: FiltersProps) => {
    setFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(item => item !== filter);
      } else {
        return [...prev, filter];
      }
    });
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
    updateURL(filters, sort);
  }, [filters, sort]);

  return (
    <FilterContext.Provider value={{
      filters,
      sort,
      addFilter,
      removeFilter,
      toggleFilter,
      setSort
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;