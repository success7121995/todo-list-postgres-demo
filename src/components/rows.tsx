"use client"

import { useState, useEffect } from 'react';
import Row from './row'; // Ensure correct import path
import { useData, type ItemProps } from '@/src/context/DataProvider';
import { ClipLoader } from "react-spinners";

const Rows = () => {
  // State to store the list of items fetched from the database
  const [items, setItems] = useState<ItemProps[]>([]);
  // State to track the loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to handle error messages
  const [error, setError] = useState<string | null>(null);

  const { fetchItems, deleteItem } = useData();
  
  useEffect(() => {
    const handleFetchItems = async () => {
      try {
        setIsLoading(true);
        const fetchedItems = await fetchItems();
        if (fetchedItems) {
          setItems(fetchedItems);
        } else {
          setError('Failed to fetch items.');
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }

    handleFetchItems();
  }, [fetchItems]);

  /**
   * Handles the deletion of an item.
   * Only removes the item from the UI if the deletion is successful on the server.
   * @param id - The ID of the item to delete.
   */
  const handleOnDelete = async (id: string) => {
    try {
      const success = await deleteItem(id);
      if (success) {
        // Update the items state by filtering out the deleted item
        setItems(prevItems => prevItems.filter(item => item.t_id !== id));
      } else {
        setError('Failed to delete the task.');
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('An unexpected error occurred while deleting the task.');
    }
  }

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
        <ul className="mt-3">
          {items.map(item => (
            <Row
              key={item.t_id}
              id={item.t_id}
              title={item.t_title}
              isImportant={item.is_important}
              isCompleted={item.is_completed}
              onDelete={handleOnDelete}
            />
          ))}
        </ul>
      ) : (
        <div className="text-center mt-[50%]">
          <h4 className="font-publicSans text-base text-secondary">No Task</h4>
        </div>
      )}
    </>
  );
};

export default Rows;