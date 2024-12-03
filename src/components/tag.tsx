"use client"

import { useState, useEffect } from 'react';
import { useFilter, type FiltersProps } from '@/src/context/FilterProvider';

export interface TagProps {
  name?: FiltersProps,
  color?: string
}

const Tag = ({
  name,
  color
}: TagProps) => {
  const initialIsDisabled = name ? ['important', 'completed'].includes(name) : false;
  const [isDisabled, setIsDisabled] = useState<boolean>(initialIsDisabled);

  const { addFilter, removeFilter  } = useFilter();

  useEffect(() => {
    if (!name) return;

    if (isDisabled) {
      addFilter(name);
    } else {
      removeFilter(name);
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