import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
import Link from 'next/link';
import styles from './slug.module.css';

// 정적 생성되지 않은 slug에 대해서도 동적 처리
export const dynamicParams = false;

// 동적 메타데이터 생성
export async function generateMetadata(props) {
  // Next.js 16: params is a Promise, must await
  const resolvedParams = await props.params;
  const { slug } = resolvedParams;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다 — JOOLnode',
    };
  }
  
  return {
    title: `${post.title} — JOOLnode`,
    description: post.description || 'JOOLnode 블로그 포스트',
  };
}

// 정적 생성할 파라미터 반환 (모든 slug에 대해 정적으로 생성)
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.params.slug,
  }));
}

/**
 * 블로그 포스트 상세 페이지
 * URL 파라미터에서 slug를 가져와서 마크다운 파일 렌더링
 */
export default async function PostPage(props) {
  // Next.js 16: params is a Promise, must await
  const resolvedParams = await props.params;
  const { slug } = resolvedParams;
  
  const post = await getPostBySlug(slug);
  
  // 포스트가 없으면 직접 404 UI 반환
  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>포스트를 찾을 수 없습니다</h1>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          요청하신 포스트가 존재하지 않거나 삭제되었습니다.
        </p>
        <Link href="/posts" style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0070f3',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none'
        }}>
          ← 블로그 목록으로
        </Link>
      </div>
    );
  }
  
  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <Link href="/posts" className={styles.backLink}>
          ← 블로그 목록
        </Link>
        
        <div className={styles.meta}>
          <span className={`${styles.badge} ${styles[post.category] || ''}`}>
            {post.category || 'general'}
          </span>
          <time className={styles.date} dateTime={post.date}>
            {post.date}
          </time>
        </div>
        
        <h1 className={styles.title}>{post.title}</h1>
        
        {post.thumbnail_url && (
          <div className={styles.heroImage}>
            <img src={post.thumbnail_url} alt={post.title} />
          </div>
        )}

        {post.description && (
          <p className={styles.description}>{post.description}</p>
        )}
      </header>
      
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
      
      <footer className={styles.footer}>
        <Link href="/posts" className={styles.backToList}>
          ← 모든 포스트 보기
        </Link>
      </footer>
    </article>
  );
}