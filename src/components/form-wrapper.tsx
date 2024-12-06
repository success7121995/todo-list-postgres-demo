"use client"

import { useEffect, useState } from 'react';
import { useData, type ItemProps } from '@/src/context/DataProvider';
import { Form } from './';
import { ClipLoader } from "react-spinners";

interface FormWrapperProps {
  id: string
}

const FormWrapper = ({ id }: FormWrapperProps) => {
  // State to store the list of items fetched from the database
  const [items, setItems] = useState<ItemProps[]>([]);
  // State to track the loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to handle error messages
  const [error, setError] = useState<string | null>(null);

  const { fetchItem } = useData();
  useEffect(() => {

    const handleFetchItems = async () => {
      try {
        setIsLoading(true);
        const fetchedItem = await fetchItem(id);
        if (fetchedItem) {
          setItems(fetchedItem);

        } else {
          setError('Failed to fetch item.');
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }

    handleFetchItems();
  }, [fetchItem, id]);

  // Display a loading indicator while fetching data
  if (isLoading) {
    return (
      <div className="mt-[50%] flex justify-center items-center">
        <ClipLoader size={20} color="var(--primary)" />
      </div>
    );
  }

  return (<>
      {items ? (
        items.map(item => (
          <div key={item.t_id}>
            <Form action="update" id={id} data={item} />
          </div>
        ))
      ) : (
        <div className="rounded-[10px] w-4/6 mx-auto px-3 py-2 font-publicSans text-xs text-center text-danger mt-4 bg-red-100">
          {error || 'No data available.'}
        </div>
      )}
  </>);
};

export default FormWrapper;