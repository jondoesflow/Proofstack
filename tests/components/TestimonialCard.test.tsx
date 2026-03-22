import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestimonialCard } from '../../src/components/ui/TestimonialCard'
import type { Testimonial } from '../../src/types'

const mockTestimonial: Testimonial = {
  id: 'test-1',
  userId: 'user-123',
  name: 'Alice Johnson',
  role: 'CTO',
  company: 'TechCorp',
  testimonialText: 'An absolutely fantastic experience from start to finish. Highly recommended!',
  rating: 5,
  photoUrl: '',
  status: 'approved',
  createdAt: new Date('2024-01-15'),
  approvedAt: new Date('2024-01-16'),
  featured: false,
}

describe('TestimonialCard', () => {
  it('renders testimonial text', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />)
    expect(screen.getByText(/absolutely fantastic/i)).toBeInTheDocument()
  })

  it('renders the author name', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />)
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
  })

  it('renders role and company', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />)
    expect(screen.getByText(/CTO.*TechCorp/)).toBeInTheDocument()
  })

  it('renders initials when no photoUrl', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />)
    expect(screen.getByText('AJ')).toBeInTheDocument()
  })

  it('has article role with accessible label', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />)
    expect(screen.getByRole('article', { name: /testimonial from alice johnson/i })).toBeInTheDocument()
  })

  it('renders featured badge when featured=true', () => {
    render(<TestimonialCard testimonial={{ ...mockTestimonial, featured: true }} />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('does not render featured badge when featured=false', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />)
    expect(screen.queryByText('Featured')).not.toBeInTheDocument()
  })

  it('renders dark theme without errors', () => {
    render(<TestimonialCard testimonial={mockTestimonial} theme="dark" />)
    const article = screen.getByRole('article')
    expect(article.className).toContain('bg-gray-800')
  })

  it('renders light theme by default', () => {
    render(<TestimonialCard testimonial={mockTestimonial} />)
    const article = screen.getByRole('article')
    expect(article.className).toContain('bg-white')
  })

  it('renders photo when photoUrl is provided', () => {
    const t = { ...mockTestimonial, photoUrl: 'https://example.com/photo.jpg' }
    render(<TestimonialCard testimonial={t} />)
    const img = screen.getByAltText("Alice Johnson's photo")
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg')
  })
})
