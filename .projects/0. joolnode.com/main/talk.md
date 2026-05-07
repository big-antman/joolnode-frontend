# 🛠️ JOOLnode 디버깅 및 최적화 작업 지침 (for Roo Code)

이 지침은 안티그래비티(Gemini)가 조사하고 클라인(Cline)이 검토한 내용을 바탕으로 작성되었습니다. 루코드(Roo Code)는 아래 순서에 따라 디버깅을 수행하십시오.

---

## 🏁 디버깅 우선순위 및 세부 지침

### 1순위: `server.js` 파괴적 로직 제거 (데이터 보존) 🔴
- **대상 파일**: `main/backend/server.js`
- **현상**: 서버 재시작 시마다 `DROP TABLE` 및 `DELETE FROM`이 실행되어 DB 데이터가 매번 초기화됨.
- **수정 내용**: 
  - `DROP TABLE IF EXISTS` 구문 삭제.
  - `DELETE FROM tools`, `DELETE FROM site_config` 등 초기화 구문 삭제.
  - `CREATE TABLE IF NOT EXISTS`만 남겨 데이터가 보존되도록 수정.

### 2순위: Vite 버전 수정 및 빌드 검증 🔴
- **대상 파일**: `main/frontend/package.json`
- **현상**: 존재하지 않는 Vite 버전(`^8.0.10`)이 명시되어 빌드 및 설치 불가.
- **수정 내용**: 
  - `"vite": "^8.0.10"` -> `"vite": "^6.0.0"` (또는 프로젝트에 맞는 안정 버전)으로 교체.
  - 수정 후 `npm install` 및 `npm run build`를 실행하여 정합성 검증.

### 3순위: 블로그 포스팅 업로드 및 경로 동기화 🟡
- **대상 경로**: `main/blog/content/posts/`
- **현상**: 루트의 빈 `content` 폴더와 `main/blog/content` 간의 혼선.
- **수정 내용**: 
  - 12개의 마크다운(.md) 포스트 파일이 `main/blog/content/posts/`에 정상 위치하도록 확인.
  - 블로그 메인(`Home`) 페이지에서 `getAllPosts()`를 통해 모든 포스트가 정상 렌더링되는지 확인.

### 4순위: 배포 플랫폼 설정 정리 (Cloudflare 일원화) 🟡
- **대상 파일**: `vercel.json`, `wrangler.toml`, `workmap.md`
- **현상**: Vercel과 Cloudflare 설정 혼재로 인한 배포 혼선.
- **수정 내용**: 
  - 배포 플랫폼을 **Cloudflare Pages**로 확정.
  - `workmap.md` 내의 배포 아키텍처 설명을 Vercel -> Cloudflare로 정정.
  - 불필요한 `vercel.json` 제거 또는 주석 처리.

### 5순위: `G:` 드라이브 하드코딩 경로 수정 🟡
- **대상 파일**: `download/src/App.jsx`
- **현상**: `storageRoot = "G:\\..."`와 같이 특정 PC 드라이브 경로가 하드코딩되어 타 환경에서 작동 불능.
- **수정 내용**: 
  - 절대 경로를 상대 경로 또는 환경 변수(`VITE_STORAGE_ROOT`) 기반으로 교체.
  - 다른 환경에서도 캡처 파일 저장이 가능하도록 유연한 로직 적용.

---

## 📋 루코드(Roo Code) 디버깅 결과 보고서 (2026-05-03)

### ✅ 1순위 완료: `server.js` 파괴적 로직 제거
- [`server.js`](main/backend/server.js:65) `DROP TABLE IF EXISTS tools;` → **삭제**
- [`server.js`](main/backend/server.js:118) `DELETE FROM tools` → **삭제** (COUNT 체크 후 최초 1회만 시딩)
- [`server.js`](main/backend/server.js:121) `DELETE FROM site_config` → **삭제** (COUNT 체크 후 최초 1회만 시딩)
- [`server.js`](main/backend/server.js:124) `DELETE FROM blog_posts` → **삭제** (COUNT 체크 후 최초 1회만 시딩)
- 결과: 서버 재시작 후에도 데이터 유지됨. `/health` 엔드포인트 정상 응답 확인.

### ✅ 2순위 완료: Vite 버전 수정 및 빌드 검증
- [`package.json`](main/frontend/package.json:12) `"vite": "^8.0.10"` → `"vite": "^6.0.0"` 교체
- `npm install` 성공 (6 packages added, 0 vulnerabilities)
- `npm run build` 성공 (`vite v6.4.2`, dist/index.html + CSS + JS 출력)

### ✅ 3순위 완료: 블로그 포스팅 경로 동기화
- `main/blog/content/posts/` 내 12개 `.md` 파일 존재 확인
- `getAllPosts()` → `process.cwd() + content/posts` 경로 참조 정상 (Next.js 실행 CWD가 `main/blog/`이므로 올바름)
- 블로그 개발 서버 `GET / 200` 정상 응답 확인
- ⚠️ 루트 `content/posts/` 디렉토리가 비어있는 채로 존재 — 혼선 유발 가능 (삭제 권장)

### ✅ 4순위 완료: 배포 플랫폼 Cloudflare 일원화
- `main/frontend/vercel.json` → **삭제**
- `main/blog/vercel.json` → **삭제**
- [`workmap.md`](workmap.md:30) 배포 아키텍처: Vercel/Render → **Cloudflare Pages로 정정**
- [`workmap.md`](workmap.md:63) 태스크 지도 배포 항목: Vercel/Render → **Cloudflare Pages로 정정**
- `wrangler.toml` (Cloudflare Pages 설정) 유지

### ✅ 5순위 완료: `G:` 드라이브 하드코딩 경로 수정
- [`App.jsx`](download/src/App.jsx:313) `"G:\\JOOLnode_Media_Warehouse\\Captures"` → `import.meta.env.VITE_STORAGE_ROOT || './captures'`
- 환경 변수 `VITE_STORAGE_ROOT`로 유연하게 경로 지정 가능 (미설정 시 `./captures`로 폴백)

### 🔍 추가 발견 사항
- 루트 `content/posts/` 디렉토리: 비어있는 폴더로, 삭제하여 혼선 방지 권장

---

## ⚠️ 기술적 주의사항 (MUST READ)
- **백틱(`) 사용 주의**: 현재 시스템의 `write_to_file` 도구 결함으로 닫는 백틱이 유실될 수 있습니다. 코드 수정 시 `replace_file_content`를 사용하거나, 불가피한 경우 작은따옴표(`'`)를 활용하십시오.
- **작업 완료 후**: 각 단계별 결과를 `talk.md`에 업데이트하고, 클라인(Cline)에게 검증을 요청하십시오.
