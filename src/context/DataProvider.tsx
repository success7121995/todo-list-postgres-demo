"use client"

import { ReactNode, useState, useEffect, useContext, createContext } from 'react';

// Items Prop
export interface ItemProps {
  t_id: string,
  t_title: string,
  t_cnt: string | null,
  is_completed: boolean,
  is_important: boolean,
  c_name: string | null
}

interface DataContextState {
  mount: boolean,
  fetchItems: () => Promise<ItemProps[] | undefined>
}

const DataContext = createContext<DataContextState | undefined>(undefined);
export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be called within DataProvider');
  return ctx;
};

const DataProvider = ({
  children
}: Readonly<{
  children: ReactNode
}>) => {
  const [mount, setMount] = useState<boolean>(false);
  
  const fetchItems = async (): Promise<ItemProps[] | undefined> => {
    setMount(true);

    try {
      const res = await fetch('/api/fetch-items');
      const items: ItemProps[] = await res.json();
      
      if (!res.ok) throw Error(); 

      setMount(false);
      return items;

    } catch (err) {
      setMount(false);
      console.log(err);
    }
  };

  return (<>
    <DataContext.Provider value={{
      mount,
      fetchItems
    }}>
      {children}
    </DataContext.Provider>
  </>)
};

export default DataProvider;


