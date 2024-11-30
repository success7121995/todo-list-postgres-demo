import { neon } from '@neondatabase/serverless';

export const GET = async (req: Request) => {
  try {
    const queries = new URL(req.url).searchParams;

    if (!queries) return new Response(JSON.stringify('Failed to get the queries'), {
      headers: { 'Content-Type': 'application/json'},
      status: 500 
    });

    const searchQuery = queries.get('search');
    const sortQuery = queries.get('sort');

    if (!searchQuery || searchQuery.trim() === '') {
      return new Response(JSON.stringify({ error: 'Search query cannot be empty' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      });
    }

    let orderByClause = '';
    switch (sortQuery) {
      case 'a-z':
        orderByClause = 'ORDER BY t.t_title ASC';
        break;
      case 'z-a':
        orderByClause = 'ORDER BY t.t_title DESC';
        break;
      case 'o-n':
        orderByClause = 'ORDER BY t.created_at DESC';
        break;
      case 'n-o':
        orderByClause = 'ORDER BY t.created_at ASC';
        break;
      default:
      // Default sorting newest to oldest 
      orderByClause = 'ORDER BY t.created_at DESC ;';
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    
    if (!sql) return new Response(JSON.stringify('Failed to connect database'), {
      headers: { 'Content-Type': 'application/json'},
      status: 500 
    });

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
      LEFT JOIN Categories c ON c.c_id = t.c_id
      WHERE t.t_title ILIKE $1 OR t.t_cnt ILIKE $1
      ${orderByClause};
    `;

    const res = await sql(stmt, [`%${searchQuery}%`]);

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