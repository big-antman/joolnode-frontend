# Joolnode Deployment History & Guidelines

## 1. Build Requirements (CRITICAL)

### Blog (Next.js)
- **Problem**: Building on Windows encounters native binding errors with Turbopack (`@next/swc-win32-x64-msvc`).
- **Solution**: **MUST** use the `--webpack` flag for both development and production builds.
- **Command**: `npm run build` (mapped to `next build --webpack`)

### Frontend (Vite)
- Standard Vite build.
- **Command**: `npm run build` (mapped to `vite build`)

## 2. Mobile & Tablet UI Fixes (2026-05-03)

### Laptop Image Hiding
- In the "Maker's Story" (`#greeting`) section, the laptop image (`/maker-story.png`) is hidden on screens up to **992px** (Mobile & Tablet) to prevent visual clutter.
- **Applied CSS**:
  ```css
  @media (max-width: 992px) {
    .mission-image, .mission-image img, .mission-wrapper .mission-image {
      display: none !important;
      visibility: hidden !important;
    }
  }
  ```

### Card Visibility (Senior Friendly)
- To avoid overwhelming senior users on mobile/tablet, both the **Latest Posts** and **Downloads** sections are restricted to showing only **ONE** card.
- **Dual-Layer Strategy**:
  1. **JavaScript**: `main.js` uses `window.innerWidth <= 992` to render only 1 item via `.slice(0, 1)`.
  2. **CSS**: A failsafe rule hides any extra children up to 992px.
- **Applied CSS**:
  ```css
  @media (max-width: 992px) {
    #blog-list > *:nth-child(n+2),
    #tool-list > *:nth-child(n+2) {
      display: none !important;
    }
  }
  ```

## 3. Tool Branding Sync
- **Screen Capture Tool** (`화면 캡처 도구`):
  - **Image**: Fixed to `/capture-tool.png`.
  - **Database**: Updated via `UPDATE tools SET icon = '/capture-tool.png' WHERE name LIKE '%캡처%';`
- **Favicons**: All sub-pages (Blog, Practice, Contact) must use `/logo.svg` to maintain brand consistency with the main landing page.

## 4. Deployment Checkpoints
1. Ensure `joolnode.db` is updated with correct asset paths.
2. Run `npm run build` in both `frontend` and `blog` directories.
3. Verify that `blog/node_modules` is healthy (if native binding errors occur, run `npm install` again or use `--webpack`).
