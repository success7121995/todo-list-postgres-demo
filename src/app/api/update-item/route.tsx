import { neon } from '@neondatabase/serverless';

export const PUT = async (req: Request) => {
  const { t_title, t_cnt, c_id, is_important, t_id } = await req.json();

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    if (!sql) return new Response(JSON.stringify('Failed to connect database'), {
      headers: { 'Content-Type': 'application/json'},
      status: 500 
    });

    const stmt = `
      UPDATE Tasks
      SET t_title = $1, t_cnt = $2, c_id = $3, is_important = $4
      WHERE t_id = $5
    `;

    const res = await sql(stmt, [t_title, t_cnt, c_id, is_important, t_id]);

    return new Response(JSON.stringify(res), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (err) {
    return new Response(JSON.stringify(err), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    }); 
  }
};