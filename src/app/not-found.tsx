import Link from "next/link";

// SVG
import WarningIcon from '@/src/public/svg/warning.svg';

const NotFound = () => {

  return (<>
    <div className="mt-[70%] flex flex-col justify-center items-center">
      <WarningIcon className="h-[40px] w-[40px]"/>
      <h1 className="text-center w-full font-publicSans text-xl text-secondary">404 Not Found</h1>
      <Link href="/tasks" className="font-publicSans text-darkText text-sm mt-3 hover:underline">Return</Link>
    </div>
  </>);
};

export default NotFound;