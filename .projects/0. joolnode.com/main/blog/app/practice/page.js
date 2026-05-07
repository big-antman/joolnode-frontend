'use client';

import { useState, useEffect } from 'react';
import styles from './practice.module.css';

// API 기본 URL (개발: http://localhost:4000, 프로덕션: https://api.joolnode.com)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * 실습하기 페이지
 * 개발 앱 및 테스트 도구 다운로드, 세로형 카드
 */
export default function PracticePage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useState(null);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        console.log('📡 Fetching tools from:', `${API_BASE_URL}/api/tools`);
        const response = await fetch(`${API_BASE_URL}/api/tools`);
        if (!response.ok) throw new Error('데이터를 불러오지 못했습니다.');
        const data = await response.json();
        
        console.log('✅ Data received:', data.length, 'tools');
        // Parse features JSON string
        const parsedData = data.map(tool => ({
          ...tool,
          features: tool.features ? JSON.parse(tool.features) : []
        }));
        
        // 메인 페이지와 동일하게 상위 3개만 표시
        setTools(parsedData.slice(0, 3));
      } catch (err) {
        console.error('❌ Error fetching tools:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleDownload = () => {
    setToastVisible(true);
    if (toastTimerRef[0]) clearTimeout(toastTimerRef[0]);
    toastTimerRef[0] = setTimeout(() => setToastVisible(false), 3500);
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}></div>
      <p>도구 목록을 불러오는 중...</p>
    </div>
  );

  if (error) return (
    <div className={styles.errorContainer}>
      <p>❌ {error}</p>
      <button onClick={() => window.location.reload()} className={styles.retryBtn}>다시 시도</button>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Hero Section - 3D Illustration Theme */}
      <section className={styles.heroSection}>
        <div className={styles.innerContainer}>
          <div className={styles.heroContent}>
            <img 
              src="/download-hero-3d.png" 
              alt="Download Hero" 
              className={styles.heroIllustration}
            />
            <header className={styles.header}>
              <h1 className={styles.title}>다운로드</h1>
              <p className={styles.subtitle}>
                개발 앱과 테스트 도구를 다운로드하여 <br /> 직접 연습해보세요.
              </p>
            </header>
          </div>
        </div>
      </section>

      {/* Main Tools Section */}
      <main className={styles.main}>
        <div className={styles.innerContainer}>
          <div className={styles.toolGrid}>
            {tools.map((tool, index) => {
              const isActive = tool.status === 'active';
              
              // 메인 페이지와 동일한 아이콘 로직
              let toolIconSrc;
              if (isActive) {
                toolIconSrc = tool.icon || '/placeholder-1.png';
              } else {
                const placeholderNum = (index % 2) + 1;
                toolIconSrc = `/placeholder-${placeholderNum}.png`;
              }
              
              return (
                <article key={tool.id} className={`${styles.toolCard} ${!isActive ? styles.disabled : ''}`}>
                  <div className={styles.toolIcon}>
                    <img src={toolIconSrc} alt={tool.name} className={styles.toolIconImg} />
                  </div>
                  <div className={styles.toolBody}>
                    {isActive ? (
                      <>
                        <h2 className={styles.toolName}>{tool.name}</h2>
                        <p 
                          className={styles.toolDescription}
                          dangerouslySetInnerHTML={{ __html: tool.description }}
                        />
                        
                        {tool.features && tool.features.length > 0 && (
                          <div className={styles.featureList}>
                            <h3 className={styles.featureTitle}>주요 기능</h3>
                            <ul>
                              {tool.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className={styles.toolFooter}>
                          <button
                            className={styles.downloadBtn}
                            onClick={() => handleDownload()}
                          >
                            다운로드
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className={styles.placeholderContent}>
                        <span className={styles.placeholderText}>준비 중</span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      {/* Tool Usage Section - Wide Bento Infographic */}
      <section className={styles.infoSection}>
        <div className={styles.innerContainer}>
          <div className={styles.infoContainer}>
            {/* New Section Header with Left Text / Right Image */}
            <div className={styles.sectionTitleArea}>
              <div className={styles.titleLeft}>
                <h2>도구 사용 안내</h2>
                <p className={styles.description}>
                  줄노드의 모든 도구는 어르신들도 쉽고 안전하게 사용하실 수 있도록 설계되었습니다.<br />
                  아래 안내를 참고하여 실습을 시작해 보세요.
                </p>
              </div>
              <div className={styles.titleRight}>
                <img src="/tool_download(2).png" alt="JOOLnode House" className={styles.sectionMainImage} />
              </div>
            </div>
            
            <div className={styles.infoGrid}>
              {/* 1. 설치 가이드 */}
              <div className={styles.infoCard}>
                <div className={styles.infoCardText}>
                  <span className={styles.cardTag}>Step 01. 안전한 설치</span>
                  <h3>1. 설치 가이드</h3>
                  <ul className={styles.subList}>
                    <li>
                      <strong>파일 받기</strong>
                      '다운로드' 버튼을 클릭하면 설치 파일이 내 컴퓨터에 저장됩니다.
                    </li>
                    <li>
                      <strong>실행하기</strong>
                      내려받은 파일을 더블 클릭하여 실행해 주세요.
                    </li>
                    <li>
                      <strong>보안 확인</strong>
                      '추가 정보' {'>'} '실행' 버튼을 클릭해 주세요.<br />
                      (줄노드 프로그램은 안전합니다.)
                    </li>
                  </ul>
                </div>
                <div className={styles.cardVisualContainer}>
                  <div className={styles.cardGlow}></div>
                  <img src="/tool_setup.png" alt="Setup Guide" className={styles.cardVisual} />
                </div>
              </div>

              {/* 2. 꼭 확인해 주세요! */}
              <div className={styles.infoCard}>
                <div className={styles.infoCardText}>
                  <span className={styles.cardTag}>Step 02. 안심 사용</span>
                  <h3>2. 꼭 확인해 주세요!</h3>
                  <ul className={styles.subList}>
                    <li>
                      <strong>비용 안내</strong>
                      본 프로그램은 완전 무료 도구이며, 결제가 발생하지 않습니다.
                    </li>
                    <li>
                      <strong>인터넷 연결</strong>
                      정상 작동을 위해 인터넷이 연결된 상태에서 실행해 주세요.
                    </li>
                  </ul>
                </div>
                <div className={styles.cardVisualContainer}>
                  <div className={styles.cardGlow}></div>
                  <img src="/tool_check.png" alt="Check Guide" className={styles.cardVisual} />
                </div>
              </div>

              {/* 3. 도움이 필요하신가요? */}
              <div className={styles.infoCard}>
                <div className={styles.infoCardText}>
                  <span className={styles.cardTag}>Step 03. 실시간 지원</span>
                  <h3>3. 도움이 필요하신가요?</h3>
                  <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
                    사용 중 궁금한 점이 생기면<br />
                    언제든 <a href="/contact">문의하기</a>로 연락해 주세요.
                  </p>
                </div>
                <div className={styles.cardVisualContainer}>
                  <div className={styles.cardGlow}></div>
                  <img src="/tool_help.png" alt="Help Guide" className={styles.cardVisual} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 다운로드 토스트 */}
      {toastVisible && (
        <div className={styles.downloadToast}>
          이 도구는 14장 오픈소스 활용하기 편에서 무료로 제공됩니다.
        </div>
      )}
    </div>
  );
}
