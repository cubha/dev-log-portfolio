import { test, expect } from '@playwright/test'

// HTTP 요청 기반 테스트 (브라우저 불필요)

test('존재하지 않는 slug 접근 → notFound 콘텐츠', async ({ request }) => {
  const res = await request.get('/blog/nonexistent-slug-xyz')
  // dev 서버는 notFound()도 200으로 응답하나, 콘텐츠에 404 표시 확인
  const body = await res.text()
  expect(body).toMatch(/404|not.found|찾을 수 없/i)
})

test('블로그 목록 페이지 정상 로드 (HTTP 200)', async ({ request }) => {
  const res = await request.get('/blog')
  expect(res.status()).toBe(200)
  const body = await res.text()
  expect(body).not.toMatch(/Application error|Internal Server Error/)
})

test('한글 slug ㅅㄷㄴㅅ 상세 페이지 정상 로드', async ({ request }) => {
  const res = await request.get('/blog/%E3%85%85%E3%84%B7%E3%84%B4%E3%85%85')
  expect(res.status()).toBe(200)
  const body = await res.text()
  // 제목이 글 제목으로 설정돼야 함 (글을 찾을 수 없습니다 X)
  expect(body).not.toContain('글을 찾을 수 없습니다')
  expect(body).not.toMatch(/Application error|Internal Server Error/)
})

test('비로그인 상태 → 플로팅 버튼 HTML에 없음', async ({ request }) => {
  const res = await request.get('/blog/%E3%85%85%E3%84%B7%E3%84%B4%E3%85%85')
  const body = await res.text()
  // 서버 렌더링 HTML에 플로팅 버튼 title 속성이 없어야 함
  expect(body).not.toContain('관리자 메뉴')
  expect(body).not.toContain('사용자 메뉴')
})

test('블로그 목록에 게시글 링크 존재', async ({ request }) => {
  const res = await request.get('/blog')
  const body = await res.text()
  expect(body).toMatch(/href="\/blog\/[^"]+"/i)
})
