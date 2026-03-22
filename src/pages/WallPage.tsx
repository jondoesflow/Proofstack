import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { getApprovedTestimonials } from '../hooks/useTestimonials'
import { TestimonialCard } from '../components/ui/TestimonialCard'
import { StarRating } from '../components/ui/StarRating'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import type { Testimonial, ProofStackUser, WallSettings, WallTheme } from '../types'

export function WallPage() {
  const { userId } = useParams<{ userId: string }>()
  const [searchParams] = useSearchParams()

  const [owner, setOwner] = useState<Pick<ProofStackUser, 'businessName' | 'displayName' | 'wallSettings' | 'plan'> | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filterRating, setFilterRating] = useState(0)
  const [carouselIndex, setCarouselIndex] = useState(0)

  // Query param overrides
  const themeParam = searchParams.get('theme') as WallTheme | null
  const layoutParam = searchParams.get('layout') as WallSettings['layout'] | null

  useEffect(() => {
    async function load() {
      if (!userId) { setError(true); setLoading(false); return }
      try {
        const [userSnap, testimonialList] = await Promise.all([
          getDoc(doc(db, 'proofstack_users', userId)),
          getApprovedTestimonials(userId),
        ])
        if (!userSnap.exists()) { setError(true); setLoading(false); return }
        const data = userSnap.data()
        setOwner({
          businessName: data.businessName,
          displayName: data.displayName,
          plan: data.plan,
          wallSettings: data.wallSettings ?? {
            theme: 'light',
            layout: 'grid',
            primaryColor: '#7c3aed',
            fontFamily: 'Inter',
          },
        })
        setTestimonials(testimonialList)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !owner) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Wall not found</h1>
          <p className="text-gray-500 text-sm">This testimonial wall doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  const effectiveTheme: WallTheme = themeParam ?? owner.wallSettings.theme
  const effectiveLayout = layoutParam ?? owner.wallSettings.layout
  const isDark = effectiveTheme === 'dark'
  const isPro = owner.plan === 'pro' || owner.plan === 'business'

  const filteredTestimonials = filterRating > 0
    ? testimonials.filter((t) => t.rating === filterRating)
    : testimonials

  const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-50'
  const textClass = isDark ? 'text-white' : 'text-gray-900'
  const subtextClass = isDark ? 'text-gray-400' : 'text-gray-500'

  function prevSlide() {
    setCarouselIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length)
  }
  function nextSlide() {
    setCarouselIndex((prev) => (prev + 1) % filteredTestimonials.length)
  }

  const pageTitle = `${owner.businessName} — Customer Testimonials`

  return (
    <>
      <head>
        <title>{pageTitle}</title>
        <meta name="description" content={`Read real customer testimonials and reviews for ${owner.businessName}.`} />
        <meta property="og:title" content={pageTitle} />
        <meta name="robots" content="index, follow" />
      </head>
      <div
        className={['min-h-screen font-sans', bgClass].join(' ')}
        style={{ fontFamily: isPro ? owner.wallSettings.fontFamily : 'Inter' }}
      >
        {/* Header */}
        <header className={['py-12 px-6 text-center border-b', isDark ? 'border-gray-800' : 'border-gray-200'].join(' ')}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow"
            style={{ backgroundColor: isPro ? owner.wallSettings.primaryColor : '#7c3aed' }}
            aria-hidden="true"
          >
            {owner.businessName.charAt(0).toUpperCase()}
          </div>
          <h1 className={['text-2xl sm:text-3xl font-extrabold', textClass].join(' ')}>
            {owner.businessName}
          </h1>
          <p className={['text-sm mt-2', subtextClass].join(' ')}>
            {testimonials.length} verified testimonial{testimonials.length !== 1 ? 's' : ''}
          </p>

          {/* Average rating */}
          {testimonials.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <StarRating
                value={Math.round(testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length)}
                readonly
                size="md"
                label={`Average rating: ${(testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)} stars`}
              />
              <span className={['text-sm font-semibold', textClass].join(' ')}>
                {(testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)}
              </span>
              <span className={['text-xs', subtextClass].join(' ')}>
                ({testimonials.length} reviews)
              </span>
            </div>
          )}

          {/* Filter by rating */}
          {testimonials.length > 2 && (
            <div className="flex items-center justify-center gap-2 mt-5 flex-wrap" role="group" aria-label="Filter by rating">
              <button
                onClick={() => setFilterRating(0)}
                className={[
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                  filterRating === 0
                    ? isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
                    : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300',
                ].join(' ')}
                aria-pressed={filterRating === 0}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRating(r === filterRating ? 0 : r)}
                  className={[
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1',
                    filterRating === r
                      ? isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
                      : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300',
                  ].join(' ')}
                  aria-pressed={filterRating === r}
                >
                  {r}
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {filteredTestimonials.length === 0 ? (
            <div className={['text-center py-20', subtextClass].join(' ')}>
              <p className="text-lg font-medium">No testimonials yet</p>
              <p className="text-sm mt-1">Check back soon!</p>
            </div>
          ) : effectiveLayout === 'carousel' ? (
            /* Carousel layout */
            <div className="relative max-w-2xl mx-auto" aria-live="polite" aria-label="Testimonial carousel">
              <TestimonialCard testimonial={filteredTestimonials[carouselIndex]} theme={effectiveTheme} />
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prevSlide}
                  className={[
                    'p-2 rounded-full transition-colors',
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200',
                  ].join(' ')}
                  aria-label="Previous testimonial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className={['text-sm', subtextClass].join(' ')}>
                  {carouselIndex + 1} / {filteredTestimonials.length}
                </span>
                <button
                  onClick={nextSlide}
                  className={[
                    'p-2 rounded-full transition-colors',
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200',
                  ].join(' ')}
                  aria-label="Next testimonial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              {/* Dots */}
              <div className="flex justify-center gap-1.5 mt-4" role="tablist" aria-label="Testimonial navigation dots">
                {filteredTestimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    className={[
                      'w-2 h-2 rounded-full transition-all',
                      i === carouselIndex ? 'bg-primary-600 w-4' : isDark ? 'bg-gray-600' : 'bg-gray-300',
                    ].join(' ')}
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-selected={i === carouselIndex}
                    role="tab"
                  />
                ))}
              </div>
            </div>
          ) : effectiveLayout === 'masonry' ? (
            /* Masonry layout */
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-0">
              {filteredTestimonials.map((t) => (
                <div key={t.id} className="break-inside-avoid mb-6">
                  <TestimonialCard testimonial={t} theme={effectiveTheme} />
                </div>
              ))}
            </div>
          ) : (
            /* Grid layout (default) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} theme={effectiveTheme} />
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        {!isPro && (
          <footer className={['py-6 text-center border-t', isDark ? 'border-gray-800' : 'border-gray-200'].join(' ')}>
            <a
              href="https://proofstack.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-primary-600 transition-colors"
            >
              Powered by ProofStack
            </a>
          </footer>
        )}
      </div>
    </>
  )
}
