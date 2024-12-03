"use client"

import { Tag } from './';
import { type FiltersProps } from '@/src/context/FilterProvider';

const Tags = () => {
  const tags: { name: FiltersProps, color: string }[] = [
    {
      name: 'completed',
      color: 'primary',
    },
    {
      name: 'important',
      color: 'important',
    },
    {
      name: 'life',
      color: 'life',
    },
    {
      name: 'family',
      color: 'family',
    },
    {
      name: 'work',
      color: 'work',
    },
  ];

  return (
    <div className="my-3 flex justify-between items-center gap-x-4">
      {tags.map((tag, i) => (
        <div key={i}>
          <Tag name={tag.name} color={tag.color} />
        </div>
      ))}
    </div>
  );
};
export default Tags;