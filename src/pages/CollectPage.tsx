import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { submitTestimonial } from '../hooks/useTestimonials'
import { StarRating } from '../components/ui/StarRating'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import type { ProofStackUser, TestimonialFormData } from '../types'

const MIN_TEXT_LENGTH = 20

export function CollectPage() {
  const { userId } = useParams<{ userId: string }>()
  const [owner, setOwner] = useState<Pick<ProofStackUser, 'businessName' | 'displayName'> | null>(null)
  const [ownerLoading, setOwnerLoading] = useState(true)
  const [ownerError, setOwnerError] = useState(false)

  const [form, setForm] = useState<TestimonialFormData>({
    name: '',
    role: '',
    company: '',
    testimonialText: '',
    rating: 5,
    photoUrl: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof TestimonialFormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function fetchOwner() {
      if (!userId) {
        setOwnerError(true)
        setOwnerLoading(false)
        return
      }
      try {
        const snap = await getDoc(doc(db, 'proofstack_users', userId))
        if (snap.exists()) {
          const data = snap.data()
          setOwner({ businessName: data.businessName, displayName: data.displayName })
        } else {
          setOwnerError(true)
        }
      } catch {
        setOwnerError(true)
      } finally {
        setOwnerLoading(false)
      }
    }
    fetchOwner()
  }, [userId])

  function validate(): boolean {
    const newErrors: Partial<Record<keyof TestimonialFormData, string>> = {}
    if (!form.name.trim()) newErrors.name = 'Please enter your name.'
    if (!form.testimonialText.trim()) newErrors.testimonialText = 'Please write your testimonial.'
    else if (form.testimonialText.trim().length < MIN_TEXT_LENGTH) {
      newErrors.testimonialText = `Your testimonial should be at least ${MIN_TEXT_LENGTH} characters.`
    }
    if (form.rating < 1 || form.rating > 5) newErrors.rating = 'Please select a rating.'
    if (form.photoUrl && !isValidUrl(form.photoUrl)) newErrors.photoUrl = 'Please enter a valid URL.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function isValidUrl(url: string): boolean {
    try { new URL(url); return true } catch { return false }
  }

  function update<K extends keyof TestimonialFormData>(key: K, value: TestimonialFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !userId) return
    setSubmitting(true)
    try {
      await submitTestimonial(userId, form)
      setSubmitted(true)
    } catch (err) {
      console.error('Submit error:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const pageTitle = owner
    ? `Leave a testimonial for ${owner.businessName}`
    : 'Leave a testimonial'

  if (ownerLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (ownerError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-500 text-sm">This testimonial collection link doesn't exist or has expired.</p>
          <Link to="/" className="text-primary-600 hover:underline text-sm mt-4 inline-block">← Back to ProofStack</Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Thank you, {form.name.split(' ')[0]}!</h1>
          <p className="text-gray-600 leading-relaxed mb-8">
            Your testimonial has been submitted and is pending review by {owner?.businessName ?? 'the team'}. We really appreciate you taking the time to share your experience.
          </p>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-left">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: form.rating }).map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-700 italic mb-4">"{form.testimonialText}"</p>
            <p className="text-sm font-semibold text-gray-900">{form.name}</p>
            {(form.role || form.company) && (
              <p className="text-xs text-gray-500">{[form.role, form.company].filter(Boolean).join(' @ ')}</p>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-8">
            Powered by{' '}
            <a href="https://proofstack.app" className="text-primary-600 hover:underline">ProofStack</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <head>
        <title>{pageTitle}</title>
        <meta name="robots" content="noindex" />
      </head>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-lg mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-sm">
              {owner?.businessName?.charAt(0).toUpperCase() ?? 'P'}
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Leave a testimonial for{' '}
              <span className="text-primary-600">{owner?.businessName}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Help others discover great work. It only takes 2 minutes!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
            {/* Rating */}
            <fieldset>
              <legend className="block text-sm font-semibold text-gray-700 mb-3">
                Star rating <span className="text-red-500" aria-hidden="true">*</span>
              </legend>
              <StarRating value={form.rating} onChange={(v) => update('rating', v)} size="lg" label="Select your star rating" />
              {errors.rating && <p className="text-red-600 text-xs mt-1" role="alert">{errors.rating}</p>}
            </fieldset>

            {/* Name */}
            <div>
              <label htmlFor="t-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Your name <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="t-name"
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
                placeholder="Jane Smith"
                autoComplete="name"
                className={[
                  'w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300',
                ].join(' ')}
              />
              {errors.name && <p className="text-red-600 text-xs mt-1" role="alert">{errors.name}</p>}
            </div>

            {/* Role + Company */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="t-role" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Job title / role
                </label>
                <input
                  id="t-role"
                  type="text"
                  value={form.role}
                  onChange={(e) => update('role', e.target.value)}
                  placeholder="Designer"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="t-company" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Company
                </label>
                <input
                  id="t-company"
                  type="text"
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                  placeholder="Acme Corp"
                  autoComplete="organization"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Testimonial text */}
            <div>
              <label htmlFor="t-text" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Your testimonial <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <textarea
                id="t-text"
                value={form.testimonialText}
                onChange={(e) => update('testimonialText', e.target.value)}
                required
                rows={5}
                placeholder="Share your experience working with us. What problem did we solve? What was the outcome? Would you recommend us?"
                className={[
                  'w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 resize-y',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  errors.testimonialText ? 'border-red-300 bg-red-50' : 'border-gray-300',
                ].join(' ')}
                aria-describedby="t-text-hint"
              />
              <div className="flex justify-between mt-1">
                <span id="t-text-hint" className="text-xs text-gray-400">Aim for at least {MIN_TEXT_LENGTH} characters for best results</span>
                <span className={['text-xs', form.testimonialText.length < MIN_TEXT_LENGTH ? 'text-gray-400' : 'text-green-600'].join(' ')}>
                  {form.testimonialText.length} chars
                </span>
              </div>
              {errors.testimonialText && <p className="text-red-600 text-xs mt-1" role="alert">{errors.testimonialText}</p>}
            </div>

            {/* Photo URL */}
            <div>
              <label htmlFor="t-photo" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Photo URL <span className="text-gray-400 font-normal text-xs ml-1">(optional)</span>
              </label>
              <input
                id="t-photo"
                type="url"
                value={form.photoUrl}
                onChange={(e) => update('photoUrl', e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
                className={[
                  'w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  errors.photoUrl ? 'border-red-300 bg-red-50' : 'border-gray-300',
                ].join(' ')}
              />
              <p className="text-xs text-gray-400 mt-1">Add a link to your headshot or LinkedIn photo</p>
              {errors.photoUrl && <p className="text-red-600 text-xs mt-1" role="alert">{errors.photoUrl}</p>}
            </div>

            <Button type="submit" loading={submitting} className="w-full" size="lg">
              Submit testimonial
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Powered by{' '}
            <a href="https://proofstack.app" className="text-primary-600 hover:underline">ProofStack</a>
            {' '}· Your data is handled in accordance with GDPR
          </p>
        </div>
      </div>
    </>
  )
}
