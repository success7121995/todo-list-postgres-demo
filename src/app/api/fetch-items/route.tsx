import { neon } from '@neondatabase/serverless';

export const GET = async (req: Request) => {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    if (!sql) throw Error();

    const stmt = `
      SELECT 
        t.t_id, 
        t.t_title, 
        t.t_cnt, 
        t.is_completed, 
        t.is_important, 
        c.c_name, 
        t.created_at
      FROM Tasks t
      LEFT JOIN Categories c ON c.c_id = t.c_id;
    `;

    const res = await sql(stmt);
    return new Response(JSON.stringify(res), {
      headers: { 'Content-Type': 'application/json'},
      status: 200
    })
  } catch (err) {
    return new Response(JSON.stringify(err), {
      headers: { 'Content-Type': 'application/json'},
      status: 400
    })
  }
};