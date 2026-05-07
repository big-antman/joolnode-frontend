CREATE TABLE IF NOT EXISTS tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK(status IN ('active', 'coming_soon', 'development')) DEFAULT 'development',
  icon TEXT,
  link TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  slug TEXT UNIQUE,
  category TEXT,
  difficulty_level TEXT CHECK(difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  thumbnail_url TEXT,
  estimated_time INTEGER,
  step_order INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tutorial_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  post_id INTEGER NOT NULL,
  completed INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, post_id)
);

-- Seed data
INSERT INTO tools (name, description, status, icon, link) VALUES
  ('화면 캡처 도구', '강의용 혹은 실습용으로 사용하는<br/>화면 캡처도구입니다.<br/>다운로드하여 연습해보세요.', 'active', '/capture-tool.png', 'https://blog.joolnode.com/practice'),
  ('쉬운 복약 알림', '준비 중인 도구입니다.', 'coming_soon', '💊', '#'),
  ('큰 글씨 돋보기', '준비 중인 도구입니다.', 'coming_soon', '🔍', '#')
ON CONFLICT DO NOTHING;

INSERT INTO site_config (key, value) VALUES
  ('site_name', 'JOOLnode'),
  ('footer_text', '시니어를 위한 앱 개발, 저희가 함께 하겠습니다!'),
  ('support_info', '쿠팡 파트너스 등 후원 안내')
ON CONFLICT DO NOTHING;