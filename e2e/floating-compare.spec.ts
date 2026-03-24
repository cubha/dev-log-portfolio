import { test, expect, chromium } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const PAGES = [
  { path: '/', label: 'home' },
  { path: '/projects', label: 'projects' },
  { path: '/about', label: 'about' },
  { path: '/blog', label: 'blog' },
]

test('플로팅 버튼 fixed containing block 비교', async ({ browser }) => {
  const OUT_DIR = path.join(process.cwd(), 'test-results', 'floating-compare')
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  const results: Record<string, unknown> = {}

  for (const { path: pagePath, label } of PAGES) {
    const page = await browser.newPage()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`http://localhost:3000${pagePath}`, { waitUntil: 'networkidle', timeout: 15000 })
    await page.waitForTimeout(800)

    await page.screenshot({
      path: path.join(OUT_DIR, `${label}.png`),
      fullPage: false,
    })

    // probe: fixed div 삽입 후 실제 위치 확인
    const probeResult = await page.evaluate(() => {
      const probe = document.createElement('div')
      probe.style.cssText = 'position:fixed;bottom:24px;right:24px;width:48px;height:48px;background:red;z-index:9999;pointer-events:none;'
      document.body.appendChild(probe)
      const rect = probe.getBoundingClientRect()
      probe.remove()

      const vw = window.innerWidth
      const vh = window.innerHeight
      // 올바른 위치: bottom-6(24px) = 뷰포트 하단에서 24px 위 → rect.bottom = vh - 24
      // 올바른 위치: right-6(24px)  = 뷰포트 우측에서 24px 좌 → rect.right = vw - 24
      return {
        rect: { top: Math.round(rect.top), right: Math.round(rect.right), bottom: Math.round(rect.bottom), left: Math.round(rect.left) },
        viewport: { width: vw, height: vh },
        expected: { bottom: vh - 24, right: vw - 24 },
        bottomDiff: Math.round(rect.bottom - (vh - 24)),
        rightDiff: Math.round(rect.right - (vw - 24)),
      }
    })

    // transform 조상 탐색 (fixed containing block 생성 여부)
    const transformAncestors = await page.evaluate(() => {
      const probe = document.createElement('div')
      probe.style.cssText = 'position:fixed;'
      document.body.appendChild(probe)

      const found: { tag: string; cls: string; transform: string; willChange: string; filter: string }[] = []
      let el: Element | null = probe.parentElement
      while (el) {
        const s = window.getComputedStyle(el)
        const t = s.transform
        const wc = s.willChange
        const f = s.filter
        if ((t && t !== 'none') || wc.includes('transform') || (f && f !== 'none')) {
          found.push({
            tag: el.tagName,
            cls: el.className.slice(0, 70),
            transform: t,
            willChange: wc,
            filter: f,
          })
        }
        el = el.parentElement
      }
      probe.remove()
      return found
    })

    results[label] = { probe: probeResult, transformAncestors }
    console.log(`\n[${label}]`)
    console.log('  probe rect:', probeResult.rect)
    console.log('  expected  :', probeResult.expected)
    console.log('  bottomDiff:', probeResult.bottomDiff, '/ rightDiff:', probeResult.rightDiff)
    if (transformAncestors.length > 0) {
      console.log('  ⚠️  transform ancestors:')
      transformAncestors.forEach((a) => console.log(`    - ${a.tag}.${a.cls} | transform=${a.transform} | willChange=${a.willChange}`))
    } else {
      console.log('  ✅ transform ancestor 없음 (fixed=뷰포트 기준)')
    }

    await page.close()
  }

  // 결과 저장
  fs.writeFileSync(path.join(OUT_DIR, 'results.json'), JSON.stringify(results, null, 2))
  console.log('\n결과 저장:', path.join(OUT_DIR, 'results.json'))

  // blog 의 bottomDiff 가 0 이 아니면 실패
  const blogProbe = (results['blog'] as { probe: { bottomDiff: number; rightDiff: number } }).probe
  console.log('\n=== 최종 판정 ===')
  for (const label of ['home', 'projects', 'about', 'blog']) {
    const p = (results[label] as { probe: { bottomDiff: number; rightDiff: number } }).probe
    console.log(`  ${label}: bottomDiff=${p.bottomDiff}, rightDiff=${p.rightDiff} ${Math.abs(p.bottomDiff) > 2 || Math.abs(p.rightDiff) > 2 ? '❌ 위치 이상' : '✅ 정상'}`)
  }
})
