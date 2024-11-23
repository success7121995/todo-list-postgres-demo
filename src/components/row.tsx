"use client"
import { useRouter } from 'next/navigation';
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
  category?: 'life' | 'work' | 'family' | null,
  isImportant: boolean,
  isComplete: boolean   
}

const Row = ({
  id,
  title,
  category = null,
  isImportant,
  isComplete
}: RowProps) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { push } = useRouter();

  return (<>
    <li className="relative w-11/12 mx-auto border-b-[1px] border-primary py-2 flex items-center gap-x-3">

      <button
        className={`${!isImportant ? 'opacity-0 hover:opacity-30 transition': 'opacity-100 hover:scale-105 transition'} absolute -left-10`}
      >
        <ExclamIcon className="h-[30px] w-[30px]"/>
      </button>


      <div className="flex items-center gap-x-2">
        {/* Dot */}
        <div className={`${category ? `bg-${category}` : 'bg-disableText'} h-[6px] w-[6px] rounded-full`}></div>

        {/* Checkbox */}
        <button className="border-1 border-secondary h-[16px] w-[16px] flex justify-center items-center">
          <TickIcon className={`${isComplete ? 'opacity-100' : 'opacity-0 hover:opacity-30 transition'} h-[15px] w-[15px]`}/>
        </button>
      </div>

      {/* Title */}
      <h5 className="font-publicSans text-xs text-darkText max-w-[180px] truncate">{title}</h5>

      {/* Button Group */}
      <div className="absolute flex justify-center items-center right-0 gap-x-2">
        <Dropdown>
          <DropdownTrigger>
            <MenuIcon className="h-[23px] w-[23px] fill-primary hover:fill-secondary cursor-pointer" />
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
              onClick={() => push(`/task/${id}`)}
            >
              <span className="text-xs w-full">View</span>
            </DropdownItem>
            
            <DropdownItem
              key="edit"
              textValue="edit"
              startContent={<EditIcon className="h-[16px] w-[16px]" />}
            >
              <span className="text-xs">Edit</span>
            </DropdownItem>

          </DropdownMenu>
        </Dropdown>
        
        <button className="hover:bg-red-200 p-[2px] rounded-[5px] transition" onClick={onOpen}>
          <TrashIcon className="h-[23px] w-[23px]" />
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: 'text-center',
          base: 'w-2/6 ',
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