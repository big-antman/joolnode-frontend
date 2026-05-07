-- Schema
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

-- Seed Data
INSERT INTO tools (name, description, status, icon, link) VALUES
('화면 캡처 도구', '간편하게 화면을 캡처하고 저장합니다.', 'active', '📸', '#'),
('쉬운 복약 알림', '약 먹을 시간을 알려드립니다.', 'coming_soon', '💊', '#'),
('큰 글씨 돋보기', '화면을 확대해서 보여줍니다.', 'development', '🔍', '#');

INSERT INTO site_config (key, value) VALUES
('site_name', 'JOOLnode'),
('footer_text', '시니어를 위한 앱 개발, 저희가 함께 하겠습니다!'),
('support_info', '쿠팡 파트너스 등 후원 안내');

INSERT INTO blog_posts (title, content, category, difficulty_level, thumbnail_url, estimated_time, step_order) VALUES
('[아키텍처] 마이크로서비스 vs 모놀리스: 우리 팀에 맞는 선택은?', '단순한 유행이 아닌, 비즈니스 규모와 팀 구조에 따른 선택 기준을 제시합니다...', 'Architecture', 'intermediate', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400', 15, 1),
('[성능 최적화] 10배 성장을 위한 관측성(Observability): 로그 그 이상을 넘어', '분산 트레이싱과 메트릭 수집을 통한 병목 지점 파악 기법에 대해 심도있게 다룹니다...', 'DevOps', 'advanced', 'https://images.unsplash.com/photo-1551288049-bbbda536639a?w=400', 20, 2),
('[소프트 스킬] 성장을 돕는 코드 리뷰의 기술: 지적이 아닌 협업으로', '시니어로서 주니어의 성장을 돕고 코드 품질을 높이는 리뷰 문화에 대해 이야기합니다...', 'Soft Skills', 'beginner', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400', 10, 3);
