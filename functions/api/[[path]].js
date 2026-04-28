export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let response;
    // Pages Functions에서 호출될 때 path는 '/api/...' 형식을 유지함
    if (path === '/api/tools') {
      response = await getTools(env);
    } else if (path === '/api/site-config') {
      response = await getSiteConfig(env);
    } else if (path === '/api/blog') {
      response = await getBlogPosts(env, url);
    } else if (path.startsWith('/api/blog/')) {
      const id = path.split('/')[3];
      response = await getBlogPost(env, id);
    } else if (path === '/api/tutorial/progress') {
      response = await saveProgress(env, request);
    } else if (path.startsWith('/api/tutorial/progress/')) {
      const userId = path.split('/')[4];
      response = await getProgress(env, userId);
    } else if (path === '/api/health') {
      response = { data: { status: 'ok', timestamp: new Date().toISOString() } };
    } else {
      response = { data: { error: 'Not found' }, status: 404 };
    }

    return new Response(JSON.stringify(response.data), {
      status: response.status || 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function getTools(env) {
  const { results } = await env.DB.prepare('SELECT * FROM tools ORDER BY id').all();
  return { data: results };
}

async function getSiteConfig(env) {
  const { results } = await env.DB.prepare('SELECT * FROM site_config').all();
  const config = {};
  results.forEach(c => config[c.key] = c.value);
  return { data: config };
}

async function getBlogPosts(env, url) {
  const category = url.searchParams.get('category');
  const difficulty = url.searchParams.get('difficulty');
  let query = 'SELECT id, title, category, difficulty_level, thumbnail_url, estimated_time, created_at FROM blog_posts';
  const conditions = [];
  const params = [];

  if (category) { conditions.push('category = ?'); params.push(category); }
  if (difficulty) { conditions.push('difficulty_level = ?'); params.push(difficulty); }
  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY step_order, created_at DESC';

  const { results } = await env.DB.prepare(query).bind(...params).all();
  return { data: results };
}

async function getBlogPost(env, id) {
  const post = await env.DB.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first();
  if (!post) return { data: { error: 'Not found' }, status: 404 };
  return { data: post };
}

async function saveProgress(env, request) {
  const { user_id, post_id, completed, score } = await request.json();
  if (!user_id || !post_id) {
    return { data: { error: 'user_id and post_id required' }, status: 400 };
  }
  await env.DB.prepare(
    `INSERT INTO tutorial_progress (user_id, post_id, completed, score, updated_at)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id, post_id) DO UPDATE SET
       completed = excluded.completed,
       score = excluded.score,
       updated_at = CURRENT_TIMESTAMP`
  ).bind(user_id, post_id, completed || 0, score || 0).run();
  return { data: { success: true } };
}

async function getProgress(env, userId) {
  const { results } = await env.DB.prepare(
    `SELECT tp.*, bp.title, bp.category, bp.difficulty_level
     FROM tutorial_progress tp
     JOIN blog_posts bp ON tp.post_id = bp.id
     WHERE tp.user_id = ?
     ORDER BY tp.updated_at DESC`
  ).bind(userId).all();
  return { data: results };
}
