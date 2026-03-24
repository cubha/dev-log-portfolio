/**
 * 플로팅 버튼 위치 비교 스크립트
 * - /blog vs /projects 의 fixed 엘리먼트 containing block 및 transform ancestor 비교
 */

import { chromium } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const PAGES = [
  { path: '/', label: 'home' },
  { path: '/projects', label: 'projects' },
  { path: '/about', label: 'about' },
  { path: '/blog', label: 'blog' },
]

const OUT_DIR = path.join(process.cwd(), 'test-results', 'floating-compare')

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1440, height: 900 })

  for (const { path: pagePath, label } of PAGES) {
    console.log(`\n=== [${label}] ${pagePath} ===`)
    await page.goto(`http://localhost:3000${pagePath}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)

    // 스크린샷
    await page.screenshot({
      path: path.join(OUT_DIR, `${label}.png`),
      fullPage: true,
    })

    // template.tsx motion.div (첫 번째 flex-1 min-h-0 자식) transform 확인
    const templateDivTransform = await page.evaluate(() => {
      // layout.tsx 의 flex-1 min-h-0 div 안의 첫 번째 div = template.tsx motion.div
      const wrapper = document.querySelector('body > div')
      const flexDiv = wrapper?.querySelector?.('.flex-1')
        ?? document.querySelector('.flex-1.min-h-0')
      const templateDiv = flexDiv?.firstElementChild as HTMLElement | null
      if (!templateDiv) return { found: false }

      const style = window.getComputedStyle(templateDiv)
      return {
        found: true,
        tagName: templateDiv.tagName,
        className: templateDiv.className.slice(0, 80),
        transform: style.transform,
        willChange: style.willChange,
        filter: style.filter,
        backdropFilter: style.backdropFilter,
      }
    })
    console.log('template.tsx motion.div:', templateDivTransform)

    // fixed 엘리먼트 containing block 탐색
    // (fixed 엘리먼트가 없으면 임시로 하나 삽입해서 체크)
    const containingBlockInfo = await page.evaluate(() => {
      // fixed 요소 탐색 (FloatingUserButton의 div)
      const fixedEls = Array.from(document.querySelectorAll('*'))
        .filter((el) => window.getComputedStyle(el as Element).position === 'fixed')

      if (fixedEls.length === 0) {
        // fixed 요소 없으면 임시 삽입 후 containing block 확인
        const probe = document.createElement('div')
        probe.id = '__probe__'
        probe.style.cssText = 'position:fixed;bottom:24px;right:24px;width:48px;height:48px;background:red;z-index:9999;'
        document.body.appendChild(probe)
        const rect = probe.getBoundingClientRect()
        probe.remove()
        return {
          probeInserted: true,
          rect: { bottom: rect.bottom, right: rect.right, top: rect.top, left: rect.left },
          viewportBottom: window.innerHeight,
          viewportRight: window.innerWidth,
          expectedBottom: window.innerHeight - 24,
          expectedRight: window.innerWidth - 24,
          bottomDiff: Math.abs(rect.bottom - (window.innerHeight - 24)),
          rightDiff: Math.abs(rect.right - (window.innerWidth - 24)),
        }
      }

      const el = fixedEls[0] as HTMLElement
      const rect = el.getBoundingClientRect()
      return {
        probeInserted: false,
        className: el.className.slice(0, 80),
        rect: { bottom: rect.bottom, right: rect.right, top: rect.top, left: rect.left },
        viewportBottom: window.innerHeight,
        viewportRight: window.innerWidth,
        expectedBottom: window.innerHeight - 24,
        expectedRight: window.innerWidth - 24,
        bottomDiff: Math.abs(rect.bottom - (window.innerHeight - 24)),
        rightDiff: Math.abs(rect.right - (window.innerWidth - 24)),
      }
    })
    console.log('fixed element / probe:', JSON.stringify(containingBlockInfo, null, 2))

    // transform 조상 탐색
    const transformAncestors = await page.evaluate(() => {
      const probe = document.createElement('div')
      probe.style.cssText = 'position:fixed;'
      document.body.appendChild(probe)

      const ancestors: { tag: string; id: string; cls: string; transform: string; willChange: string }[] = []
      let el: Element | null = probe.parentElement
      while (el && el !== document.body) {
        const s = window.getComputedStyle(el)
        if (
          s.transform !== 'none' ||
          s.willChange.includes('transform') ||
          s.filter !== 'none' ||
          s.backdropFilter !== 'none'
        ) {
          ancestors.push({
            tag: el.tagName,
            id: el.id,
            cls: el.className.slice(0, 60),
            transform: s.transform,
            willChange: s.willChange,
          })
        }
        el = el.parentElement
      }
      probe.remove()
      return ancestors
    })
    console.log('transform ancestors (fixed containing block 후보):', transformAncestors)
  }

  await browser.close()
  console.log(`\n스크린샷 저장 경로: ${OUT_DIR}`)
}

main().catch(console.error)
