import { neon } from '@neondatabase/serverless';

export const PUT = async (req: Request) => {
  const { id, handle, state } = await req.json();
  console.log(handle);
  console.log(id);
  console.log(state);

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    if (!sql) throw Error();

    const stmt = `
      UPDATE Tasks SET ${handle} = $1
      WHERE t_id = $2;
    `;

    const res = await sql(stmt, [state, id]);
    return new Response(JSON.stringify(res), {
      headers: { 'Content-Type': 'application/json'},
      status: 200
    });

  } catch (err) {
    return new Response(JSON.stringify(err), {
      headers: { 'Content-Type': 'application/json'},
      status: 400
    });
  }
};