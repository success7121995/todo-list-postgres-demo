"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/src/context/DataProvider';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@nextui-org/dropdown';
import {
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  useDisclosure
} from '@nextui-org/modal';
import { Button } from '@nextui-org/button';

// SVG
import TickIcon from '@/src/public/svg/tick.svg';
import MenuIcon from '@/src/public/svg/menu.svg';
import TrashIcon from '@/src/public/svg/trash.svg';
import ExclamIcon from '@/src/public/svg/exclamation.svg';
import EnterIcon from '@/src/public/svg/enter.svg';
import EditIcon from '@/src/public/svg/edit.svg';
import CrossCircleIcon from '@/src/public/svg/cross-circle.svg';

interface RowProps {
  id: string,
  title: string,
  category?: string | null,
  isImportant: boolean,
  isCompleted: boolean,
  onDelete?: (id: string) => void 
}

const Row = ({
  id,
  title,
  category = null,
  isImportant,
  isCompleted,
  onDelete = () => {}
}: RowProps) => {
  // State to track whether it is marked as important
  const [importantState, setImportantState] = useState<boolean>(isImportant);
  // State to track whether the task is completed
  const [completeState, setCompleteState] = useState<boolean>(isCompleted);
  // Ensure that the state update only occurs while the important or complete is switched
  const [isMounted, setIsMounted] = useState<boolean>(false);
  // Set category
  const [categoryColor, setCategoryColor] = useState<string | null>(category);

  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { push } = useRouter();
  const { toggleItemState } = useData();

  useEffect(() => {
    if (!category) return;
    setCategoryColor(category.toLowerCase());
  }, [category])

  useEffect(() => {
    // Prevent the initial toggling
    if (!isMounted) return;

    const handletoggleItemState = async () => {
      try {
        await toggleItemState(id, 'is_important', importantState);
      } catch (err) {
        console.log(err);
      } finally {
        setIsMounted(false);
      }
    };

    handletoggleItemState();
  }, [importantState]);

  useEffect(() => {
    // Prevent the initial toggling
    if (!isMounted) return;

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
  }, [completeState]);

  return (<>
    <li className="group hover:bg-disable transition-colors duration-200 relative w-11/12 mx-auto border-b-[1px] border-primary py-4 flex items-center gap-x-3">

      <button
        onClick={() => {
          setIsMounted(true);
          setImportantState(prev => !prev);
        }}
        className={`${!importantState ? 'opacity-0 hover:opacity-30 transition': 'opacity-100 hover:scale-110 transition'} absolute -left-10`}
      >
        <ExclamIcon className="h-[30px] w-[30px]"/>
      </button>


      <div className="flex items-center gap-x-2">
        {/* Dot */}
        <div className="h-[8px] w-[8px] rounded-full" style={{ backgroundColor: category ? `var(--${categoryColor})` : 'var(--disable-text)'}}></div>

        {/* Checkbox */}
        <button
          onClick={() => {
            setIsMounted(true);
            setCompleteState(prev => !prev);
          }}
          className="border-1 border-secondary h-[16px] w-[16px] flex justify-center items-center"
        >
          <TickIcon className={`${completeState ? 'opacity-100' : 'opacity-0 hover:opacity-30 transition'} h-[15px] w-[15px]`}/>
        </button>
      </div>

      {/* Title */}
      <h5 className="font-publicSans text-xs text-darkText max-w-[180px] truncate">{title}</h5>

      {/* Button Group */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute flex justify-center items-center right-0 gap-x-2 mr-1">
        <Dropdown>
          <DropdownTrigger>
            <MenuIcon className="h-[23px] w-[23px] fill-primary hover:fill-secondary cursor-pointer transition-color duration-300" />
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Actions"
            itemClasses={{
              base: [
                'font-publicSans',
                'rounded-md',
                'text-darkText',
                'transition-opacity',
                'data-[hover=true]:bg-disable',
                'outline-none',
                'px-full',
                'py-[3px]'
              ],
            }}
          >
            <DropdownItem
              key="view"
              textValue="view"
              startContent={<EnterIcon className="h-[16px] w-[16px]"/>}
              onClick={() => push(`/${id}`)}
            >
              <span className="text-xs w-full">View</span>
            </DropdownItem>
            
            <DropdownItem
              onClick={() => push(`/update/${id}`)}
              key="edit"
              textValue="edit"
              startContent={<EditIcon className="h-[16px] w-[16px] stroke-darkText" />}
            >
              <span className="text-xs">Edit</span>
            </DropdownItem>

          </DropdownMenu>
        </Dropdown>
        
        <button className="hover:bg-red-200 p-[2px] rounded-[5px] transition-color duration-300" onClick={onOpen}>
          <TrashIcon className="h-[23px] w-[23px]" />
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="-top-[40%] md:top-0"
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
                    onPress={() => onDelete(id)}
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
    </li>

  </>);
};

export default Row;