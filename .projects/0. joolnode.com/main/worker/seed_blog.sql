-- Blog Posts Seed Data
INSERT INTO blog_posts (title, content, slug, category, difficulty_level, thumbnail_url, estimated_time, step_order) VALUES 
('[시니어 앱 개발] 첫걸음: 아이디어를 현실로 만드는 방법', '은퇴 후 새로운 도전을 꿈꾸는 시니어들을 위한 앱 개발 입문 가이드. 복잡한 개발 환경 대신 누구나 쉽게 접근할 수 있는 노코드/로우코드 도구부터 시작해 보세요.', 'senior-app-dev-first-step', '시작하기', 'beginner', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', 15, 1), 
('[UI/UX 디자인] 시니어를 위한 인터페이스 디자인 원칙', '시니어 사용자를 위한 앱 디자인 시 고려해야 할 핵심 원칙들을 소개합니다. 가독성 높은 폰트 선택, 충분한 대비도, 직관적인 내비게이션까지 실무 가이드를 제공합니다.', 'senior-ux-design-principles', '디자인', 'intermediate', 'https://images.unsplash.com/photo-1586717791821-3f44a563fece?w=400', 20, 2), 
('[테스트 앱 만들기] 간단한 투두 리스트 앱 개발하기', '실제 코드 작성 없이도 시니어분들이 직접 만들어볼 수 있는 간단한 투두 리스트 앱 개발 튜토리얼입니다. 기획부터 디자인, 데이터 저장까지 직접 경험해 보세요.', 'todo-list-app-tutorial', '튜토리얼', 'beginner', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400', 25, 3), 
('[도구 활용] 노코드 플랫폼으로 앱 빠르게 만들기', '버블(Bubble), 아달로(Adalo), 글라이드 등 인기 있는 노코드 플랫폼들을 비교 분석하고, 시니어에게 맞는 개발 방법을 소개합니다.', 'nocode-platform-guide', '도구 활용', 'intermediate', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400', 18, 4), 
('[배포와 공유] 나의 앱을 세상에 알리기', '완성한 앱을 실제 서비스로 배포하고 다른 사람들과 공유하는 방법을 안내합니다. 테스트 방법, 피드백 수집 과정을 차근차근 따라해 보세요.', 'app-deployment-guide', '배포와 공유', 'advanced', 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400', 30, 5)
ON CONFLICT(slug) DO NOTHING;
