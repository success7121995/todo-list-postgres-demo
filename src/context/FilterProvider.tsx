"use client"

import { ReactNode, useContext, createContext, useState, useEffect } from 'react';

interface FilterContextState {
  filters: string[],
  addFilter: (filter: FiltersProps) => void,
  removeFilter: (filter: FiltersProps) => void
}

export type FiltersProps = 'completed' | 'important' | 'life' | 'family' | 'work';

const FilterContext = createContext<FilterContextState | undefined>(undefined);

export const useFilter = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilter must be used within a FilterProvider');
  return ctx;
};

const FilterProvider = ({ children }: { children: ReactNode }) => {
  // Default no filter
  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    console.log(filters);
  }, [filters]);

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

  return (
    <FilterContext.Provider value={{
      filters,
      addFilter,
      removeFilter
    }}>
      {children}
    </FilterContext.Provider>
  )
};

export default FilterProvider;


