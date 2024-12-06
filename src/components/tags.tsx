"use client"

import { Tag } from './';
import { type FiltersProps } from '@/src/context/FilterProvider';

const Tags = () => {
  const tags: { keyName: FiltersProps, name: string, color: string }[] = [
    {
      keyName: 'completed',
      name: 'Completed',
      color: 'primary',
    },
    {
      keyName: 'important',
      name: 'Important',
      color: 'important',
    },
    {
      keyName: 'life',
      name: 'Life',
      color: 'life',
    },
    {
      keyName: 'family',
      name: 'Family',
      color: 'family',
    },
    {
      keyName: 'work',
      name: 'Work',
      color: 'work',
    },
  ];

  return (
    <div className="my-3 flex justify-between items-center gap-x-3">
      {tags.map((tag, i) => (
        <div key={i}>
          <Tag name={tag.name} color={tag.color} keyName={tag.keyName} />
        </div>
      ))}
    </div>
  );
};
export default Tags;