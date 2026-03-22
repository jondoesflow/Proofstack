import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTestimonials } from '../hooks/useTestimonials'
import { useUser } from '../hooks/useUser'
import { TestimonialList } from '../components/dashboard/TestimonialList'
import { EmbedCode } from '../components/dashboard/EmbedCode'
import { WallCustomizer } from '../components/dashboard/WallCustomizer'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { getCollectionLink, copyToClipboard, getPlanDisplayName } from '../lib/utils'
import { getStripe } from '../lib/stripe'
import { PRICING_PLANS } from '../lib/stripe'

type DashSection = 'testimonials' | 'embed' | 'customize'

export function DashboardPage() {
  const { currentUser, userProfile, logOut } = useAuth()
  const { testimonials, loading, approveTestimonial, rejectTestimonial, deleteTestimonial, toggleFeatured, getStats } = useTestimonials(currentUser?.uid)
  const { updateWallSettings } = useUser()
  const [section, setSection] = useState<DashSection>('testimonials')
  const [collectionCopied, setCollectionCopied] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState(false)

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const stats = getStats()
  const collectionLink = getCollectionLink(currentUser.uid)
  const isPro = userProfile.plan === 'pro' || userProfile.plan === 'business'

  async function handleCopyLink() {
    const ok = await copyToClipboard(collectionLink)
    if (ok) {
      setCollectionCopied(true)
      setTimeout(() => setCollectionCopied(false), 2000)
    }
  }

  async function handleUpgrade(planId: 'pro' | 'business') {
    setUpgradeLoading(true)
    try {
      const plan = PRICING_PLANS.find((p) => p.id === planId)
      if (!plan || !currentUser || !userProfile) return

      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          userId: currentUser.uid,
          email: userProfile.email,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json() as { sessionId: string }
      const stripe = await getStripe()
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) throw error
      }
    } catch (err) {
      console.error('Upgrade error:', err)
      alert('Could not start upgrade. Please try again.')
    } finally {
      setUpgradeLoading(false)
    }
  }

  const navItems: { key: DashSection; label: string; icon: React.ReactNode }[] = [
    {
      key: 'testimonials',
      label: 'Testimonials',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      key: 'embed',
      label: 'Embed & Share',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      key: 'customize',
      label: 'Customize Wall',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors"
              aria-label="ProofStack home"
            >
              <span className="w-7 h-7 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                P
              </span>
              ProofStack
            </Link>
            <span className={[
              'text-xs font-semibold px-2 py-0.5 rounded-full',
              isPro ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600',
            ].join(' ')}>
              {getPlanDisplayName(userProfile.plan)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isPro && (
              <Button
                size="sm"
                onClick={() => handleUpgrade('pro')}
                loading={upgradeLoading}
                className="hidden sm:inline-flex"
              >
                Upgrade to Pro — £9/mo
              </Button>
            )}
            <a
              href={`/wall/${currentUser.uid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block"
              aria-label="View your testimonial wall (opens in new tab)"
            >
              View wall ↗
            </a>
            <button
              onClick={() => logOut()}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Sign out"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome + collection link */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {userProfile.displayName.split(' ')[0]}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{userProfile.businessName}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total received', value: stats.total, color: 'text-gray-900' },
            { label: 'Pending review', value: stats.pending, color: 'text-yellow-600' },
            { label: 'Approved', value: stats.approved, color: 'text-green-600' },
            { label: 'This month', value: stats.thisMonth, color: 'text-primary-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className={['text-3xl font-extrabold mt-1', stat.color].join(' ')}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Collection link */}
        <div className="bg-gradient-to-r from-primary-50 to-violet-50 border border-primary-100 rounded-xl p-5 mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Your collection link</h2>
              <p className="text-xs text-gray-500 mt-0.5">Share this with clients to collect testimonials</p>
              <p className="font-mono text-sm text-primary-700 mt-2 break-all">{collectionLink}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant={collectionCopied ? 'secondary' : 'primary'}
                onClick={handleCopyLink}
                aria-label="Copy collection link"
              >
                {collectionCopied ? (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </span>
                ) : 'Copy link'}
              </Button>
              <a
                href={collectionLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Preview collection form (opens in new tab)"
              >
                <Button size="sm" variant="outline">
                  Preview ↗
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Section nav */}
          <nav className="flex border-b border-gray-200 overflow-x-auto" aria-label="Dashboard sections">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={[
                  'flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                  section === item.key
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                ].join(' ')}
                aria-selected={section === item.key}
                role="tab"
              >
                {item.icon}
                {item.label}
                {item.key === 'testimonials' && stats.pending > 0 && (
                  <span className="ml-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    {stats.pending}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Section body */}
          <div className="p-6">
            {section === 'testimonials' && (
              <TestimonialList
                testimonials={testimonials}
                loading={loading}
                onApprove={approveTestimonial}
                onReject={rejectTestimonial}
                onDelete={deleteTestimonial}
                onToggleFeatured={toggleFeatured}
              />
            )}
            {section === 'embed' && (
              <EmbedCode userId={currentUser.uid} />
            )}
            {section === 'customize' && (
              <WallCustomizer
                settings={userProfile.wallSettings}
                onSave={updateWallSettings}
                isPro={isPro}
              />
            )}
          </div>
        </div>

        {/* Upgrade CTA (if free) */}
        {!isPro && (
          <div className="mt-6 bg-gradient-to-r from-primary-900 to-primary-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg">Unlock unlimited testimonials</h3>
              <p className="text-primary-200 text-sm mt-1">
                Pro plan includes unlimited testimonials, custom branding, and more for just £9/mo.
              </p>
            </div>
            <Button
              onClick={() => handleUpgrade('pro')}
              loading={upgradeLoading}
              className="flex-shrink-0 bg-white text-primary-700 hover:bg-gray-50 border-0 shadow-md"
            >
              Upgrade to Pro — £9/mo
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
