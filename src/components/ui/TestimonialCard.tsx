import React from 'react'
import { StarRating } from './StarRating'
import { getInitials, formatDate } from '../../lib/utils'
import type { Testimonial } from '../../types'

interface TestimonialCardProps {
  testimonial: Testimonial
  theme?: 'light' | 'dark'
}

export function TestimonialCard({ testimonial, theme = 'light' }: TestimonialCardProps) {
  const isDark = theme === 'dark'

  return (
    <article
      className={[
        'rounded-2xl p-6 flex flex-col gap-4 shadow-sm border transition-shadow hover:shadow-md',
        isDark
          ? 'bg-gray-800 border-gray-700 text-white'
          : 'bg-white border-gray-100 text-gray-900',
      ].join(' ')}
      aria-label={`Testimonial from ${testimonial.name}`}
    >
      {/* Rating */}
      <div>
        <StarRating value={testimonial.rating} readonly size="sm" />
      </div>

      {/* Testimonial text */}
      <blockquote
        className={['text-sm leading-relaxed flex-1', isDark ? 'text-gray-300' : 'text-gray-600'].join(' ')}
      >
        <span className="text-2xl text-primary-400 leading-none font-serif">"</span>
        {testimonial.testimonialText}
        <span className="text-2xl text-primary-400 leading-none font-serif">"</span>
      </blockquote>

      {/* Author */}
      <footer className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        {testimonial.photoUrl ? (
          <img
            src={testimonial.photoUrl}
            alt={`${testimonial.name}'s photo`}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              const target = e.currentTarget
              target.style.display = 'none'
              const sibling = target.nextElementSibling as HTMLElement
              if (sibling) sibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div
          className={[
            'w-10 h-10 rounded-full flex-shrink-0 items-center justify-center text-sm font-semibold bg-primary-100 text-primary-700',
            testimonial.photoUrl ? 'hidden' : 'flex',
          ].join(' ')}
          aria-hidden="true"
        >
          {getInitials(testimonial.name)}
        </div>
        <div className="min-w-0">
          <p className={['font-semibold text-sm truncate', isDark ? 'text-white' : 'text-gray-900'].join(' ')}>
            {testimonial.name}
          </p>
          {(testimonial.role || testimonial.company) && (
            <p className={['text-xs truncate', isDark ? 'text-gray-400' : 'text-gray-500'].join(' ')}>
              {[testimonial.role, testimonial.company].filter(Boolean).join(' @ ')}
            </p>
          )}
          {testimonial.approvedAt && (
            <time
              dateTime={testimonial.approvedAt.toISOString()}
              className={['text-xs', isDark ? 'text-gray-500' : 'text-gray-400'].join(' ')}
            >
              {formatDate(testimonial.approvedAt)}
            </time>
          )}
        </div>
        {testimonial.featured && (
          <span className="ml-auto flex-shrink-0 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
            Featured
          </span>
        )}
      </footer>
    </article>
  )
}
