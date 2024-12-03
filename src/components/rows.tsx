// Rows.tsx

'use client'

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Row from './row'; // Ensure correct import path
import { useData, type ItemProps } from '@/src/context/DataProvider';
import { useFilter, FiltersProps } from '@/src/context/FilterProvider';
import { ClipLoader } from "react-spinners";
import {
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  useDisclosure
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';

const Rows = () => {
  // State to store the complete list of items fetched from the database
  const [items, setItems] = useState<ItemProps[]>([]);
  // State to store the list of items to display after filtering
  const [displayItems, setDisplayItems] = useState<ItemProps[]>([]);
  // State to track the loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to handle error messages
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');

  const { replace } = useRouter();

  const { fetchItems, deleteItem, searchItems } = useData();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { filters } = useFilter();

  // Fetch all items on component mount
  useEffect(() => {
    const handleFetchItems = async () => {
      try {
        setIsLoading(true);
        const fetchedItems = await fetchItems();
        if (fetchedItems) {
          setItems(fetchedItems);
          setDisplayItems(fetchedItems);
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

  // Handle searching items based on search parameters
  useEffect(() => {
    if (!search) return;

    const handleSearchItems = async () => {
      try {
        setIsLoading(true);
        const fetchedItems = await searchItems(search, sort || undefined);

        if (fetchedItems && fetchedItems.length > 0 ) {
          setItems(fetchedItems as ItemProps[]);
          setDisplayItems(fetchedItems as ItemProps[]);
        } else {
          setItems([]); // Clear the complete list if no results
          setDisplayItems([]);
          onOpen();
        }
      } catch (err) {
        console.error('Error searching items:', err);
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }

    handleSearchItems();
  }, [search, sort, searchItems, onOpen]);

  // Handle filtering items based on active filters
  useEffect(() => {
    if (filters.length < 1) {
      setDisplayItems(items); 
    } else {
      setDisplayItems(items.filter(item => {
        const filterConditions = {
          completed: filters.includes('completed') ? !item.is_completed : true,
          important: filters.includes('important') ? !item.is_important : true,
          life: filters.includes('life') ? item.c_name !== 'life' : true,
          family: filters.includes('family') ? item.c_name !== 'family' : true,
          work: filters.includes('work') ? item.c_name !== 'work' : true,
        };
        return Object.values(filterConditions).every(condition => condition === true);
      }));
    }
  }, [filters, items]);

  /**
   * Handles the deletion of an item.
   * Only removes the item from the UI if the deletion is successful on the server.
   * @param id - The ID of the item to delete.
   */
  const handleOnDelete = async (id: string) => {
    try {
      const success = await deleteItem(id);
      if (success) {
        // Update both allItems and displayItems
        const updatedAllItems = items.filter(item => item.t_id !== id);
        setItems(updatedAllItems);
        setDisplayItems(updatedAllItems.filter(item => {
          // Re-apply filters if any
          return filters.every(filter => {
            if (filter === 'important') {
              return item.is_important;
            }
            if (['life', 'family', 'work'].includes(filter)) {
              return item.c_name === filter;
            }
            return true;
          });
        }));
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
      {displayItems.length > 0 ? (
        <ul className="mt-3">
          {displayItems.map(item => (
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
      ) : (
        <div className="text-center mt-[50%]">
          <h4 className="font-publicSans text-base text-secondary">No Task</h4>
        </div>
      )}

      {/* Error Modal for search */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: 'text-center',
          base: 'w-2/6 min-w-[200px] max-w-[250px]',
          closeButton: 'hover:bg-disable active:bg-white/10 text-disable-text'
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* Header */}
              <ModalHeader className="flex flex-col justify-center items-center mt-4">
                <h5 className="font-publicSans text-dark-text text-base">No Record Found</h5>
              </ModalHeader>
              
              <ModalBody className="flex flex-row justify-center items-center">
                <Button
                  size="sm"
                  className="font-publicSans text-sm bg-primary text-secondary mb-[3px]"
                  onPress={() => {
                    onClose();
                    replace('/');
                  }}
                >
                  Close
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Rows;