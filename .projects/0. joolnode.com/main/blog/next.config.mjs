/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 배포를 위한 정적 내보내기
  // 블로그는 마크다운 기반 정적 콘텐츠이므로 SSG(Static Site Generation)에 적합
  output: 'export',
  
  // 이미지 최적화 비활성화 (정적 내보내기 시 필요)
  images: {
    unoptimized: true,
  },
  
  // 트레일링 슬래시 설정
  trailingSlash: true,
};

export default nextConfig;
