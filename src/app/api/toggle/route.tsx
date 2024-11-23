import { neon } from '@neondatabase/serverless';

export const PUT = async (req: Request) => {
  const { id, handle, state } = await req.json();

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
        if (!sql) return new Response(JSON.stringify('Failed to connect database'), {
      headers: { 'Content-Type': 'application/json'},
      status: 500 
    });

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