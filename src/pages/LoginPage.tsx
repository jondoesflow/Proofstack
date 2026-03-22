import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'

export function LoginPage() {
  const [params] = useSearchParams()
  const defaultMode = params.get('mode') === 'signup' ? 'signup' : 'login'
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signIn, signUp, currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true })
    }
  }, [currentUser, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (mode === 'signup') {
      if (!displayName.trim()) return setError('Please enter your name.')
      if (!businessName.trim()) return setError('Please enter your business name.')
      if (password.length < 6) return setError('Password must be at least 6 characters.')
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password, displayName.trim(), businessName.trim())
      }
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      if (message.includes('user-not-found') || message.includes('wrong-password') || message.includes('invalid-credential')) {
        setError('Invalid email or password.')
      } else if (message.includes('email-already-in-use')) {
        setError('An account with this email already exists.')
      } else if (message.includes('weak-password')) {
        setError('Password is too weak. Use at least 6 characters.')
      } else if (message.includes('invalid-email')) {
        setError('Please enter a valid email address.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <head>
        <title>{mode === 'login' ? 'Sign in to ProofStack' : 'Create your ProofStack account'}</title>
      </head>
      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-2xl font-bold text-white hover:text-primary-200 transition-colors"
              aria-label="Go to ProofStack home"
            >
              <span className="w-10 h-10 bg-white/20 border border-white/30 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                P
              </span>
              ProofStack
            </Link>
            <p className="text-primary-300 mt-2 text-sm">
              {mode === 'login' ? 'Welcome back' : 'Start collecting testimonials in minutes'}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Tab switcher */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                className={[
                  'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                  mode === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700',
                ].join(' ')}
                onClick={() => { setMode('login'); setError(null) }}
                aria-pressed={mode === 'login'}
              >
                Sign in
              </button>
              <button
                className={[
                  'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                  mode === 'signup' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700',
                ].join(' ')}
                onClick={() => { setMode('signup'); setError(null) }}
                aria-pressed={mode === 'signup'}
              >
                Create account
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Your name <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      autoComplete="name"
                      placeholder="Jane Smith"
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Business / brand name <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                      autoComplete="organization"
                      placeholder="Acme Design Co."
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full" size="lg">
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </Button>
            </form>

            {mode === 'signup' && (
              <p className="text-xs text-gray-400 text-center mt-4">
                By creating an account you agree to our{' '}
                <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>.
              </p>
            )}
          </div>

          <p className="text-center text-primary-300 text-sm mt-6">
            <Link to="/" className="hover:text-white transition-colors">
              ← Back to ProofStack.app
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
