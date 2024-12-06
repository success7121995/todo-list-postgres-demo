"use client"

import { useEffect, useState } from 'react';
import { ItemProps, useData, type CategoryProps, type FormDataProps } from '@/src/context/DataProvider';
import { Select, SelectItem } from '@nextui-org/select';
import { Input, Textarea } from '@nextui-org/input';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { Tag } from '@/src/components';

interface FormProps {
  action: 'insert' | 'update',
  id?: string,
  data?: ItemProps
}

const Form = ({ action, id, data }: FormProps) => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { fetchCategories, insertItem, fetchItem } = useData();

  const { control, handleSubmit, register, reset, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      category: '',
      is_important: false,
      title: '',
      content: '',
    },
  });

  /**
   * 
   * @param data - Form data
   */
  const onSubmit: SubmitHandler<FormDataProps> = async data => {
    try {
      const success = await insertItem(data);

    } catch (err) {
      console.log(err);
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

    /**
     * Fetch existing item data for update
     */
    const handleFetchItem = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const item = await fetchItem(id);
        
        if (item) {
          const items = Object.values(item)[0];
          reset({
            category: items.c_name || undefined,
            is_important: items.is_important,
            title: items.t_title,
            content: items.t_cnt,
          });
        }
      } catch (error) {
        console.error('Failed to fetch item:', error);
      } finally {
        setLoading(false);
      }
    };

    handleFetchCategories();
    if (action == 'update') handleFetchItem();
  }, [fetchCategories, fetchItem, id, action, reset]);

  return (<>
    <form className="mt-3 relative" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Controller
          { ...register('category')}
          name="category"
          control={control}
          render={({ field, fieldState}) => (
            <>
              <Select
                { ...field }
                aria-label="Selection of category"
                placeholder="Select a category"
                onChange={value => field.onChange(value)}
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
                  <SelectItem key={categories.c_id} textValue={categories.c_name}>
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
            { ...register('title') }
            aria-label="Input for title"
            type="text"
            variant="underlined" 
            label="title"
            classNames={{
              base: 'group-data-[focus=true]:border-none',
              label: 'text-secondary group-data-[focus=true]:text-secondary',
              input: [
                'font-publicSans group-data-[focus=true]:text-sm group-data-[focus=true]:text-darkText',
              ],
              inputWrapper: [
                'border-b-[1px] border-secondary'
              ]
            }}
          />
        </div>

        {/* Textarea */}
        <Textarea
          { ...register('content')}
          aria-label="Textarea for content"
          label="Content"
          placeholder="Enter your description"
          classNames={{
            input: 'font-publicSans text-sm text-darkText'
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