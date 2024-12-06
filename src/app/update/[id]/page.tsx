import { BackBtn, Form, FormWrapper } from '@/src/components';

const UpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const id = (await params).id;

  return (<>
    <h1 className="font-tangerine text-5xl text-secondary text-center mt-10">Update a task</h1>

    <div>
      <BackBtn />
      
      <FormWrapper id={id} />
    </div>
  </>)
};

export default UpdatePage;