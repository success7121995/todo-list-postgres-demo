'use client';

import { useState, useEffect } from 'react';
import { Row, Pagination } from './';
import { useData, type ItemProps } from '@/src/context/DataProvider';
import { useFilter, FiltersProps, SortProps } from '@/src/context/FilterProvider';
import { ClipLoader } from "react-spinners";

export interface QueriesProps {
  search?: string | null;
  filters?: FiltersProps[];
  sort?: SortProps;
}

const Rows = () => {
  // State to store the complete list of items fetched from the database
  const [items, setItems] = useState<ItemProps[]>([]);
  // State to store the numbers of items
  const [itemSize, setItemSize] = useState<number>(0);
  // State to track the loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to handle error messages
  const [error, setError] = useState<string | null>(null);

  // Paginations
  const pageSize = 7;

  const { fetchItems, deleteItem } = useData();
  const { filters, search, sort, page } = useFilter();

  // Fetch all items when search, sort, or filters change
  useEffect(() => {
    handleFetchItems();
  }, [search, sort, filters, page]);

  /**
   * Fetche items based on current search, sort, and filter configurations.
   */
  const handleFetchItems = async () => {
    try {
      setIsLoading(true);
      const fetchedItems = await fetchItems({ search, sort, filters });

      if (fetchedItems) {
        const paginatedItems = handlePagination(pageSize, fetchedItems);
        if (paginatedItems) setItems(paginatedItems);
        setItemSize(fetchedItems.length);
      }  
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle pagination
   * @param pageSize 
   * @param items - Fetched items
   */
  const handlePagination = (pageSize: number, items: ItemProps[]) => {
    if (!items || items.length < 1) return;
    const startIndex = (page - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  };

  /**
   * Handle the deletion of an item.
   * Only removes the item from the UI if the deletion is successful on the server.
   * @param id
   */
  const handleOnDelete = async (id: string) => {
    try {
      const success = await deleteItem(id);
      if (success) {
        // Update both allItems and displayItems
        const updatedItems = items.filter(item => item.t_id !== id);
        setItems(updatedItems);
      } else {
        setError('Failed to delete the task.');
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('An unexpected error occurred while deleting the task.');
    }
  };

  // Display a loading indicator while fetching data
  if (isLoading) {
    return (
      <div className="mt-[50%] flex justify-center items-center">
        <ClipLoader size={20} color="var(--primary)" />
      </div>
    );
  }
  
  return (
    <>
      {error && (
        <div className="rounded-[10px] w-4/6 mx-auto px-3 py-2 font-publicSans text-xs text-center text-danger mt-4 bg-red-100">
          {error}
        </div>
      )}
      {items.length > 0 ? (
        <>
          <ul className="mt-3">
            {items.map(item => (
              <Row
              key={item.t_id}
              id={item.t_id}
              title={item.t_title}
              isImportant={item.is_important}
              isCompleted={item.is_completed}
              category={item?.c_name as FiltersProps | null} // Ensure category matches FiltersProps
              onDelete={handleOnDelete}
              />
            ))}
          </ul>
          <Pagination pageSize={pageSize} itemSize={itemSize}/>
        </>
      ) : (
        <div className="text-center mt-[50%]">
          <h4 className="font-publicSans text-base text-secondary">No Task</h4>
        </div>
      )}
    </>
  );
};

export default Rows;