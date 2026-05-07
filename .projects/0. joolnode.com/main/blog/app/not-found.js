import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      maxWidth: '600px',
      margin: '4rem auto',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 700,
        color: '#2D2D2D',
        marginBottom: '1rem',
      }}>
        포스트를 찾을 수 없습니다
      </h1>
      <p style={{
        fontSize: '1.1rem',
        color: '#666666',
        lineHeight: 1.6,
        marginBottom: '2rem',
      }}>
        요청하신 포스트가 존재하지 않거나 삭제되었습니다.
      </p>
      <Link href="/posts" style={{
        display: 'inline-block',
        padding: '0.75rem 1.5rem',
        background: '#00A651',
        color: 'white',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 600,
      }}>
        ← 블로그 목록으로 돌아가기
      </Link>
    </div>
  );
}
