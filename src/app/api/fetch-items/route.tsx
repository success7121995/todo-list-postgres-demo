import { neon } from '@neondatabase/serverless';

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'a-z'; // Default sort
    const categories = searchParams.getAll('category');
    const isImportant = searchParams.get('important');
    const isCompleted = searchParams.get('completed');


    const sql = neon(`${process.env.DATABASE_URL}`);
    
    if (!sql) return new Response(JSON.stringify('Failed to connect database'), {
      headers: { 'Content-Type': 'application/json'},
      status: 500 
    });

    let stmt = `
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
    `;

    const whereClauses: string[] = [];
    // Array to hold parameters
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      whereClauses.push(`(t.t_title ILIKE $${params.length} OR t.t_cnt ILIKE $${params.length})`);
    }

    if (categories.length > 0) {
      const categoryPlaceholders = categories.map((_, i) => `$${params.length + i + 1}`).join(', ');
      console.log(categoryPlaceholders);
      whereClauses.push(`c.c_name IN (${categoryPlaceholders})`);
      params.push(...categories);
    }

    if (isImportant) {
      params.push(isImportant === 'true'); // Convert to boolean
      whereClauses.push(`t.is_important = $${params.length}`);
    }

    if (isCompleted) {
      params.push(isCompleted === 'true'); // Convert to boolean
      whereClauses.push(`t.is_completed = $${params.length}`);
    }

    if (whereClauses.length > 0) {
      stmt += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    switch (sort) {
      case 'a-z':
        stmt += ` ORDER BY t.t_title ASC`;
        break;
      case 'z-a':
        stmt += ` ORDER BY t.t_title DESC`;
        break;
      case 'n-o':
        stmt += ` ORDER BY t.created_at DESC`;
        break;
      case 'o-n':
        stmt += ` ORDER BY t.created_at ASC`;
        break;
      default:
        stmt += ` ORDER BY t.created_at DESC`;
        break;
    }

    const res = await sql(stmt, params);
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