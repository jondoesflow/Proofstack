export type Plan = 'free' | 'pro' | 'business'
export type TestimonialStatus = 'pending' | 'approved' | 'rejected'
export type WallLayout = 'grid' | 'carousel' | 'masonry'
export type WallTheme = 'light' | 'dark'

export interface WallSettings {
  theme: WallTheme
  layout: WallLayout
  primaryColor: string
  fontFamily: string
}

export interface ProofStackUser {
  uid: string
  email: string
  displayName: string
  businessName: string
  plan: Plan
  createdAt: Date
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  wallSettings: WallSettings
}

export interface Testimonial {
  id: string
  userId: string
  name: string
  role: string
  company: string
  testimonialText: string
  rating: number
  photoUrl: string
  status: TestimonialStatus
  createdAt: Date
  approvedAt?: Date
  featured: boolean
}

export interface TestimonialFormData {
  name: string
  role: string
  company: string
  testimonialText: string
  rating: number
  photoUrl: string
}

export interface DashboardStats {
  total: number
  pending: number
  approved: number
  rejected: number
  thisMonth: number
}

export interface PricingPlan {
  id: Plan
  name: string
  price: number
  currency: string
  period: string
  description: string
  features: string[]
  highlighted: boolean
  stripePriceId: string
}
