"use client"

import { ReactNode, useContext, createContext, useState } from 'react';

interface FilterContextState {
  filterItemsByCategories: (filter: FiltersProps) => void
}

type FiltersProps = 'important' | 'life' | 'family' | 'work';

const FilterContext = createContext<FilterContextState | undefined>(undefined);

export const useFilter = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) return new Error('useFilter must be used within a FilterProvider');
};

const FilterProvider = ({ children }: { children: ReactNode }) => {
  // Default no filter
  const [filters, setFilters] = useState<string[]>([]);

  const filterItemsByCategories = (filter: FiltersProps) => {
    
  };

  return (
    <FilterContext.Provider value={{
      filterItemsByCategories
    }}>
      {children}
    </FilterContext.Provider>
  )
};

export default FilterProvider;


