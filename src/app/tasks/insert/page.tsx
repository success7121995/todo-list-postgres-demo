import { BackBtn, Form } from '@/src/components';

const InsertPage = () => {

  return (<>
    <h1 className="font-tangerine text-5xl text-secondary text-center mt-10">Create a new task</h1>

    <div>
      <BackBtn />
      
      <Form action="insert" />
    </div>
  </>)
};

export default InsertPage;