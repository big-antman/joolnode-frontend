import './style.css'

const API_BASE_URL = '/api';

async function fetchAndRenderSiteConfig() {
  try {
    const response = await fetch(`${API_BASE_URL}/site-config`);
    const config = await response.json();
    
    // 푸터 정보 업데이트 예시 (필요시 HTML에 ID 추가 필요)
    const footerText = document.querySelector('footer p');
    if (footerText && config.footer_text) {
      footerText.textContent = config.footer_text;
    }
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

    toolListContainer.innerHTML = tools.map(tool => {
      const isActive = tool.status === 'active';
      const statusLabel = isActive ? '지금 이용 가능' : (tool.status === 'coming_soon' ? '출시 예정' : '개발 중...');
      const buttonLabel = isActive ? '무료 다운로드' : '곧 만나요';
      
      return `
        <div class="tool-card">
          <div class="tool-icon">${tool.icon || '🛠️'}</div>
          <div class="tool-info">
            <h3>[${isActive ? '첫번째 필수 도구' : '준비 중'}: ${tool.name}]</h3>
            <p>${tool.description}</p>
            <span class="tool-status ${isActive ? 'status-active' : 'status-pending'}">
              ${statusLabel}
            </span>
          </div>
          <div class="tool-action">
            <button class="btn ${isActive ? 'btn-primary' : 'btn-disabled'}" 
                    ${!isActive ? 'disabled' : ''}>
              ${buttonLabel}
            </button>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Failed to fetch tools:', error);
    toolListContainer.innerHTML = '<p class="error-msg">도구 목록을 불러오는데 실패했습니다. 서버 상태를 확인해주세요.</p>';
  }
}

async function fetchAndRenderBlog() {
  try {
    const response = await fetch(`${API_BASE_URL}/blog`);
    const blogPosts = await response.json();
    
    const blogList = document.getElementById('blog-list');
    if (!blogList) return;

    blogList.innerHTML = blogPosts.map(post => `
      <div class="blog-card">
        <img src="${post.thumbnail_url}" alt="${post.title}" class="blog-thumb">
        <div class="blog-content">
          <div class="blog-meta">
            <span class="badge ${post.difficulty_level}">${post.difficulty_level}</span>
            <span class="category">${post.category}</span>
          </div>
          <h3 class="blog-title">${post.title}</h3>
          <div class="blog-footer">
            <span>읽는 시간: ${post.estimated_time}분</span>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error fetching blog:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderSiteConfig();
  fetchAndRenderTools();
  fetchAndRenderBlog();
});
