const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const multer = require('multer');
const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const app = express();
const PORT = process.env.PORT || 4000;

// ===== R2 Configuration (Cloudflare) =====
const R2_ENDPOINT = process.env.R2_ENDPOINT || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'joolnode';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || ''; // cdn.example.com

let r2Client = null;
if (R2_ENDPOINT && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY) {
  r2Client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
  console.log('R2 client initialized');
} else {
  console.log('R2 not configured - set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY');
}

// Multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/zip',
      'application/x-msdownload', 'application/octet-stream',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type: ' + file.mimetype), false);
    }
  },
});

app.use(cors());
app.use(express.json());

const CSP_CONNECT_SRC = process.env.CSP_CONNECT_SRC || 'https://joolnode.com https://blog.joolnode.com';
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com; font-src 'self'; connect-src 'self' " + CSP_CONNECT_SRC + "; frame-src 'none';");
  next();
});

const db = new Database(path.join(__dirname, 'joolnode.db'));
db.pragma('journal_mode = WAL');

db.exec([
  'CREATE TABLE IF NOT EXISTS tools (',
  '  id INTEGER PRIMARY KEY AUTOINCREMENT,',
  '  name TEXT NOT NULL,',
  '  description TEXT,',
  '  status TEXT CHECK(status IN (\'active\', \'coming_soon\', \'development\')) DEFAULT \'development\',',
  '  icon TEXT,',
  '  link TEXT,',
  '  features TEXT,',
  '  created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
  ');',
  '',
  'CREATE TABLE IF NOT EXISTS site_config (',
  '  key TEXT PRIMARY KEY,',
  '  value TEXT',
  ');',
  '',
  'CREATE TABLE IF NOT EXISTS blog_posts (',
  '  id INTEGER PRIMARY KEY AUTOINCREMENT,',
  '  title TEXT NOT NULL,',
  '  content TEXT,',
  '  slug TEXT UNIQUE,',
  '  category TEXT,',
  '  difficulty_level TEXT CHECK(difficulty_level IN (\'beginner\', \'intermediate\', \'advanced\')) DEFAULT \'beginner\',',
  '  thumbnail_url TEXT,',
  '  estimated_time INTEGER,',
  '  step_order INTEGER,',
  '  created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
  ');',
  '',
  'CREATE TABLE IF NOT EXISTS tutorial_progress (',
  '  id INTEGER PRIMARY KEY AUTOINCREMENT,',
  '  user_id TEXT NOT NULL,',
  '  post_id INTEGER NOT NULL,',
  '  completed INTEGER DEFAULT 0,',
  '  score INTEGER DEFAULT 0,',
  '  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,',
  '  UNIQUE(user_id, post_id)',
  ');',
  '',
  'CREATE TABLE IF NOT EXISTS uploaded_files (',
  '  id INTEGER PRIMARY KEY AUTOINCREMENT,',
  '  filename TEXT NOT NULL,',
  '  original_name TEXT NOT NULL,',
  '  mime_type TEXT,',
  '  size INTEGER,',
  '  r2_key TEXT NOT NULL UNIQUE,',
  '  r2_url TEXT,',
  '  created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
  ');'
].join('\n'));

// 최초 실행 시에만 시드 데이터 삽입 (데이터 보존)
const toolCount = db.prepare('SELECT COUNT(*) AS cnt FROM tools').get();
if (toolCount.cnt === 0) {
  console.log('[Seed] 초기 tools 데이터 삽입...');
  db.prepare("INSERT INTO tools (name, description, status, icon, link, features) VALUES ('화면 캡처 도구', '오픈소스를 이용하여 만든 캡처도구입니다. <br/> 다운로드하여 연습해보세요', 'active', '/capture-tool.png', '#', '[]'), ('돋보기 도구', '화면의 작은 글씨를 크게 확대해서 볼 수 있는 도구입니다.', 'development', '/magnifier-tool.png', '#', '[\"최대 10배 확대\", \"화면 고정 기능\"]'), ('약 알람 도구', '매일 먹는 약 시간을 잊지 않게 도와주는 알람 도구입니다.', 'development', '/medication-tool.png', '#', '[\"음성 안내\", \"대형 알람 버튼\"]')").run();
  console.log('[Seed] tools 데이터 삽입 완료');
}

const configCount = db.prepare('SELECT COUNT(*) AS cnt FROM site_config').get();
if (configCount.cnt === 0) {
  console.log('[Seed] 초기 site_config 데이터 삽입...');
  db.prepare("INSERT INTO site_config (key, value) VALUES ('site_name', 'JOOLnode'), ('support_info', '쿠팡 파트너스 등 후원 안내')").run();
  console.log('[Seed] site_config 데이터 삽입 완료');
}

const blogCount = db.prepare('SELECT COUNT(*) AS cnt FROM blog_posts').get();
if (blogCount.cnt === 0) {
  console.log('[Seed] 초기 blog_posts 데이터 삽입...');
  db.prepare("INSERT INTO blog_posts (title, content, slug, category, difficulty_level, thumbnail_url, estimated_time, step_order) VALUES ('[시니어 앱 개발] 첫걸음: 아이디어를 현실로 만드는 방법', '은퇴 후 새로운 도전을 꿈꾸는 시니어들을 위한 앱 개발 입문 가이드. 복잡한 개발 환경 대신 누구나 쉽게 접근할 수 있는 노코드/로우코드 도구부터 시작해 보세요.', 'senior-app-dev-first-step', '시작하기', 'beginner', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', 15, 1), ('[UI/UX 디자인] 시니어를 위한 인터페이스 디자인 원칙', '시니어 사용자를 위한 앱 디자인 시 고려해야 할 핵심 원칙들을 소개합니다. 가독성 높은 폰트 선택, 충분한 대비도, 직관적인 내비게이션까지 실무 가이드를 제공합니다.', 'senior-ux-design-principles', '디자인', 'intermediate', 'https://images.unsplash.com/photo-1586717791821-3f44a563fece?w=400', 20, 2), ('[테스트 앱 만들기] 간단한 투두 리스트 앱 개발하기', '실제 코드 작성 없이도 시니어분들이 직접 만들어볼 수 있는 간단한 투두 리스트 앱 개발 튜토리얼입니다. 기획부터 디자인, 데이터 저장까지 직접 경험해 보세요.', 'todo-list-app-tutorial', '튜토리얼', 'beginner', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400', 25, 3), ('[도구 활용] 노코드 플랫폼으로 앱 빠르게 만들기', '버블(Bubble), 아달로(Adalo), 글라이드 등 인기 있는 노코드 플랫폼들을 비교 분석하고, 시니어에게 맞는 개발 방법을 소개합니다.', 'nocode-platform-guide', '도구 활용', 'intermediate', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400', 18, 4), ('[배포와 공유] 나의 앱을 세상에 알리기', '완성한 앱을 실제 서비스로 배포하고 다른 사람들과 공유하는 방법을 안내합니다. 테스트 방법, 피드백 수집 과정을 차근차근 따라해 보세요.', 'app-deployment-guide', '배포와 공유', 'advanced', 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400', 30, 5)").run();
  console.log('[Seed] blog_posts 데이터 삽입 완료');
}

// API Routes
app.get('/api/tools', (req, res) => {
  const tools = db.prepare('SELECT * FROM tools ORDER BY id').all();
  res.json(tools);
});

app.get('/api/tools/:id', (req, res) => {
  const tool = db.prepare('SELECT * FROM tools WHERE id = ?').get(req.params.id);
  if (!tool) return res.status(404).json({ error: 'Not found' });
  res.json(tool);
});

app.get('/api/site-config', (req, res) => {
  const configs = db.prepare('SELECT * FROM site_config').all();
  const result = {};
  configs.forEach(c => result[c.key] = c.value);
  res.json(result);
});

app.get('/api/blog', (req, res) => {
  const { category, difficulty } = req.query;
  let query = 'SELECT id, title, slug, category, difficulty_level, thumbnail_url, estimated_time, content as excerpt, created_at FROM blog_posts';
  const conditions = [];
  const params = [];

  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  if (difficulty) {
    conditions.push('difficulty_level = ?');
    params.push(difficulty);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY step_order, created_at DESC';

  const posts = db.prepare(query).all(...params);
  res.json(posts);
});

app.get('/api/blog/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

app.post('/api/tutorial/progress', (req, res) => {
  const { user_id, post_id, completed, score } = req.body;
  if (!user_id || !post_id) {
    return res.status(400).json({ error: 'user_id and post_id required' });
  }

  db.prepare("INSERT INTO tutorial_progress (user_id, post_id, completed, score, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(user_id, post_id) DO UPDATE SET completed = excluded.completed, score = excluded.score, updated_at = CURRENT_TIMESTAMP").run(user_id, post_id, completed || 0, score || 0);

  res.json({ success: true });
});

app.get('/api/tutorial/progress/:user_id', (req, res) => {
  const progress = db.prepare("SELECT tp.*, bp.title, bp.category, bp.difficulty_level FROM tutorial_progress tp JOIN blog_posts bp ON tp.post_id = bp.id WHERE tp.user_id = ? ORDER BY tp.updated_at DESC").all(req.params.user_id);
  res.json(progress);
});

// R2 File Upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!r2Client) {
    return res.status(503).json({ error: 'R2 not configured' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    const timestamp = Date.now();
    const safeName = timestamp + '-' + req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const r2Key = 'uploads/' + safeName;

    await r2Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ContentLength: req.file.size,
    }));

    const r2Url = R2_PUBLIC_URL
      ? R2_PUBLIC_URL + '/' + r2Key
      : R2_ENDPOINT + '/' + R2_BUCKET_NAME + '/' + r2Key;

    db.prepare("INSERT INTO uploaded_files (filename, original_name, mime_type, size, r2_key, r2_url) VALUES (?, ?, ?, ?, ?, ?)").run(safeName, req.file.originalname, req.file.mimetype, req.file.size, r2Key, r2Url);

    res.json({
      success: true,
      url: r2Url,
      key: r2Key,
      filename: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    console.error('R2 upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

app.get('/api/uploads', (req, res) => {
  const files = db.prepare('SELECT * FROM uploaded_files ORDER BY created_at DESC').all();
  res.json(files);
});

app.delete('/api/uploads/:id', (req, res) => {
  const file = db.prepare('SELECT * FROM uploaded_files WHERE id = ?').get(req.params.id);
  if (!file) return res.status(404).json({ error: 'Not found' });

  db.prepare('DELETE FROM uploaded_files WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'File record deleted' });
});

app.put('/api/tools/:id/download', (req, res) => {
  const { downloadUrl } = req.body;
  if (!downloadUrl) return res.status(400).json({ error: 'downloadUrl required' });

  db.prepare('UPDATE tools SET link = ? WHERE id = ?').run(downloadUrl, req.params.id);
  res.json({ success: true });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    r2_configured: !!r2Client,
    timestamp: new Date().toISOString(),
  });
});

app.get(/^\/.well-known\/.*/, (req, res) => {
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log('JOOLnode backend running on http://localhost:' + PORT);
});
