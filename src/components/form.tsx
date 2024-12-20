"use client"

import { useEffect, useState } from 'react';
import { ItemProps, useData, type CategoryProps, type FormDataProps } from '@/src/context/DataProvider';
import { Select, SelectItem } from '@nextui-org/select';
import { Input, Textarea } from '@nextui-org/input';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { ClipLoader } from "react-spinners";

interface FormProps {
  action: 'insert' | 'update',
  id?: string,
  data?: ItemProps
}

const Form = ({ action, id, data }: FormProps) => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { fetchCategories, insertItem, fetchItem, updateItem } = useData();

  const { control, handleSubmit, register, reset, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      c_id: '',
      is_important: false,
      t_title: '',
      t_cnt: '',
    },
    values: data
  });

  /**
   * 
   * @param data - Form data
   */
  const onSubmit: SubmitHandler<FormDataProps> = async data => {
    try {
      setIsLoading(true);
      if (action == 'insert') {
        console.log('insert');
        await insertItem(data);
      } else {
        if (!id) throw Error('No ID is provided.');
        console.log('update');
        await updateItem(data, id);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    /**
     * Handle fetch categories
     */
    const handleFetchCategories = async () => {
      const categories =  await fetchCategories();
      if (categories) {
        setCategories(categories);
      } 
    };

    handleFetchCategories();
  }, [fetchCategories, fetchItem, id, action, reset]);

  // Display a loading indicator while fetching data
  if (isLoading) {
    return (
      <div className="mt-[50%] flex justify-center items-center">
        <ClipLoader size={20} color="var(--primary)" />
      </div>
    );
  }
    
  return (<>
    <form className="mt-3 relative" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Controller
          { ...register('c_id', {

          })}
          name="c_id"
          control={control}
          render={({ field, fieldState}) => (
            <>
              <Select
                { ...field }
                aria-label="Selection of category"
                placeholder="Select a category"
                onChange={value => {
                  console.log(value);
                  field.onChange(value)
                }}
                classNames={{
                  base: 'w-[200px]',
                  helperWrapper: 'text-red-200',
                  value: 'text-xs font-publicSans',
                  listboxWrapper: 'max-h-[400px]'
                }}
                popoverProps={{
                  classNames: {
                    content: 'p-[2px]',
                  },
                }}
              >
                {categories.map(categories => (
                  <SelectItem key={categories.c_id} value={categories.c_id} textValue={categories.c_name}>
                    <p className="text-xs font-publicSans text-darkText capitalize">{categories.c_name}</p>
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

        {/* Toggle Important */}
        <div className="mt-[2px]">
          <Controller
            name="is_important"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                className={`
                  w-fit px-3 rounded-xl text-1xs font-publicSans capitalize
                  ${!field.value ? 'text-disableText' : 'text-darkText'}
                `}
                style={{ backgroundColor: !field.value ? 'var(--disable)' : `var(--important)`}}
                onClick={() => field.onChange(!field.value)}
              >
                Important
              </button>
            )}
          />
        </div>
        
        {/* Title */}
        <div className="flex flex-col mb-5">
          <Input
            { ...register('t_title', {
              required: 'Title is required.'
            })}
            aria-label="Input for title"
            type="text"
            variant="underlined" 
            label="title"
            classNames={{
              base: 'group-data-[focus=true]:border-none',
              label: 'text-secondary group-data-[focus=true]:text-secondary',
              input: [
                'font-publicSans group-data-[focus=true]:text-sm group-data-[focus=true]:text-secondary text-secondary',
              ],
              inputWrapper: [
                'border-b-[1px] border-secondary'
              ]
            }}
          />
          { errors && (
            <p className="font-publicSans text-danger text-xs">{errors.t_title?.message}</p>
          )}
        </div>

        {/* Textarea */}
        { errors && (
            <p className="font-publicSans text-danger text-xs">{errors.t_cnt?.message}</p>
          )}
        <Textarea
          { ...register('t_cnt', {
            maxLength: {
              value: 2200,
              message: 'The content cannot exceed 500 characters.',
            },
          })}
          aria-label="Textarea for content"
          label="Content"
          placeholder="Enter your description"
          classNames={{
            input: 'font-publicSans text-xs text-darkText'
          }}
          minRows={10}
          maxRows={10}
        />
      </div>
      
      {/* Submit */}
      <button type="submit" className="absolute bg-primary px-3 py-[3px] font-publicSans text-sm text-secondary top-2 right-3 rounded-md">Save</button>
    </form>
  </>);
};

export default Form;