"use client"

import { ReactNode, useState, useEffect, useContext, createContext } from 'react';

// Interface for individual item properties
export interface ItemProps {
  t_id: string;
  t_title: string;
  t_cnt: string | null;
  is_completed: boolean;
  is_important: boolean;
  c_name: string | null;
}

// Interface defining the shape of the data context
interface DataContextState {
  fetchItems: () => Promise<ItemProps[] | undefined>;
  toggleItemState: (id: string, handle: 'is_important' | 'is_completed', state: boolean) => Promise<void>;
  deleteItem: (id: string) => Promise<boolean>;
}

// Creating the data context
const DataContext = createContext<DataContextState | undefined>(undefined);

// Custom hook to use the data context
export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
};

// DataProvider component that wraps the application and provides data context
const DataProvider = ({ children }: { children: ReactNode }) => {

  /**
   * Fetches items from the backend API.
   * @returns A promise that resolves to an array of ItemProps or undefined.
   */
  const fetchItems = async (): Promise<ItemProps[] | undefined> => {
    try {
      const res = await fetch('/api/fetch-items');
      if (!res.ok) {
        console.error('Failed to fetch items:', res.statusText);
        return undefined;
      }
      const items: ItemProps[] = await res.json();
      return items;
    } catch (err) {
      console.error('Error fetching items:', err);
      return undefined;
    }
  };

  /**
   * Toggles the state of an item (important or completed).
   * @param id - The ID of the item to toggle.
   * @param handle - The property to toggle ('is_important' or 'is_completed').
   * @param state - The new state to set.
   */
  const toggleItemState = async (id: string, handle: 'is_important' | 'is_completed', state: boolean): Promise<void> => {
    try {
      const res = await fetch('/api/toggle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, handle, state })
      });
      
      if (!res.ok) {
        console.error(`Failed to toggle ${handle} for item ${id}:`, res.statusText);
        throw new Error('Toggle operation failed.');
      }
    } catch (err) {
      console.error(`Error toggling ${handle} for item ${id}:`, err);
      // Optionally, re-throw or handle the error as needed
    }
  };

  /**
   * Deletes an item from the database.
   * @param id - The ID of the item to delete.
   * @returns A promise that resolves to true if deletion was successful, false otherwise.
   */
  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/delete-item', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!res.ok) {
        console.error(`Failed to delete item ${id}:`, res.statusText);
        return false;
      }

      const data = await res.json();
      // Optionally, check the response message or status
      return true;
    } catch (err) {
      console.error(`Error deleting item ${id}:`, err);
      return false;
    }
  };

  return (
    <DataContext.Provider value={{
      fetchItems,
      toggleItemState,
      deleteItem
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;