"use client"

import { useState, useEffect } from 'react';
import { Row } from './';
import { useData, type ItemProps } from '@/src/context/DataProvider';

const Rows = () => {
  const [items, setItems] = useState<ItemProps[]>();
  const {
    mount,
    fetchItems
  } = useData()
  
  useEffect(() => {
    const handleFetchItems = async () => {
      const items = await fetchItems();
      setItems(items);
    }

    handleFetchItems();
  }, [mount]);
  
  return (<>
    <ul className="mt-3">
      {items?.map(item => (
        <Row
          key={item.t_id}
          id={item.t_id}
          title={item.t_title}
          isImportant={item.is_important}
          isComplete={item.is_completed}
        />
      ))}
    </ul>
  </>);
};

export default Rows;