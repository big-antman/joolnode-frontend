import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

// content/posts 디렉토리 경로
const postsDirectory = path.join(process.cwd(), 'content/posts');

/**
 * 모든 마크다운 포스트 파일을 읽어 slug, frontmatter, 날짜 순으로 정렬하여 반환
 * @returns {Array} 포스트 배열 [{slug, ...frontmatter}]
 */
export function getAllPosts() {
  // posts 디렉토리에서 모든 .md 파일 읽기
  const fileNames = fs.readdirSync(postsDirectory);
  
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      // 파일명에서 slug 추출 (파일명.md → slug)
      const slug = fileName.replace(/\.md$/, '');
      
      // 파일 전체 경로
      const fullFilePath = path.join(postsDirectory, fileName);
      
      // 파일 내용 읽기
      const fileContents = fs.readFileSync(fullFilePath, 'utf8');
      
      // gray-matter로 frontmatter 파싱
      const { data } = matter(fileContents);
      
      // slug와 메타데이터 반환
      return {
        slug,
        ...data,
      };
    });
  
  // 날짜순 정렬 (학습을 위해 1화부터 순서대로)
  return allPostsData.sort((a, b) => {
    if (a.date > b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * 특정 slug의 마크다운 파일을 읽어 frontmatter와 HTML 콘텐츠 반환
 * @param {string} slug - 포스트 슬러그
 * @returns {Object} {slug, title, date, category, description, content(HTML)}
 */
export async function getPostBySlug(slug) {
  const fullFilePath = path.join(postsDirectory, `${slug}.md`);
  
  // 파일이 존재하는지 확인
  if (!fs.existsSync(fullFilePath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullFilePath, 'utf8');
  
  // gray-matter로 frontmatter 파싱
  const { data, content } = matter(fileContents);
  
  // remark로 마크다운을 HTML로 변환
  const processedContent = await remark()
    .use(remarkGfm)  // GitHub Flavored Markdown 지원 (테이블, 체크박스 등)
    .use(remarkHtml, { sanitize: false })  // HTML 이스케이프 비활성화 (마크다운 생성 HTML 허용)
    .process(content);
  
  const contentHtml = processedContent.toString();
  
  return {
    slug,
    contentHtml,
    ...data,
  };
}

/**
 * 모든 포스트의 slug 배열 반환 (정적 생성용)
 * @returns {Array} slug 배열
 */
export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, ''),
        },
      };
    });
}