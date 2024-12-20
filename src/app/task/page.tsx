import { Suspense } from "react";
import Link from "next/link";
import { SearchBar, Tags, Rows} from "@/src/components";
import { ClipLoader } from "react-spinners";

// SVG
import PlugIcon from '@/src/public/svg/plus.svg';

const Home = () => {

  return (<>
    <h1 className="font-tangerine text-5xl text-secondary text-center mt-10">Tasks</h1>

    {/* Main Section */}
    <div className="relative">
      <div className="relative flex justify-between items-center">
        <SearchBar />

        {/* Insert */}
        <Link
          href="/insert"
          className="bg-primary rounded-full md:absolute md:top-[2px] p-[10px] md:right-0"
        >
          <PlugIcon className="h-[13px] w-[13px] fill-secondary"/>
        </Link>
      </div>

      {/* Tags Bar */}
      <Tags />

      {/* Task List */}
      <Suspense fallback={<ClipLoader size={20} color="var(--primary)" />}>
        <Rows />
      </Suspense>
    </div>
  </>);
};

export default Home;
