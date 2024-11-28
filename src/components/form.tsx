"use client"

import { useEffect, useState } from 'react';
import { useData, type CategoryProps } from '@/src/context/DataProvider';
import {Select, SelectItem} from "@nextui-org/select";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";

interface FormDataProps {
  category: string,
  is_important: boolean,
  title: string,
  content?: string
}

const Form = () => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);

  const { fetchCategories } = useData();

  const { control, handleSubmit } = useForm<FormDataProps>({
    defaultValues: {
      category: '',
      is_important: false,
      title: '',
      content: '',
    },
  });
  const onSubmit: SubmitHandler<FormDataProps> = data => console.log(data);

  useEffect(() => {
    const handleFetchCategories = async () => {
      const categories =  await fetchCategories();
      if (categories) {
        setCategories(categories);
      } 
    };

    handleFetchCategories();
  }, []);

  return (<>
    <form>
      <div>
        <Controller
          name="category"
          control={control}
          render={({ field, fieldState}) => (
            <>
              <Select
                { ...field }
                placeholder="Select a category"
                onChange={value => field.onChange(value)}
                classNames={{
                  base: 'w-[200px] h-[10px]',
                  trigger: 'h-[10px]',
                  label: 'text-xs font-publicSans text-disableText',
                }}
              >
                {categories.map(categories => (
                  <SelectItem key={categories.c_id} textValue={categories.c_name}>
                    <p className="text-xs font-publicSans text-darkText">{categories.c_name}</p>
                  </SelectItem>
                ))}
              </Select>

              {fieldState.error && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />    
      </div>

    </form>
  </>);
};

export default Form;