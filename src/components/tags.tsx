"use client"

import { Tag } from './';

const Tags = () => {
  const tags = [
    {
      name: 'All',
      color: 'primary',
      action: () => {}
    },
    {
      name: 'Important',
      color: 'important',
      action: () => {}
    },
    {
      name: 'Life',
      color: 'life',
      action: () => {}
    },
    {
      name: 'Family',
      color: 'family',
      action: () => {}
    },
    {
      name: 'Work',
      color: 'work',
      action: () => {}
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