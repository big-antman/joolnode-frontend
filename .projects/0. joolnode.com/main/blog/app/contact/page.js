'use client';

import { useState, useEffect } from 'react';
import styles from './contact.module.css';

/**
 * 문의하기 페이지 — 3D 벤토 레이아웃 리뉴얼
 * 프리미엄 디자인 시스템 동기화 및 Formspree 연동
 */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // 컴포넌트 마운트 시 모바일 여부 확인
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 계좌 정보 (크롤링 방지를 위해 분산 보관 및 동적 결합)
  const bankName = "토스뱅크";
  const accNum = ["1002", "0372", "7325"];
  const fullAccount = `${bankName} ${accNum.join('-')}`;

  // Formspree 폼 엔드포인트
  const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || '';

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(fullAccount);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    if (!FORMSPREE_ENDPOINT) {
      setStatus('error');
      setErrorMsg('문의 시스템 준비 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const data = await response.json();
        setStatus('error');
        setErrorMsg(data.error || '전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.innerContainer}>
          <div className={styles.heroContent}>
            <img 
              src="/tool_help.png" 
              alt="Contact Help" 
              className={styles.heroIllustration}
            />
            <header>
              <h1 className={styles.title}>문의하기</h1>
              <p className={styles.subtitle}>
                궁금한 점이나 제안이 있으신가요?<br />
                줄노드가 정성껏 답변해 드릴게요.
              </p>
            </header>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <main className={styles.mainSection}>
        <div className={styles.innerContainer}>
          <div className={styles.formCard}>
            {status === 'success' ? (
              <div className={styles.successBox}>
                <h2 className={styles.successTitle}>소중한 의견 감사합니다!</h2>
                <p className={styles.successText}>
                  문의 내용이 성공적으로 전달되었습니다.
                </p>
                <button
                  className={styles.resetButton}
                  onClick={() => setStatus('idle')}
                >
                  새로운 문의 보내기
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="name">성함</label>
                  <input
                    className={styles.input}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="이름을 입력해 주세요"
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="email">
                    이메일 주소 <span className={styles.required}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="답변을 받으실 이메일을 입력해 주세요"
                    required
                  />
                </div>

                {/* Honeypot Field for Spam Protection */}
                <input type="text" name="_gotcha" style={{ display: 'none' }} />

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="subject">문의 제목</label>
                  <input
                    className={styles.input}
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="어떤 점이 궁금하신가요?"
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="message">
                    문의 내용 <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    className={styles.textarea}
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="내용을 자세히 적어주시면 더 정확한 답변이 가능합니다"
                    required
                  />
                </div>

                {status === 'error' && (
                  <div className={styles.errorBox}>
                    <span>⚠️</span> {errorMsg}
                  </div>
                )}

                <button
                  className={styles.submitButton}
                  type="submit"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? '보내는 중...' : '문의 보내기'}
                </button>

                <p className={styles.privacyNote}>
                  개인정보는 문의 답변 목적으로만 활용되며 안전하게 처리됩니다.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Donation Section */}
      <section className={styles.donationSection}>
        <div className={styles.innerContainer}>
          <header className={styles.donationHeader}>
            <h2 className={styles.donationTitle}>후원하기</h2>
            <div className={styles.donationSubtitles}>
              <p>줄노드가 계속 나아갈 수 있도록 <br /> 함께해 주세요.</p>
              <p>여러분의 후원이 큰 힘이 됩니다.</p>
            </div>
            <hr className={styles.divider} />
          </header>

          <div className={styles.donationContent}>
            {/* 후원자 혜택 카드 */}
            <div className={styles.benefitCard}>
              <span className={styles.benefitTag}>후원자 혜택</span>
              <p className={styles.benefitText}>
                줄노드는 무료 강의와 앱 배포를 <br /> 직접 만들고 운영하고 있습니다.<br />
                수익 없이 운영되는 채널이라 <br /> 후원이 큰 힘이 됩니다.<br />
                후원해 주신 분께는 문의 답변, <br /> 강의 주제 선정, 툴 요청을 <br /> 우선으로 반영해 드리고 있어요.<br />
                작은 성의지만, <br /> 고마운 마음은 꼭 전하고 싶습니다.
              </p>
            </div>

            {/* 후원 액션 영역 (QR 코드 토글 포함) */}
            <div className={styles.donationActionsWrapper}>
              <div className={styles.actionCards}>
                <a 
                  href={isMobile ? "supertoss://send?amount=0&bank=%ED%86%A0%EC%8A%A4%EB%B1%85%ED%81%AC&accountNo=100203727325&origin=qr" : "#"}
                  className={`${styles.actionCard} ${showQR ? styles.active : ''}`}
                  onClick={(e) => {
                    if (!isMobile) {
                      e.preventDefault();
                      setShowQR(!showQR);
                    }
                  }}
                >
                  <div className={styles.actionIcon}>
                    <div className={styles.tossIcon}>T</div>
                  </div>
                  <div className={styles.actionInfo}>
                    <span className={styles.actionMain}>토스로 후원하기</span>
                    <span className={styles.actionSub}>{isMobile ? "토스앱으로 간편하게" : "QR 코드로 간편하게"}</span>
                  </div>
                  <span className={styles.arrowIcon}>›</span>
                </a>

                <button className={styles.actionCard} onClick={handleCopyAccount}>
                  <div className={styles.actionIcon}>
                    <div className={styles.bankIcon}>계좌</div>
                  </div>
                  <div className={styles.actionInfo}>
                    <span className={styles.actionMain}>계좌 복사하기</span>
                    <span className={styles.actionSub}>직접 송금으로 후원</span>
                  </div>
                  <span className={styles.arrowIcon}>›</span>
                </button>

                {showToast && (
                  <div className={styles.contextToast}>
                    계좌가 복사되었습니다
                  </div>
                )}
              </div>

              {/* QR 코드 표시 영역 (PC 전용) */}
              {!isMobile && showQR && (
                <div className={styles.qrContainer}>
                  <img src="/toss_qr.png" alt="Toss QR Code" className={styles.qrImage} />
                  <p className={styles.qrNote}>앱에서 QR을 스캔해 주세요</p>
                </div>
              )}
            </div>

            {/* 하단 강조 안내 */}
            <div className={styles.bottomGuide}>
              <p>
                후원 후 문의하기에 <br />
                후원자님의 성함을 동일하게 남겨 주시면 <br />
                우선 안내해 드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
