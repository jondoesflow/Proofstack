import { describe, it, expect, vi } from 'vitest'
import {
  formatDate,
  truncate,
  getInitials,
  getCollectionLink,
  getWallLink,
  getEmbedCode,
  isValidEmail,
  isValidUrl,
  getPlanDisplayName,
  getMonthStart,
} from '../../src/lib/utils'

// Mock import.meta.env
vi.mock('../../src/lib/utils', async () => {
  const actual = await vi.importActual<typeof import('../../src/lib/utils')>('../../src/lib/utils')
  return {
    ...actual,
  }
})

describe('formatDate', () => {
  it('formats a date correctly', () => {
    const date = new Date('2024-03-15T12:00:00Z')
    const result = formatDate(date)
    expect(result).toContain('2024')
    expect(result).toMatch(/Mar|March/)
  })

  it('returns empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('')
  })
})

describe('truncate', () => {
  it('returns original string if within limit', () => {
    expect(truncate('Hello', 10)).toBe('Hello')
  })

  it('truncates long strings', () => {
    const result = truncate('Hello, World!', 5)
    expect(result).toHaveLength(6) // 5 chars + ellipsis
    expect(result).toContain('…')
  })

  it('returns exact-length string unchanged', () => {
    expect(truncate('Hello', 5)).toBe('Hello')
  })
})

describe('getInitials', () => {
  it('gets initials from two-part name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('gets initial from single name', () => {
    expect(getInitials('Alice')).toBe('A')
  })

  it('gets only first two initials from multi-part name', () => {
    expect(getInitials('Mary Jane Watson')).toBe('MJ')
  })

  it('uppercases initials', () => {
    expect(getInitials('jane doe')).toBe('JD')
  })
})

describe('isValidEmail', () => {
  it('validates correct email', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('rejects email without @', () => {
    expect(isValidEmail('notanemail')).toBe(false)
  })

  it('rejects email without domain', () => {
    expect(isValidEmail('user@')).toBe(false)
  })

  it('validates complex email', () => {
    expect(isValidEmail('user.name+tag@sub.domain.co.uk')).toBe(true)
  })
})

describe('isValidUrl', () => {
  it('validates https URL', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
  })

  it('validates http URL', () => {
    expect(isValidUrl('http://example.com/path?q=1')).toBe(true)
  })

  it('rejects plain text', () => {
    expect(isValidUrl('not a url')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isValidUrl('')).toBe(false)
  })
})

describe('getPlanDisplayName', () => {
  it('returns Free for free plan', () => {
    expect(getPlanDisplayName('free')).toBe('Free')
  })

  it('returns Pro for pro plan', () => {
    expect(getPlanDisplayName('pro')).toBe('Pro')
  })

  it('returns Business for business plan', () => {
    expect(getPlanDisplayName('business')).toBe('Business')
  })

  it('returns Free for unknown plan', () => {
    expect(getPlanDisplayName('unknown')).toBe('Free')
  })
})

describe('getMonthStart', () => {
  it('returns a Date object', () => {
    expect(getMonthStart()).toBeInstanceOf(Date)
  })

  it('returns the first day of current month', () => {
    const result = getMonthStart()
    expect(result.getDate()).toBe(1)
    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
  })
})

describe('getCollectionLink', () => {
  it('returns a URL with userId', () => {
    const link = getCollectionLink('user123')
    expect(link).toContain('user123')
    expect(link).toContain('/collect/')
  })
})

describe('getWallLink', () => {
  it('returns a URL with userId', () => {
    const link = getWallLink('user456')
    expect(link).toContain('user456')
    expect(link).toContain('/wall/')
  })
})

describe('getEmbedCode', () => {
  it('returns an iframe tag', () => {
    const code = getEmbedCode('user789')
    expect(code).toContain('<iframe')
    expect(code).toContain('user789')
    expect(code).toContain('</iframe>')
  })

  it('includes width and height attributes', () => {
    const code = getEmbedCode('user789')
    expect(code).toContain('width="100%"')
    expect(code).toContain('height="600"')
  })
})
