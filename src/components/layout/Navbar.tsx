import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/Button'

export function Navbar() {
  const { currentUser, logOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogOut() {
    await logOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-100 shadow-sm">
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
          aria-label="ProofStack home"
        >
          <span className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
            P
          </span>
          ProofStack
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/#features"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Features
          </Link>
          <Link
            to="/#pricing"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Pricing
          </Link>
          <Link
            to="/#faq"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            FAQ
          </Link>
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/login?mode=signup">
                <Button size="sm">
                  Start free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-2"
        >
          <Link
            to="/#features"
            className="block py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            to="/#pricing"
            className="block py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link
            to="/#faq"
            className="block py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
            onClick={() => setMenuOpen(false)}
          >
            FAQ
          </Link>
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            {currentUser ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogOut} className="w-full">
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link to="/login?mode=signup" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Start free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
