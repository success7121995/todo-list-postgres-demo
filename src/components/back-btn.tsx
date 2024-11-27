"use client"

import { useRouter } from 'next/navigation';
import CaretIcon from '@/src/public/svg/caret-stroke.svg';

const BackBtn = () => {
  const { back } = useRouter();

  return (<>
    <button className="flex justify-between items-center" onClick={() => back()}>
      <CaretIcon className="h-[23px] w-[23px] rotate-90 fill-secondary" />
      <p className="font-publicSans text-base text-secondary">Back</p>
    </button>
  </>)
};

export default BackBtn;