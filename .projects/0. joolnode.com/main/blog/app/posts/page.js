import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import styles from './posts.module.css';

// 메타데이터 설정
export const metadata = {
  title: '공부하기 — JOOLnode',
  description: 'JOOLnode의 다양한 기술 자료와 학습 콘텐츠를 확인하세요.',
};

/**
 * 블로그 포스트 목록 페이지 (공부하기)
 * 1줄에 가로형 카드 1개, 최신글 상단
 */
export default function PostsPage() {
  // 모든 포스트 데이터 가져오기 (최신순)
  const posts = getAllPosts();
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          지금 바로 시작하기
        </h1>
        <p className={styles.subtitle}>
          다양한 기술 자료와 학습 콘텐츠를 함께 나눕니다
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
                      <div className={styles.postThumb}>
                        <div className={styles.thumbPlaceholder}></div>
                      </div>
                      
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
                        
                        <span className={styles.readMore}>
                          자세히 보기 →
                        </span>
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
                          <img src="/ad-placeholder.svg" alt="추천 상품" className={styles.cardThumb} style={{ opacity: 0.5 }} />
                        </div>
                        <div className={styles.postContent}>
                          <h2 className={styles.postTitle}>시니어를 위한 특별 추천 상품</h2>
                          <p className={styles.postDescription}>
                            줄노드가 엄선한 시니어 맞춤형 IT 기기와 도구들을 지금 쿠팡에서 확인해보세요.
                          </p>
                          <span className={styles.readMore} style={{ color: '#007aff' }}>
                            쿠팡에서 보기 →
                          </span>
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