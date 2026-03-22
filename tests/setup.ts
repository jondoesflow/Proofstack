import '@testing-library/jest-dom'
import { vi, beforeAll, afterAll } from 'vitest'

// Mock Firebase
vi.mock('../src/lib/firebase', () => ({
  auth: {},
  db: {},
  default: {},
}))

// Mock Stripe
vi.mock('../src/lib/stripe', () => ({
  getStripe: vi.fn().mockResolvedValue(null),
  PRICING_PLANS: [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'GBP',
      period: 'forever',
      description: 'Perfect for getting started',
      features: ['Up to 3 approved testimonials'],
      highlighted: false,
      stripePriceId: '',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 9,
      currency: 'GBP',
      period: 'month',
      description: 'For freelancers and consultants',
      features: ['Unlimited testimonials'],
      highlighted: true,
      stripePriceId: 'price_pro_monthly',
    },
    {
      id: 'business',
      name: 'Business',
      price: 19,
      currency: 'GBP',
      period: 'month',
      description: 'For agencies and teams',
      features: ['Everything in Pro'],
      highlighted: false,
      stripePriceId: 'price_business_monthly',
    },
  ],
}))

// Suppress console.error in tests (for expected errors)
const originalConsoleError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const msg = args[0]?.toString() ?? ''
    if (
      msg.includes('Warning: ReactDOM.render') ||
      msg.includes('act(') ||
      msg.includes('not wrapped in act')
    ) {
      return
    }
    originalConsoleError(...args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
})
