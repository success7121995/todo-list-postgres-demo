import { neon } from '@neondatabase/serverless';

export const POST = async (req: Request) => {
  // Generate an ID for the task
  const t_id = `c_${Date.now()}${Array.from({ length: 4 }, _ => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const { t_title, t_cnt, c_id, is_important } = await req.json();

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    if (!sql) return new Response(JSON.stringify('Failed to connect database'), {
      headers: { 'Content-Type': 'application/json'},
      status: 500 
    });

    const res = await sql('INSERT INTO Tasks (t_id, t_title, t_cnt, c_id, is_important) VALUES ($1, $2, $3, $4, $5)', [
      t_id,
      t_title,
      t_cnt ? t_cnt : null,
      c_id ? c_id : null,
      is_important ? is_important : false
    ]);

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
