"use client"

import { useState, useEffect } from 'react';
import { useFilter, type FiltersProps } from '@/src/context/FilterProvider';
import { useSearchParams } from 'next/navigation';

export interface TagProps {
  keyName?: FiltersProps,
  name?: string,
  color?: string
}

const Tag = ({
  keyName,
  name,
  color
}: TagProps) => {
  const searchParams = useSearchParams();
  const { addFilter, removeFilter, extractFilters } = useFilter();

  const handleTagToggle = () => {
    const filters = extractFilters(searchParams);
    
    // Detemine whether the tag should be toggled
    return !filters.includes(keyName as FiltersProps);
  };

  const [isDisabled, setIsDisabled] = useState<boolean>(handleTagToggle());


  useEffect(() => {
    if (!keyName) return;

    // Detemine whether add or remove filters by keyName
    if (isDisabled) {
      removeFilter(keyName);
    } else {
      addFilter(keyName);
    }
  }, [isDisabled]);

  return (<>
    <button
      type="button"
      onClick={() => setIsDisabled(prev => !prev)}
      className={`
        w-fit px-3 rounded-xl text-1xs font-publicSans capitalize
        ${isDisabled ? 'text-disableText' : 'text-darkText'}
      `}
      style={{ backgroundColor: !color || isDisabled ? 'var(--disable)' : `var(--${color})`}}
    >
      {name}
    </button>
  </>);
};

export default Tag;