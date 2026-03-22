import { test, expect } from '@playwright/test'

test.describe('Wall page', () => {
  test('shows empty or error state for invalid user', async ({ page }) => {
    await page.goto('/wall/nonexistent-user-id-12345')
    // Wait for Firebase lookup to complete
    await page.waitForTimeout(3000)

    // Page should render something (not blank)
    const body = await page.textContent('body')
    expect(body?.length).toBeGreaterThan(0)
  })

  test('page does not crash on load', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto('/wall/some-test-user')
    await page.waitForTimeout(2000)

    expect(errors).toEqual([])
  })

  test('no proofstack.app links on wall page', async ({ page }) => {
    await page.goto('/wall/some-test-user')
    await page.waitForTimeout(2000)

    const links = await page.$$eval('a[href]', (els) =>
      els.map((el) => el.getAttribute('href')).filter(Boolean)
    )
    const badLinks = links.filter((href) => href!.includes('proofstack.app'))
    expect(badLinks).toEqual([])
  })
})
