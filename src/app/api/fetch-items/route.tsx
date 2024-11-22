import { neon } from '@neondatabase/serverless';

export const GET = async (req: Request) => {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const res = await sql('SELECT * FROM Tasks');
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