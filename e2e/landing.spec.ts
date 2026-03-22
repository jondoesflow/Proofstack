import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('shows hero heading', async ({ page }) => {
    const heading = page.locator('h1')
    await expect(heading).toContainText('Turn Happy Clients into')
    await expect(heading).toContainText('Your Best Sales Tool')
  })

  test('shows early access badge instead of fake trust claim', async ({ page }) => {
    const body = await page.textContent('body')
    expect(body).toContain('early access')
    expect(body).not.toContain('Trusted by 2,400')
    expect(body).not.toContain('2,400+ freelancers')
  })

  test('shows honest value props instead of fake stats', async ({ page }) => {
    const body = await page.textContent('body')
    // Should have honest value props
    expect(body).toContain('Setup time')
    expect(body).toContain('You own your data')
    // Should NOT have fake numbers
    expect(body).not.toContain('Testimonials collected')
    expect(body).not.toContain('Approval rate')
    expect(body).not.toContain('Avg conversion lift')
  })

  test('demo wall shows skeleton placeholders, not fake reviews', async ({ page }) => {
    const demoSection = page.locator('#demo')
    await expect(demoSection).toBeVisible()

    // Should NOT contain fake names
    const demoText = await demoSection.textContent()
    expect(demoText).not.toContain('Sarah Mitchell')
    expect(demoText).not.toContain('Tom Henderson')
    expect(demoText).not.toContain('Priya Sharma')
    expect(demoText).not.toContain('Bloom Studio')
  })

  test('no fake social proof section', async ({ page }) => {
    const body = await page.textContent('body')
    expect(body).not.toContain('Loved by freelancers & founders')
    expect(body).not.toContain('Chris Lawson')
    expect(body).not.toContain('Aisha Bangura')
    expect(body).not.toContain('Marcus Webb')
  })

  test('shows early access section instead', async ({ page }) => {
    const body = await page.textContent('body')
    expect(body).toContain("We're just getting started")
    expect(body).toContain('building in public')
  })

  test('CTA does not claim thousands of users', async ({ page }) => {
    const body = await page.textContent('body')
    expect(body).not.toContain('Join thousands')
  })

  test('pricing section renders all three plans', async ({ page }) => {
    const pricingSection = page.locator('#pricing')
    await expect(pricingSection).toBeVisible()
    await expect(pricingSection.getByRole('heading', { name: 'Free', exact: true })).toBeVisible()
    await expect(pricingSection.getByRole('heading', { name: 'Pro', exact: true })).toBeVisible()
    await expect(pricingSection.getByRole('heading', { name: 'Business', exact: true })).toBeVisible()
  })

  test('FAQ section is visible and interactive', async ({ page }) => {
    const faqSection = page.locator('#faq')
    await expect(faqSection).toBeVisible()

    // Click first FAQ item
    const firstQuestion = faqSection.locator('button').first()
    await firstQuestion.click()

    // Answer should become visible
    const answer = faqSection.locator('button + div').first()
    await expect(answer).toBeVisible()
  })

  test('signup CTA links to login page', async ({ page }) => {
    const ctaLink = page.locator('a[href*="/login?mode=signup"]').first()
    await expect(ctaLink).toBeVisible()
  })
})
