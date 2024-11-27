import { neon } from '@neondatabase/serverless';

export const GET = async (req: Request) => {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    if (!sql) return new Response(JSON.stringify('Failed to connect database'), {
      headers: { 'Content-Type': 'application/json'},
      status: 500 
    });

    const stmt = `SELECT * FROM Categories`;
    const res = await sql(stmt);
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