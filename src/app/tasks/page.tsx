"use client"

import { SearchBar, Tag, Row } from "../../components";
import { useRouter } from 'next/navigation';

// SVG
import PlugIcon from '@/src/public/svg/plus.svg';

const Home = () => {
  const { push } = useRouter();

  return (<>
    <h1 className="font-tangerine text-5xl text-secondary text-center mt-10">Tasks</h1>

    {/* Main Section */}
    <div>

      <div className="relative">
        <SearchBar />

        {/* Insert */}
        <button className="bg-primary rounded-full absolute -right-[15px] top-[2px] p-[10px] md:right-0" onClick={() => push('/insert')}>
          <PlugIcon className="h-[13px] w-[13px] fill-secondary"/>
        </button>
      </div>

      {/* Tags Bar */}
      <div className="my-3 flex justify-between items-center gap-x-4">
        
        <Tag name="All" color="primary" />
        <Tag name="Important" color="important" />
        <Tag name="Life" color="life" />
        <Tag name="Family" color="family" />
        <Tag name="Work" color="work" />
      </div>

      {/* Task List */}
      <ul className="mt-3">
        <Row title="jklsdjfklsjadlkfergergegergergsoisdjlkgjirejgshgoiserhg;ieshrgoihj" isImportant={true} isComplete={false} />
      </ul>
    </div>

  </>);
};

export default Home;
