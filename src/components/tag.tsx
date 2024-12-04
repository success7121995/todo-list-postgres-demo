"use client"

import { useState, useEffect } from 'react';
import { useFilter, type FiltersProps } from '@/src/context/FilterProvider';

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
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const { addFilter, removeFilter } = useFilter();

  useEffect(() => {
    if (!keyName) return;

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