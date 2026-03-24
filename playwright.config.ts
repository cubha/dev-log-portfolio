import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  timeout: 15000,
  // 브라우저 없이 request 전용 테스트
  projects: [
    {
      name: 'api',
      use: {},
    },
  ],
})
