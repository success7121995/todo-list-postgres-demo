import { neon } from '@neondatabase/serverless';

// Define a type for the environment variables
type Environment = {
  DATABASE_URL: string;
};

// Define a type for the request handler function
export const GET = async (req: Request) => {
  try {
    const env: Environment = process.env as unknown as Environment;
    const queries = new URL(req.url).searchParams;
    const sql = neon(env.DATABASE_URL);

    const categoryQueries: string[] = queries.getAll('category');
    const important: string | null = queries.get('important');
    const completed: string | null = queries.get('completed');

    let conditions: string[] = [];
    let params: string[] = [];

    // Add conditions based on 'important' and 'completed'
    if (important === 'true' || important === 'false') {
      conditions.push(`t.is_important = ${important === 'true'}`);
    }

    if (completed === 'true' || completed === 'false') {
      conditions.push(`t.is_completed = ${completed === 'true'}`);
    }

    // Handle category conditions
    if (categoryQueries.length > 0) {
      conditions.push(`(${categoryQueries.map((_, i) => `c.c_name = $${params.length + i + 1}`).join(' OR ')})`);
      params = params.concat(categoryQueries);
    } else {
      // Include uncategorized items if no category filter is applied
      conditions.push('c.c_name IS NULL');
    }

    // Construct the SQL statement with dynamic WHERE clause
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

    if (conditions.length > 0) {
      stmt += ' WHERE ' + conditions.join(' AND ');
    }

    const res = await sql(stmt, params);

    return new Response(JSON.stringify(res), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('SQL Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to execute query' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    });
  }
};