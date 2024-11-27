"use client"

import { useEffect, useState } from 'react';
import { useData, type CategoryProps } from '@/src/context/DataProvider';
import {Select, SelectSection, SelectItem} from "@nextui-org/select";
import { useForm, SubmitHandler } from "react-hook-form";

interface formDataProps {
  cateogry: string,
  is_important: boolean,
  title: string,
  content?: string
}

const Form = () => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);

  const { fetchCategories } = useData();

  const { register, handleSubmit } = useForm<formDataProps>();
  const onSubmit: SubmitHandler<formDataProps> = data => console.log(data);

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
        <Select
          label="Select a category"
          classNames={{
            base: "w-[200px]",
            trigger: "h-[20px]",
          }}
        >
          {categories.map(categories => (
            <SelectItem key={categories.c_id} textValue={categories.c_name}>
              <p className="text-xs font-publicSans text-darkText">{categories.c_name}</p>
            </SelectItem>
          ))}
        </Select>
      </div>

    </form>
  </>);
};

export default Form;