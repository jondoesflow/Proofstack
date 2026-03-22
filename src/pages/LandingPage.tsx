import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { StarRating } from '../components/ui/StarRating'
import { Button } from '../components/ui/Button'
import { PRICING_PLANS } from '../lib/stripe'

// ─── Fake demo testimonials ────────────────────────────────────────────
const DEMO_TESTIMONIALS = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    role: 'Founder',
    company: 'Bloom Studio',
    testimonialText: 'Working with Alex was a total game-changer. Our new website increased conversions by 40% in the first month. I can\'t recommend them enough!',
    rating: 5,
    initials: 'SM',
    color: 'bg-pink-100 text-pink-700',
  },
  {
    id: '2',
    name: 'Tom Henderson',
    role: 'Head of Engineering',
    company: 'NovaTech',
    testimonialText: 'Exceptional technical expertise and communication throughout. Delivered a complex API integration on time and under budget.',
    rating: 5,
    initials: 'TH',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: '3',
    name: 'Priya Sharma',
    role: 'Marketing Director',
    company: 'Spark Agency',
    testimonialText: 'The rebrand they created for us perfectly captured our vision. Professional, creative, and incredibly responsive. Five stars easily.',
    rating: 5,
    initials: 'PS',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: '4',
    name: 'James Okafor',
    role: 'CEO',
    company: 'BuildRight',
    testimonialText: 'I\'ve hired many freelancers over the years. This was by far the smoothest experience. Clear communication, quality work, on-time delivery.',
    rating: 5,
    initials: 'JO',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: '5',
    name: 'Emma Clarke',
    role: 'Product Manager',
    company: 'Finflow',
    testimonialText: 'Absolutely transformed our onboarding flow. User drop-off reduced by 60%. Worth every penny and then some.',
    rating: 5,
    initials: 'EC',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    id: '6',
    name: 'David Park',
    role: 'Creative Director',
    company: 'Pixel & Co',
    testimonialText: 'Rarely do you find someone who combines technical skill with genuine creative flair. A true professional who goes above and beyond.',
    rating: 5,
    initials: 'DP',
    color: 'bg-teal-100 text-teal-700',
  },
]

const PROOFSTACK_TESTIMONIALS = [
  {
    name: 'Chris Lawson',
    role: 'Freelance Designer',
    text: 'ProofStack paid for itself within a week. Two new clients mentioned my testimonial wall as the reason they reached out.',
    rating: 5,
    initials: 'CL',
  },
  {
    name: 'Aisha Bangura',
    role: 'SEO Consultant',
    text: 'Incredibly easy to set up. My clients actually enjoy filling in the form, and the wall looks stunning on my site.',
    rating: 5,
    initials: 'AB',
  },
  {
    name: 'Marcus Webb',
    role: 'Developer & Agency Owner',
    text: 'We use ProofStack for all 12 of our client sites now. The Business plan is fantastic value and the support is excellent.',
    rating: 5,
    initials: 'MW',
  },
]

const FAQS = [
  {
    q: 'How do I collect testimonials with ProofStack?',
    a: 'Simply share your unique collection link with your clients. They fill in a simple form with their name, role, testimonial text, and star rating. You approve it and it appears on your wall instantly.',
  },
  {
    q: 'Can I embed the testimonial wall on my website?',
    a: 'Yes! You can embed your testimonial wall using a simple iframe snippet. Copy the embed code from your dashboard and paste it anywhere on your website — no coding required.',
  },
  {
    q: 'What is the free plan limit?',
    a: 'The free plan allows you to collect and display up to 3 approved testimonials. Upgrade to Pro for unlimited testimonials, custom branding, and more.',
  },
  {
    q: 'Can I customise the look of my testimonial wall?',
    a: 'Pro and Business plan users can fully customise the wall: choose grid, carousel, or masonry layouts, set custom accent colours, and choose from multiple font options.',
  },
  {
    q: 'Is there a setup fee or long-term contract?',
    a: 'No setup fees, no contracts. Start free and upgrade when you need more features. Cancel your subscription anytime — no questions asked.',
  },
  {
    q: 'Do testimonials appear automatically?',
    a: 'No — you review and approve all testimonials before they appear on your wall. This ensures only genuine, high-quality testimonials are displayed to your visitors.',
  },
  {
    q: 'What happens if I cancel my subscription?',
    a: 'You keep access to Pro features until the end of your billing period. After that, your account reverts to the free plan and only your first 3 approved testimonials remain visible.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full flex items-start justify-between gap-4 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-medium text-gray-900 text-sm sm:text-base">{q}</span>
        <svg
          className={['w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 mt-0.5', open ? 'rotate-180' : ''].join(' ')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-sm text-gray-600 leading-relaxed pr-8">
          {a}
        </div>
      )}
    </div>
  )
}

export function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white pt-24 pb-20 sm:pt-32 sm:pb-28">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary-600/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
              Trusted by 2,400+ freelancers &amp; founders
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Turn Happy Clients into
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-pink-300">
                Your Best Sales Tool
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-primary-200 max-w-2xl mx-auto mb-10 leading-relaxed">
              Collect, manage, and display beautiful testimonials that convert visitors into customers.
              Share a link, clients submit in seconds, and your wall goes live instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login?mode=signup">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary-700 hover:bg-gray-50 shadow-lg shadow-black/20 border-0">
                  Start collecting free
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <a href="#demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                  See live demo
                </Button>
              </a>
            </div>

            <p className="mt-6 text-sm text-primary-300">No credit card required · Free forever plan · Setup in 2 minutes</p>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="bg-white border-b border-gray-100" aria-label="Key statistics">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { value: '2,400+', label: 'Testimonials collected' },
                { value: '98%', label: 'Approval rate' },
                { value: '40%', label: 'Avg conversion lift' },
                { value: '< 2 min', label: 'To get your first testimonial' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-2xl sm:text-3xl font-extrabold text-primary-600">{stat.value}</dt>
                  <dd className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="features" className="py-24 bg-white" aria-labelledby="how-it-works-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Simple by design</p>
              <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                Three steps to social proof
              </h2>
              <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
                No complicated setup. No code needed. Get your testimonial wall live in under 2 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-200 to-primary-300" aria-hidden="true" />

              {[
                {
                  step: '01',
                  title: 'Share your link',
                  description: 'Get a unique collection URL from your dashboard. Share it with clients via email, invoice, or social media.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  ),
                },
                {
                  step: '02',
                  title: 'Clients submit',
                  description: 'Clients fill in a beautiful, branded form in under 60 seconds. They can add a photo, rating, and detailed review.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  ),
                },
                {
                  step: '03',
                  title: 'Beautiful wall goes live',
                  description: 'Approve testimonials with one click. They appear instantly on your wall, ready to embed anywhere on your site.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  ),
                },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        {item.icon}
                      </svg>
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Demo Wall ── */}
        <section id="demo" className="py-24 bg-gray-50" aria-labelledby="demo-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">See it in action</p>
              <h2 id="demo-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                What your wall could look like
              </h2>
              <p className="mt-4 text-gray-500 max-w-lg mx-auto">
                A fully customisable testimonial wall that matches your brand perfectly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEMO_TESTIMONIALS.map((t) => (
                <article
                  key={t.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  aria-label={`Testimonial from ${t.name}`}
                >
                  <StarRating value={t.rating} readonly size="sm" />
                  <blockquote className="mt-4 text-sm text-gray-600 leading-relaxed">
                    "{t.testimonialText}"
                  </blockquote>
                  <footer className="mt-5 flex items-center gap-3 pt-4 border-t border-gray-50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${t.color}`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role} @ {t.company}</p>
                    </div>
                  </footer>
                </article>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/login?mode=signup">
                <Button size="lg">
                  Create your wall free
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="py-24 bg-white" aria-labelledby="pricing-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Simple pricing</p>
              <h2 id="pricing-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                Start free, upgrade when you're ready
              </h2>
              <p className="mt-4 text-gray-500 max-w-xl mx-auto">
                No contracts. No hidden fees. Cancel anytime. All plans include core features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {PRICING_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={[
                    'rounded-2xl border p-8 relative',
                    plan.highlighted
                      ? 'border-primary-600 shadow-xl shadow-primary-100 bg-gradient-to-b from-primary-50 to-white'
                      : 'border-gray-200 bg-white shadow-sm',
                  ].join(' ')}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                        Most popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-gray-900">
                        {plan.price === 0 ? 'Free' : `£${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-400 text-sm pb-1.5">/{plan.period}</span>
                      )}
                    </div>
                    {plan.price === 0 && (
                      <p className="text-xs text-gray-400 mt-1">forever</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.price === 0 ? '/login?mode=signup' : '/login?mode=signup&plan=' + plan.id}>
                    <Button
                      variant={plan.highlighted ? 'primary' : 'outline'}
                      className="w-full"
                      size="md"
                    >
                      {plan.price === 0 ? 'Get started free' : `Start ${plan.name}`}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-400 mt-8">
              All plans include SSL security, 99.9% uptime SLA, and GDPR compliance.
            </p>
          </div>
        </section>

        {/* ── Loved by freelancers ── */}
        <section className="py-24 bg-gray-50" aria-labelledby="social-proof-heading">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Don't take our word for it</p>
              <h2 id="social-proof-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                Loved by freelancers &amp; founders
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PROOFSTACK_TESTIMONIALS.map((t) => (
                <article
                  key={t.name}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <StarRating value={t.rating} readonly size="sm" />
                  <blockquote className="mt-4 text-sm text-gray-600 leading-relaxed">"{t.text}"</blockquote>
                  <footer className="mt-5 flex items-center gap-3 pt-4 border-t border-gray-50">
                    <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-24 bg-white" aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Questions &amp; Answers</p>
              <h2 id="faq-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                Frequently asked questions
              </h2>
            </div>
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
            <div className="text-center mt-10">
              <p className="text-gray-500 text-sm">
                Still have questions?{' '}
                <a href="mailto:hello@proofstack-app.netlify.app" className="text-primary-600 hover:underline font-medium">
                  Email us anytime
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-24 bg-gradient-to-br from-primary-900 to-primary-800 text-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Ready to turn your clients into advocates?
            </h2>
            <p className="text-primary-200 text-lg mb-10">
              Join thousands of freelancers and founders collecting testimonials that actually convert.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login?mode=signup">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary-700 hover:bg-gray-50 border-0 shadow-lg">
                  Start free — no credit card needed
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
