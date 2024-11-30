import { BackBtn, Form } from '@/src/components';

const UpdatePage = ({
  params,
}: {
  params: { id: string }
}) => {
  const id = params.id;

  return (
    <>
      <h1 className="font-tangerine text-5xl text-secondary text-center mt-10">Update a task</h1>
      <div>
        <BackBtn />
        <Form action="update" id={id} />
      </div>
    </>
  );
};

export default UpdatePage;