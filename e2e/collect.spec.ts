import { test, expect } from '@playwright/test'

test.describe('Collect page', () => {
  test('shows error for invalid user ID', async ({ page }) => {
    await page.goto('/collect/nonexistent-user-id-12345')
    // Wait for Firebase lookup to complete
    await page.waitForTimeout(3000)

    const body = await page.textContent('body')
    // Should show some kind of error or "not found" state
    const hasError =
      body?.toLowerCase().includes('not found') ||
      body?.toLowerCase().includes('error') ||
      body?.toLowerCase().includes('invalid') ||
      body?.toLowerCase().includes('does not exist') ||
      body?.toLowerCase().includes('no owner')
    expect(hasError).toBeTruthy()
  })

  test('powered by link does not point to proofstack.app', async ({ page }) => {
    await page.goto('/collect/nonexistent-user-id-12345')
    await page.waitForTimeout(3000)

    const poweredByLinks = await page.$$eval(
      'a[href*="proofstack"]',
      (els) => els.map((el) => el.getAttribute('href'))
    )
    for (const href of poweredByLinks) {
      expect(href).not.toContain('proofstack.app')
    }
  })

  test('page does not crash on load', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/collect/some-test-user')
    await page.waitForTimeout(2000)

    expect(errors).toEqual([])
  })
})
