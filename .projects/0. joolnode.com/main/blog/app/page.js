import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import styles from './posts/posts.module.css';

// 메타데이터 설정
export const metadata = {
  title: '공부하기 - 줄노드',
  description: '시니어를 위한 앱 개발, 다양한 기술 자료와 학습 콘텐츠를 함께 나눕니다.',
};

/**
 * JOOLnode 블로그 메인 페이지 (공부하기 목록으로 대체)
 * 사용자가 '공부하기'를 눌렀을 때 가장 먼저 보게 되는 학습 자료 목록입니다.
 */
export default function Home() {
  // 모든 포스트 데이터 가져오기 (최신순)
  const posts = getAllPosts();
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          지금 바로 시작하기
        </h1>
        <p className={styles.subtitle}>
          시니어를 위한 앱 개발 이야기와 다양한 기술 자료를 함께 나눕니다
        </p>
      </header>
      
      <main className={styles.main}>
        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p>아직 게시된 포스트가 없습니다.</p>
            <p>곧 다양한 콘텐츠를 준비하겠습니다.</p>
          </div>
        ) : (
          <div className={styles.postList}>
            {posts.map((post, index) => (
              <div key={post.slug} style={{ display: 'contents' }}>
                <article className={styles.postCard}>
                  <Link href={`/posts/${post.slug}`} className={styles.postLink}>
                    <div className={styles.postCardInner}>
                      {/* 썸네일 영역 (좌측) */}
                      <div className={styles.postThumb}>
                        <div className={styles.thumbPlaceholder}></div>
                      </div>
                      
                      {/* 콘텐츠 영역 (우측) */}
                      <div className={styles.postContent}>
                        <h2 className={styles.postTitle}>
                          <span className={styles.chapterNumber}>{index + 1}장</span>
                          {post.title.replace(/[\[\]]/g, ' ')}
                        </h2>
                        
                        {post.description && (
                          <p className={styles.postDescription}>
                            {post.description}
                          </p>
                        )}
                        
                        <div className={styles.readMore}>
                          자세히 보기 
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>

                {/* 3번째 포스트마다 광고 슬롯 삽입 */}
                {(index + 1) % 3 === 0 && (
                  <article className={styles.postCard}>
                    <a href="https://link.coupang.com/..." target="_blank" rel="noopener noreferrer" className={styles.postLink}>
                      <div className={styles.postCardInner}>
                        <div className={styles.postThumb} style={{ background: '#f8f9fa' }}>
                          <div className={styles.adPlaceholder}></div>
                        </div>
                        <div className={styles.postContent}>
                          <h2 className={styles.postTitle}>시니어를 위한 특별 추천 상품</h2>
                          <p className={styles.postDescription}>
                            줄노드가 엄선한 시니어 맞춤형 IT 기기와 도구들을 지금 쿠팡에서 확인해보세요.
                          </p>
                          <div className={styles.readMore} style={{ color: '#007aff' }}>
                            쿠팡에서 보기 →
                          </div>
                        </div>
                      </div>
                    </a>
                  </article>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
