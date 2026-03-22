import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: 1,
  reporter: 'list',
  use: {
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://proofstack-dev.netlify.app',
      },
    },
    {
      name: 'prod',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://proofstack-app.netlify.app',
      },
    },
  ],
})
