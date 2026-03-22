import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

export const getStripe = () => loadStripe(stripePublishableKey)

export const PRICING_PLANS = [
  {
    id: 'free' as const,
    name: 'Free',
    price: 0,
    currency: 'GBP',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 approved testimonials',
      'Basic testimonial wall',
      'Public collection link',
      'iframe embed',
      'Email support',
    ],
    highlighted: false,
    stripePriceId: '',
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: 9,
    currency: 'GBP',
    period: 'month',
    description: 'For freelancers and consultants',
    features: [
      'Unlimited testimonials',
      'Custom branding & colours',
      'Grid, carousel & masonry layouts',
      'Custom font selection',
      'Remove ProofStack branding',
      'Priority support',
    ],
    highlighted: true,
    stripePriceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
  },
  {
    id: 'business' as const,
    name: 'Business',
    price: 19,
    currency: 'GBP',
    period: 'month',
    description: 'For agencies and teams',
    features: [
      'Everything in Pro',
      'Multiple testimonial walls',
      'White label (custom domain)',
      'Team member access',
      'Analytics & reporting',
      'Dedicated support',
    ],
    highlighted: false,
    stripePriceId: import.meta.env.VITE_STRIPE_BUSINESS_PRICE_ID || 'price_business_monthly',
  },
]
