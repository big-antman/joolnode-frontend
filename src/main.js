import './style.css'

// 환경변수: Vite는 import.meta.env로 접근 (개발: /api, 프로덕션: https://api.joolnode.com)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
// 블로그 URL (개발: http://localhost:3001, 프로덕션: https://blog.joolnode.com)
const BLOG_URL = import.meta.env.VITE_BLOG_URL || 'http://localhost:3001';

// Scroll Reveal Logic with improved performance
const revealOnScroll = () => {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
};

// Enhanced smooth scroll for navigation (헤더 높이 보정)
const initSmoothScroll = () => {
  const headerHeight = 70; // 헤더 높이 (padding 포함)
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
};

async function fetchAndRenderSiteConfig() {
  try {
    const response = await fetch(`${API_BASE_URL}/site-config`);
    const config = await response.json();
  } catch (error) {
    console.error('Failed to fetch site config:', error);
  }
}

async function fetchAndRenderTools() {
  const toolListContainer = document.getElementById('tool-list');
  if (!toolListContainer) return;

  try {
    const response = await fetch(`${API_BASE_URL}/tools`);
    const tools = await response.json();

    // 메인 페이지에는 상위 3개 도구만 고정 표시
    const activeTools = tools.slice(0, 3);

    let html = activeTools.map((tool, index) => {
      const isActive = tool.status === 'active';
      const statusLabel = isActive ? '지금 이용 가능' : 
                         (tool.status === 'coming_soon' ? '출시 예정' : '개발 중...');
      const buttonLabel = isActive ? '무료 다운로드' : '곧 만나요';
      
      // Parse features JSON string
      let features = [];
      try {
        if (tool.features) {
          features = JSON.parse(tool.features);
        }
      } catch (e) {
        console.error('Failed to parse features:', e);
      }
      
      let iconHtml = '';
      if (isActive) {
        if (tool.icon && tool.icon.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
          iconHtml = `<img src="${tool.icon}" alt="${tool.name}" class="tool-icon-img">`;
        } else if (tool.icon) {
          iconHtml = `<span style="font-size: 48px; line-height: 1;">${tool.icon}</span>`;
        }
      } else {
        // 준비 중인 도구는 지정된 플레이스홀더 이미지 사용 (1, 2번 교차)
        const placeholderNum = (index % 2) + 1;
        iconHtml = `<img src="/placeholder-${placeholderNum}.png" alt="준비 중" class="tool-icon-img">`;
      }
      
      const featuresHtml = features.length > 0
        ? `<div class="tool-features">${features.map(f => `<span>${f}</span>`).join('')}</div>`
        : '';
      
      return `
        <div class="tool-card reveal ${index < 3 ? 'active' : ''} ${!isActive ? 'placeholder-card' : ''}" style="animation-delay: ${index * 0.1}s">
          <div class="tool-card-inner">
            <div class="tool-icon">${iconHtml}</div>
            <div class="tool-info">
              ${isActive ? `
                <h3>${tool.name}</h3>
                <p>${tool.description}</p>
                ${featuresHtml}
                <div class="tool-action">
                  <button class="btn btn-primary">다운로드</button>
                </div>
              ` : `
                <div class="placeholder-content">
                  <span class="placeholder-text">준비중</span>
                </div>
              `}
            </div>
          </div>
        </div>
      `;
    }).join('');

    toolListContainer.innerHTML = html;
  } catch (error) {
    console.error('Failed to fetch tools:', error);
    toolListContainer.innerHTML = '<p class="error-msg">도구 목록을 불러오는데 실패했습니다.</p>';
  }
}

async function fetchAndRenderBlog() {
  try {
    const response = await fetch(`${API_BASE_URL}/blog`);
    const blogPosts = await response.json();
    
    const blogList = document.getElementById('blog-list');
    if (!blogList) return;

    blogList.innerHTML = blogPosts.slice(0, 3).map((post, index) => {
      const slug = post.slug || post.id;
      
      // 난이도 및 카테고리 한글 변환 매핑
      const difficultyMap = {
        'beginner': '초보',
        'intermediate': '중급',
        'advanced': '고급'
      };
      const categoryMap = {
        'Getting Started': '시작하기',
        'Design': '디자인',
        'Tutorial': '튜토리얼',
        'Tools': '도구 활용',
        'Deployment': '배포와 공유'
      };
      
      const difficultyKo = difficultyMap[post.difficulty_level] || post.difficulty_level;
      const categoryKo = categoryMap[post.category] || post.category;
      
      // 요약문이 없을 경우 본문에서 추출 (최대 100자)
      const excerpt = post.excerpt || post.content || '';
      const summary = excerpt.length > 100 ? excerpt.substring(0, 100) + '...' : excerpt;
      
      return `
      <a href="${BLOG_URL}/posts/${slug}" class="blog-card reveal delay-${(index % 3) + 1}">
        <div class="blog-card-inner">
          <img src="${post.thumbnail_url}" alt="${post.title}" class="blog-thumb" loading="lazy">
          <div class="blog-content">
            <h3 class="blog-title">
              <span class="chapter-number">${index + 1}장</span>
              ${post.title.replace(/[\[\]]/g, ' ')}
            </h3>
            <p class="blog-excerpt">${summary}</p>
          </div>
        </div>
      </a>
    `}).join('');
    
    revealOnScroll();
  } catch (error) {
    console.error('Error fetching blog:', error);
  }
}

// Header scroll effect
const initHeaderScroll = () => {
  const header = document.querySelector('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.background = 'rgba(253, 252, 248, 0.95)';
    } else {
      header.style.background = 'rgba(253, 252, 248, 0.98)';
    }
    
    lastScroll = currentScroll;
  });
};

document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderSiteConfig();
  fetchAndRenderTools();
  fetchAndRenderBlog();
  
  initSmoothScroll();
  initHeaderScroll();
  
  // Initial reveal check
  setTimeout(revealOnScroll, 100);
});