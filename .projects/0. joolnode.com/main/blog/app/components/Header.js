import Link from 'next/link';

// 메인 사이트 URL (개발: http://localhost:5174, 프로덕션: https://joolnode.com)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://joolnode.com';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <Link href={SITE_URL} className="logo">
          <img src="/logo.svg" alt="JOOLnode 로고" className="logo-icon" />
          <span className="logo-text">JOOLnode 줄노드</span>
        </Link>
        <nav className="main-nav">
          <ul>
            <li><a href={`${SITE_URL}#hero`}>처음으로</a></li>
            <li><Link href="/">블로그</Link></li>
            <li><Link href="/practice">다운로드</Link></li>
            <li><Link href="/contact">문의하기</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
