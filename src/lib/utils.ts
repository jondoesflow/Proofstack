/**
 * Simple class name merger (no external dependency)
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs
    .filter(Boolean)
    .join(' ')
}

/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date | undefined): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/**
 * Truncate text to a max length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

/**
 * Get the app base URL
 */
export function getAppUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return import.meta.env.VITE_APP_URL || 'https://proofstack.app'
}

/**
 * Get collection link for a user
 */
export function getCollectionLink(userId: string): string {
  return `${getAppUrl()}/collect/${userId}`
}

/**
 * Get wall link for a user
 */
export function getWallLink(userId: string): string {
  return `${getAppUrl()}/wall/${userId}`
}

/**
 * Get embed iframe code
 */
export function getEmbedCode(userId: string): string {
  const wallUrl = getWallLink(userId)
  return `<iframe src="${wallUrl}" width="100%" height="600" frameborder="0" loading="lazy" title="Customer Testimonials"></iframe>`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch {
      document.body.removeChild(textArea)
      return false
    }
  }
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get plan display name
 */
export function getPlanDisplayName(plan: string): string {
  switch (plan) {
    case 'pro':
      return 'Pro'
    case 'business':
      return 'Business'
    default:
      return 'Free'
  }
}

/**
 * Get month start date
 */
export function getMonthStart(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}
