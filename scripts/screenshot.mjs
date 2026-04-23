import { firefox } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = '/mnt/d/workspace/Design';

// 촬영할 페이지 목록
const PAGES = [
  { name: '01_home', path: '/', waitFor: 'networkidle' },
  { name: '02_about', path: '/about', waitFor: 'networkidle' },
  { name: '03_blog_list', path: '/blog', waitFor: 'networkidle' },
  { name: '04_projects_list', path: '/projects', waitFor: 'networkidle' },
  { name: '05_contact', path: '/contact', waitFor: 'networkidle' },
  { name: '06_login', path: '/login', waitFor: 'networkidle' },
];

async function getFirstSlug(page, listUrl, selector) {
  await page.goto(BASE_URL + listUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const href = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return el ? el.getAttribute('href') : null;
  }, selector);
  return href;
}

async function takeFullPageScreenshot(page, url, outputPath, label) {
  console.log(`📸 촬영 중: ${label} → ${url}`);
  try {
    await page.goto(BASE_URL + url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // 애니메이션 완료 대기
    await page.evaluate(() => {
      return new Promise((resolve) => {
        const checkAnimations = () => {
          const animations = document.getAnimations();
          if (animations.every(a => a.playState !== 'running')) {
            resolve();
          } else {
            setTimeout(checkAnimations, 100);
          }
        };
        setTimeout(checkAnimations, 500);
      });
    }).catch(() => {});

    await page.screenshot({
      path: outputPath,
      fullPage: true,
    });
    console.log(`  ✅ 저장 완료: ${path.basename(outputPath)}`);
  } catch (err) {
    console.error(`  ❌ 실패: ${label} — ${err.message}`);
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await firefox.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // 기본 페이지 촬영
  for (const { name, path: urlPath } of PAGES) {
    const outputPath = `${OUTPUT_DIR}/${name}.png`;
    await takeFullPageScreenshot(page, urlPath, outputPath, name);
  }

  // 블로그 상세 페이지 — 첫 번째 글 slug 자동 탐색
  console.log('\n🔍 블로그 상세 페이지 slug 탐색 중...');
  const blogSlugHref = await getFirstSlug(
    page,
    '/blog',
    'a[href^="/blog/"]:not([href="/blog/new"])'
  );
  if (blogSlugHref) {
    await takeFullPageScreenshot(
      page,
      blogSlugHref,
      `${OUTPUT_DIR}/03b_blog_detail.png`,
      'blog_detail'
    );
  } else {
    console.log('  ⚠️  블로그 글이 없거나 링크를 찾지 못했습니다.');
  }

  // 프로젝트 상세 페이지 — 첫 번째 slug 자동 탐색
  console.log('\n🔍 프로젝트 상세 페이지 slug 탐색 중...');
  const projectSlugHref = await getFirstSlug(
    page,
    '/projects',
    'a[href^="/projects/"]'
  );
  if (projectSlugHref) {
    await takeFullPageScreenshot(
      page,
      projectSlugHref,
      `${OUTPUT_DIR}/04b_project_detail.png`,
      'project_detail'
    );
  } else {
    console.log('  ⚠️  프로젝트가 없거나 링크를 찾지 못했습니다.');
  }

  await browser.close();
  console.log('\n🎉 모든 스냅샷 촬영 완료!');
  console.log(`📁 저장 위치: ${OUTPUT_DIR}`);
  console.log('\n저장된 파일 목록:');
  fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.png'))
    .sort()
    .forEach(f => console.log(`  - ${f}`));
}

main().catch(console.error);
