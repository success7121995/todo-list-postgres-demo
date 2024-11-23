"use client"

import { useState, useEffect } from 'react';
import { Row } from './';
import { useData, type ItemProps } from '@/src/context/DataProvider';
import { ClipLoader } from "react-spinners";

const Rows = () => {
  // State to track update items
  const [items, setItems] = useState<ItemProps[]>();
  // State to track whether it is fetching data
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { fetchItems } = useData()
  
  useEffect(() => {
    const handleFetchItems = async () => {
      try {
        setIsLoading(true);
        const items = await fetchItems();
        setItems(items);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }

    handleFetchItems();
  }, [fetchItems]);

  // Show loading indicator while it is loading
  if (isLoading) {
    return (
      <div className="mt-[50%] flex justify-center items-center">
        <ClipLoader size={20} color="var(--primary)" />
      </div>
    );
  }
  
  return (<>
    <ul className="mt-3">
      {items?.map(item => (
        <Row
          key={item.t_id}
          id={item.t_id}
          title={item.t_title}
          isImportant={item.is_important}
          isCompleted={item.is_completed}
        />
      ))}
    </ul>
  </>);
};

export default Rows;