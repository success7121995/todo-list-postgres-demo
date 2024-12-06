import { BackBtn, Details } from "@/src/components";

const Task = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const id = (await params).id;

  return (<>
    <h1 className="font-tangerine text-5xl text-secondary text-center mt-10">Details</h1>

    <div>
      <BackBtn />
      
      <Details id={id} />
    </div>
  </>);
};

export default Task;
