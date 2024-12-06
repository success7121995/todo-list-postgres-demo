"use client"

import { useState, useEffect } from 'react';
import { useData, type ItemProps } from '@/src/context/DataProvider';
import { useRouter } from 'next/navigation';
import { ClipLoader } from "react-spinners";
import {
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  useDisclosure
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';

// SVG
import TickIcon from '@/src/public/svg/tick-green.svg';
import EditIcon from '@/src/public/svg/edit.svg';
import TrashIcon from '@/src/public/svg/trash-red.svg';
import CrossCircleIcon from '@/src/public/svg/cross-circle.svg';

interface DetailsProps {
  id: string
}

const Details = ({ id }: DetailsProps) => {
  // State to store the list of items fetched from the database
  const [items, setItems] = useState<ItemProps[]>();
  // State to track the loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to handle error messages
  const [error, setError] = useState<string | null>(null);
  // State to track if the complete btn is toggled
  const [completeState, setCompleteState] = useState<boolean | undefined>(undefined);
  // Ensure that the state update only occurs while the important or complete is switched
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const { deleteItem, fetchItem, toggleItemState } = useData();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { replace } = useRouter();

  useEffect(() => {
    const handleFetchItems = async () => {
      try {
        setIsLoading(true);
        const fetchedItem = await fetchItem(id);
        if (fetchedItem) {
          setItems(fetchedItem);

          // Update the complete state
          if (fetchedItem.length == 1) fetchedItem.map(item => setCompleteState(item.is_completed));
        } else {
          setError('Failed to fetch item.');
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }

    handleFetchItems();
  }, [fetchItem, id]);

  useEffect(() => {
    // Prevent the initial toggling
    if (!isMounted || completeState == undefined) return;

    const handletoggleItemState = async () => {
      try {
        await toggleItemState(id, 'is_completed', completeState);
      } catch (err) {
        console.log(err);
      } finally {
        setIsMounted(false);
      }
    };

    handletoggleItemState();
  }, [completeState, id]);

  /**
   * Handle the deletion of an item.
   * Only removes the item from the UI if the deletion is successful on the server.
   * @param id
   */
  const handleOnDelete = async (id: string) => {
    try {
      const success = await deleteItem(id);
      if (success) {
        replace('/');
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

  return (<>
    {/* Button Group */}
    <div className="w-full flex justify-end items-center gap-x-2">

      {/* Complete Button */}
      <button
        onClick={() => {
          setCompleteState(prev => !prev)
          setIsMounted(true);
        }} 
        className={`${completeState ? 'bg-work' : 'bg-disable' } flex items-center gap-x-[3px] rounded-[3px] px-2 py-[3px]`}
      >
        { completeState ? <TickIcon className="h-[15px] w-[15px]" /> : ''}
        <p className={`${completeState ? 'text-[#80C682]' : 'text-disableText'} font-publicSans text-xs`}>{completeState ? 'Complete' : 'Incomplete'}</p>
      </button>

      {/* Edit */}
      <button onClick={() => replace(`/tasks/update/${id}`)} className="flex justify-between items-center gap-x-[2px] bg-primary rounded-[3px] px-1 py-[3px]">
        <EditIcon className="h-[13px] w-[13px] stroke-secondary" />
        <p className="font-publicSans text-xs text-secondary">Edit</p>
      </button>

      {/* Delete */}
      <button onClick={onOpen} className="flex justify-center items-center bg-[#FA9E9E] rounded-[3px] px-1 py-[3px]">
        <TrashIcon className="h-[16px] w-[16px]" />
      </button>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: 'text-center',
          base: 'w-2/6 min-w-[200px] max-w-[280px]',
          closeButton: 'hover:bg-disable active:bg-white/10 text-disableText'
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* Header */}
              <ModalHeader className="flex flex-col justify-center items-center">
                <CrossCircleIcon className="h-[35px] w-[35px] fill-danger"/>
                <h5 className="font-publicSans text-darkText text-base">Are You Sure?</h5>
              </ModalHeader>
              
              <ModalBody className="flex flex-row justify-between items-center">
                <Button
                  size="md"
                  className="font-publicSans text-sm bg-disable text-disableText"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => handleOnDelete(id)}
                  size="md"
                  className="font-publicSans text-sm bg-red-200 text-danger"
                >
                  Delete
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>

    {error && (
        <div className="rounded-[10px] w-4/6 mx-auto px-3 py-2 font-publicSans text-xs text-center text-danger mt-4 bg-red-100">
          {error}
        </div>
    )}

    {items && items.length === 1 && items.map(item => (
      <div key={item.t_id} className="mt-4">
        {/* Title */}
        <h1 className="font-publicSans text-secondary">{item.t_title}</h1>

        {/* Content */}
        <article className="font-publicSans text-xs text-darkText">{item.t_cnt}</article>
      </div>
    ))}
  </>);
};

export default Details;