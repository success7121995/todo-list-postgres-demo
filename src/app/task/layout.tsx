import { Suspense } from 'react';
import { FilterProvider } from '@/src/context';
import { ClipLoader } from "react-spinners";

const TaskLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Suspense fallback={<ClipLoader size={20} color="var(--primary)" />}>
      <FilterProvider>
      { children }
      </FilterProvider>
    </Suspense>
  );
};

export default TaskLayout;
