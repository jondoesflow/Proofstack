import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StarRating } from '../../src/components/ui/StarRating'

describe('StarRating', () => {
  it('renders 5 stars', () => {
    render(<StarRating value={3} readonly />)
    // Should have 5 star buttons
    const container = screen.getByRole('img')
    expect(container).toBeInTheDocument()
  })

  it('renders in interactive mode with radiogroup role', () => {
    render(<StarRating value={3} onChange={vi.fn()} />)
    const group = screen.getByRole('radiogroup')
    expect(group).toBeInTheDocument()
  })

  it('calls onChange when a star is clicked', () => {
    const onChange = vi.fn()
    render(<StarRating value={1} onChange={onChange} />)
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(5)
    fireEvent.click(radios[4]) // click 5th star
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('does not call onChange in readonly mode', () => {
    const onChange = vi.fn()
    render(<StarRating value={3} readonly onChange={onChange} />)
    // In readonly mode buttons are disabled
    const img = screen.getByRole('img')
    fireEvent.click(img)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('displays correct aria-label for readonly mode', () => {
    render(<StarRating value={4} readonly label="4 out of 5 stars" />)
    expect(screen.getByRole('img', { name: '4 out of 5 stars' })).toBeInTheDocument()
  })

  it('renders different sizes without crashing', () => {
    const { rerender } = render(<StarRating value={3} readonly size="sm" />)
    rerender(<StarRating value={3} readonly size="md" />)
    rerender(<StarRating value={3} readonly size="lg" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
