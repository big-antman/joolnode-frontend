const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'joolnode.db'));

// Delete existing posts
db.prepare('DELETE FROM blog_posts').run();

const posts = [
  {
    title: '[줄노드 활용 가이드] 시니어를 위한 가장 쉬운 디지털 첫걸음',
    content: '은퇴 후 새로운 도전을 꿈꾸는 시니어들을 위한 디지털 입문 가이드입니다. 복잡한 용어 대신 실생활에서 바로 쓸 수 있는 스마트폰 활용법부터 차근차근 안내합니다. 줄노드와 함께라면 디지털 세상이 더 이상 두렵지 않습니다.',
    slug: 'senior-digital-first-step',
    category: '활용 가이드',
    difficulty_level: 'beginner',
    thumbnail_url: '/blog/blog_digital_step.png',
    estimated_time: 15,
    step_order: 1
  },
  {
    title: '[대출 준비 꿀팁] 복잡한 서류, 스마트폰으로 한 번에 준비하기',
    content: '대출 신청 시 필요한 수많은 서류들, 일일이 주민센터를 방문하실 필요 없습니다. 정부24와 토스, 그리고 줄노드를 활용해 스마트폰 하나로 모든 서류를 발급받고 제출하는 노하우를 공개합니다. 심사 통과 확률을 높이는 서류 정리법도 함께 알아보세요.',
    slug: 'loan-prep-guide',
    category: '금융 팁',
    difficulty_level: 'intermediate',
    thumbnail_url: '/blog/blog_loan_prep.png',
    estimated_time: 20,
    step_order: 2
  },
  {
    title: '[금융 보안] 소중한 내 자산을 지키는 3가지 필수 보안 수칙',
    content: '보이스피싱과 스미싱이 날로 교묘해지고 있습니다. 시니어분들이 꼭 알아야 할 스마트폰 보안 설정과 모르는 번호 대응법, 그리고 안전한 금융 거래를 위한 3가지 골든 규칙을 상세히 설명해 드립니다. 자산을 지키는 가장 확실한 방법, 지금 확인하세요.',
    slug: 'financial-security-guide',
    category: '보안',
    difficulty_level: 'beginner',
    thumbnail_url: '/blog/blog_security.png',
    estimated_time: 12,
    step_order: 3
  },
  {
    title: '[디지털 건강] 눈이 편안한 스마트폰 설정과 시니어 건강 관리 앱',
    content: '오래 보면 눈이 침침해지는 스마트폰, 설정을 조금만 바꾸면 훨씬 편안하게 사용하실 수 있습니다. 글자 크기 조절부터 블루라이트 차단, 그리고 시니어 건강 관리에 꼭 필요한 혈압/혈당 기록 앱 추천까지 건강한 디지털 생활을 위한 팁을 모았습니다.',
    slug: 'digital-health-guide',
    category: '건강',
    difficulty_level: 'beginner',
    thumbnail_url: '/blog/blog_health.png',
    estimated_time: 18,
    step_order: 4
  },
  {
    title: '[줄노드의 비전] 우리가 만드는 더 나은 실버 디지털 세상',
    content: '줄노드는 단순히 앱을 만드는 곳이 아닙니다. 기술 소외 계층인 시니어들이 디지털 세상의 주역이 될 수 있도록 돕는 따뜻한 커뮤니티를 지향합니다. 2026년 줄노드가 꿈꾸는 미래와 앞으로 제공될 새로운 도구들에 대한 로드맵을 공유합니다.',
    slug: 'joolnode-vision-2026',
    category: '줄노드 소식',
    difficulty_level: 'advanced',
    thumbnail_url: '/blog/blog_vision.png',
    estimated_time: 10,
    step_order: 5
  }
];

const insert = db.prepare(`
  INSERT INTO blog_posts (title, content, slug, category, difficulty_level, thumbnail_url, estimated_time, step_order)
  VALUES (@title, @content, @slug, @category, @difficulty_level, @thumbnail_url, @estimated_time, @step_order)
`);

const insertMany = db.transaction((posts) => {
  for (const post of posts) insert.run(post);
});

insertMany(posts);

console.log('Successfully updated 5 blog posts in the database.');
db.close();
