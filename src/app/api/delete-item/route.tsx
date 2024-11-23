import { neon } from '@neondatabase/serverless';

export const DELETE = async (req: Request) => {
  const { id } = await req.json();

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    if (!sql) {
      return new Response(JSON.stringify({ message: 'Failed to connect to the database.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const stmt = `DELETE FROM Tasks WHERE t_id = $1`;
    const res = await sql(stmt, [id]);

    return new Response(JSON.stringify(res), {
      headers: { 'Content-Type': 'application/json'},
      status: 200
    });

  } catch (err) {
    return new Response(JSON.stringify({ message: 'An error occurred while deleting the task.' }), {
      headers: { 'Content-Type': 'application/json'},
      status: 500
    });
  }
};