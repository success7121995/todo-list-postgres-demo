import { neon } from '@neondatabase/serverless';

export const GET = async (req: Request) => {
  try {
    const queries = new URL(req.url).searchParams;
    const sql = neon(`${process.env.DATABASE_URL}`);

    const categories = queries.getAll('category');

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
      JOIN Categories c ON c.c_id = t.c_id
      WHERE ${Array.from({ length: categories.length }, (_, i) => `c.c_name = $${i + 1}`).join(' OR ')}
    `

    const res = await sql(stmt, categories);

    return new Response(JSON.stringify(res), {
      headers: { 'Content-Type': 'application/json'},
      status: 200
    });
  } catch (_) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json'},
      status: 400
    });
  }
};