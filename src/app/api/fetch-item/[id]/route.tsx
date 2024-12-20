import { neon } from '@neondatabase/serverless';

export const GET = async (req: Request) => {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    if (!sql) return new Response(JSON.stringify('Failed to connect database'), {
      headers: { 'Content-Type': 'application/json'},
      status: 500 
    });

    const id = await new URL(req.url).pathname.split('/').slice(-1).join();
    const stmt = `
      SELECT 
        t.t_id, 
        t.t_title, 
        t.t_cnt, 
        t.is_completed, 
        t.is_important, 
        c.c_name,
        c.c_id
      FROM Tasks t
      LEFT JOIN Categories c ON c.c_id = t.c_id
      WHERE t_id = $1
    `;

    const res = await sql(stmt, [id]);
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