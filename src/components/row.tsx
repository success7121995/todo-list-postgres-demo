"use client"
import { useRouter } from 'next/navigation';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/dropdown";

// SVG
import TickIcon from '@/src/public/svg/tick.svg';
import MenuIcon from '@/src/public/svg/menu.svg';
import TrashIcon from '@/src/public/svg/trash.svg';
import ExclamIcon from '@/src/public/svg/exclamation.svg';
import EnterIcon from '@/src/public/svg/enter.svg';
import EditIcon from '@/src/public/svg/edit.svg';

interface RowProps {
  title: string,
  category?: 'life' | 'work' | 'family' | null,
  isImportant: boolean,
  isComplete: boolean   
}

const Row = ({
  title,
  category = null,
  isImportant,
  isComplete
}: RowProps) => {
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
                'outline-none'
              ],
            }}
          >
            <DropdownItem key="view" startContent={<EnterIcon className="h-[16px] w-[16px]" />}>
              <span className="text-xs">View</span>
            </DropdownItem>
            <DropdownItem key="edit" startContent={<EditIcon className="h-[16px] w-[16px]" />}>
              <span className="text-xs">Edit</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        
        <button className="hover:bg-red-200 p-[2px] rounded-[5px] transition">
          <TrashIcon className="h-[23px] w-[23px]" />
        </button>
      </div>

    </li>
  </>);
};

export default Row;