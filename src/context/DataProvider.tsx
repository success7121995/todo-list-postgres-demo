"use client"

import { ReactNode, useContext, createContext } from 'react';
import { useRouter } from 'next/navigation';
import { FiltersProps, SortProps } from './FilterProvider';

export interface FormDataProps {
  c_id?: string,
  is_important: boolean,
  t_title: string,
  t_cnt?: string | null
}

// Interface for individual item properties
export interface ItemProps {
  t_id: string,
  t_title: string,
  t_cnt: string | null,
  is_completed: boolean,
  is_important: boolean,
  c_name: string | null,
  created_at: Date
}

// Interface for categories
export interface CategoryProps {
  c_id: string,
  c_name: string
}

export interface QueriesProps {
  search?: string | null,
  filters?: FiltersProps[] | null,
  sort?: SortProps
}

interface DataContextState {
  fetchItems: ({ search, sort , filters }: QueriesProps) => Promise<ItemProps[] | undefined>,
  fetchItem: (id: string) => Promise<ItemProps[] | undefined>
  fetchCategories: () => Promise<CategoryProps[] | undefined>,
  insertItem: (data: FormDataProps) => Promise<boolean>,
  updateItem: (data: FormDataProps, id: string) => Promise<boolean>,
  toggleItemState: (id: string, handle: 'is_important' | 'is_completed', state: boolean) => Promise<void>,
  deleteItem: (id: string) => Promise<boolean>
}

const DataContext = createContext<DataContextState | undefined>(undefined);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
};

// DataProvider component that wraps the application and provides data context
const DataProvider = ({ children }: { children: ReactNode }) => {
  const { replace } = useRouter();

  /**
   * Fetches items from the backend API.
   * @returns A promise that resolves to an array of ItemProps or undefined.
   */
  const fetchItems = async ({ search = null, sort = 'n-o', filters = null }: QueriesProps): Promise<ItemProps[] | undefined> => {
    try {
      let endpoint = '/api/fetch-items';
      const queryParams = new URLSearchParams();
  
      if (search) {
        queryParams.set('search', search);
      }
      
      console.log(sort);
      if (sort) {
        console.log(sort);
        queryParams.set('sort', sort);
      }
  
      if (filters) {
        filters.forEach(filter => {
          if (filter === 'important' || filter === 'completed') {
            queryParams.set(filter, 'true');
          } else if (['life', 'family', 'work'].includes(filter)) {
            queryParams.append('category', filter);
          }
        });
      }
  
      const queryString = queryParams.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }

      const res = await fetch(endpoint);
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
   * Fetch item from the backend API.
   * @returns A promise that resolves to an array of ItemProps or undefined.
   */
  const fetchItem = async (id: string): Promise<ItemProps[] | undefined> => {
    try {
      const res = await fetch(`/api/fetch-item/${id}`);
      if (!res.ok) {
        console.error('Failed to fetch item:', res.statusText);
        return undefined;
      }

      const item: ItemProps[] = await res.json();

      return item;
    } catch (err) {
      console.error('Error fetching item:', err);
      return undefined;
    }
  };

  /**
   * Fetche items from the backend API.
   * @returns A promise that resolves to an array of ItemProps or undefined.
   */
  const fetchCategories = async (): Promise<CategoryProps[] | undefined> => {
    try {
      const res = await fetch('/api/fetch-categories');
      if (!res.ok) {
        console.error('Failed to fetch cateogories:', res.statusText);
        return undefined;
      }
      const categories: CategoryProps[] = await res.json();
      return categories;
    } catch (err) {
      console.error('Error fetching cateogories:', err);
      return undefined;
    }
  };

  /**
   * Insert an item
   * @param data 
   */
  const insertItem = async (data: FormDataProps) => {
    const { t_title, c_id, is_important, t_cnt } = data;

    try {
      const res = await fetch('/api/insert-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          t_title,
          c_id,
          t_cnt,
          is_important
        })
      });

      // Redirect to home page
      if (res.ok && res.status == 200) replace('/');
      return true;
    } catch (err) {
      return false;
    }
  };

  /**
   * 
   * @param data 
   */
  const updateItem = async (data: FormDataProps, id: string) => {
    const { t_title, c_id, is_important, t_cnt } = data;

    try {
      const res = await fetch('/api/update-item', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          t_title,
          c_id,
          t_cnt,
          is_important,
          t_id: id
        })
      });

      // Redirect to home page
      if (res.ok && res.status == 200) replace('/');
      return true;
    } catch (err) {
      console.error(`Error updating item ${id}:`, err);
      return false;
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

      await res.json();
      return true;
    } catch (err) {
      console.error(`Error deleting item ${id}:`, err);
      return false;
    }
  };

  return (
    <DataContext.Provider value={{
      fetchItems,
      fetchItem,
      fetchCategories,
      insertItem,
      updateItem,
      toggleItemState,
      deleteItem
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;