"use client"

import { Tag } from './';

const Tags = () => {
  const tags = [
    { name: "All", color: "primary" },
    { name: "Important", color: "important" },
    { name: "Life", color: "life" },
    { name: "Family", color: "family" },
    { name: "Work", color: "work" },
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