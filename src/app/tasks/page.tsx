import { Suspense } from "react";
import Link from "next/link";
import { SearchBar, Tags, Rows} from "@/src/components";

// SVG
import PlugIcon from '@/src/public/svg/plus.svg';

const Home = () => {
  return (<>
    <h1 className="font-tangerine text-5xl text-secondary text-center mt-10">Tasks</h1>

    {/* Main Section */}
    <div>
      <div className="relative">
        <SearchBar />

        {/* Insert */}
        <Link
          href="/tasks/insert"
          className="bg-primary rounded-full absolute -right-[15px] top-[2px] p-[10px] md:right-0"
        >
          <PlugIcon className="h-[13px] w-[13px] fill-secondary"/>
        </Link>
      </div>

      {/* Tags Bar */}
      <Tags />

      {/* Task List */}
      <Rows />
      <Suspense />
    </div>
  </>);
};

export default Home;
