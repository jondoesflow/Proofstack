import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('landing page loads', async ({ page }) => {
    const res = await page.goto('/')
    expect(res?.status()).toBe(200)
  })

  test('login page loads', async ({ page }) => {
    const res = await page.goto('/login')
    expect(res?.status()).toBe(200)
  })

  test('collect page loads (invalid user)', async ({ page }) => {
    const res = await page.goto('/collect/nonexistent-user-id')
    expect(res?.status()).toBe(200)
  })

  test('wall page loads (invalid user)', async ({ page }) => {
    const res = await page.goto('/wall/nonexistent-user-id')
    expect(res?.status()).toBe(200)
  })

  test('no references to proofstack.app domain in landing page', async ({ page }) => {
    await page.goto('/')
    const body = await page.textContent('body')
    expect(body).not.toContain('proofstack.app')

    // Also check href attributes
    const links = await page.$$eval('a[href]', (els) =>
      els.map((el) => el.getAttribute('href')).filter(Boolean)
    )
    const badLinks = links.filter((href) => href!.includes('proofstack.app'))
    expect(badLinks).toEqual([])
  })

  test('no console errors on landing page', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    await page.waitForTimeout(2000)
    // Filter out known third-party errors (Firebase, etc.)
    const appErrors = errors.filter(
      (e) => !e.includes('Firebase') && !e.includes('firebaseapp') && !e.includes('net::')
    )
    expect(appErrors).toEqual([])
  })
})
