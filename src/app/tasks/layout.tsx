import { Suspense } from 'react';
import { DataProvider, FilterProvider } from '@/src/context';
import { ClipLoader } from 'react-spinners';

const TaskLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (<>
    <DataProvider>
      <Suspense fallback={<ClipLoader size={20} color="var(--primary)" />}>
        <FilterProvider>
          {children}
        </FilterProvider>
      </Suspense>
    </DataProvider>
  </>)
};

export default TaskLayout;