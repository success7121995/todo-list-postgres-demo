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
  fetchItems: () => Promise<ItemProps[] | undefined>,
  toggleItemState: (id: string, hande: 'is_important' | 'is_completed', state: boolean) => void
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

  /**
   * Fetch items from database
   */
  const fetchItems = async (): Promise<ItemProps[] | undefined> => {
    try {
      const res = await fetch('/api/fetch-items');
      const items: ItemProps[] = await res.json();
      
      if (!res.ok) throw Error(); 
      return items;
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Mark or remove important tag
   * @param isImportant - the state of important
   */
  const toggleItemState = async (id: string, handle: 'is_important' | 'is_completed', state: boolean) => {
    try {
      const res = await fetch('/api/toggle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, handle, state })
      });
      
      if (!res.ok) throw Error();
    } catch (err) {
      console.log(err);
    }
  }

  return (<>
    <DataContext.Provider value={{
      fetchItems,
      toggleItemState
    }}>
      {children}
    </DataContext.Provider>
  </>)
};

export default DataProvider;


