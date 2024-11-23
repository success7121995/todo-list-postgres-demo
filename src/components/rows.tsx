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

  /**
   * Hanlde Delete data from database
   * @param id - item's id
   */
  const handleOnDelete = (id: string) => {
    setItems(items => items?.filter(item => item.t_id !== id));
  }

  // Show loading indicator while it is loading
  if (isLoading) {
    return (
      <div className="mt-[50%] flex justify-center items-center">
        <ClipLoader size={20} color="var(--primary)" />
      </div>
    );
  }
  
  return (<>
    { items && items.length > 0 ? (

      <ul className="mt-3">
        {items?.map(item => (
          <Row
            key={item.t_id}
            id={item.t_id}
            title={item.t_title}
            isImportant={item.is_important}
            isCompleted={item.is_completed}
            onDelete={id => handleOnDelete(id)}
          />
        ))}
      </ul>
    ) : (
      <div className="text-center mt-[50%]">
        <h4 className="font-publicSans text-base text-secondary">No Task</h4>
      </div>
    )}
  </>);
};

export default Rows;