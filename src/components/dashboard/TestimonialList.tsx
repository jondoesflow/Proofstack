import React, { useState } from 'react'
import { StarRating } from '../ui/StarRating'
import { Button } from '../ui/Button'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { formatDate, getInitials } from '../../lib/utils'
import type { Testimonial, TestimonialStatus } from '../../types'

interface TestimonialListProps {
  testimonials: Testimonial[]
  loading: boolean
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onToggleFeatured: (id: string, featured: boolean) => Promise<void>
}

type TabFilter = 'all' | TestimonialStatus

const tabs: { label: string; value: TabFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
]

export function TestimonialList({
  testimonials,
  loading,
  onApprove,
  onReject,
  onDelete,
  onToggleFeatured,
}: TestimonialListProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered =
    activeTab === 'all'
      ? testimonials
      : testimonials.filter((t) => t.status === activeTab)

  async function handleAction(id: string, action: () => Promise<void>) {
    setActionLoading(id)
    try {
      await action()
    } finally {
      setActionLoading(null)
    }
  }

  const counts = {
    all: testimonials.length,
    pending: testimonials.filter((t) => t.status === 'pending').length,
    approved: testimonials.filter((t) => t.status === 'approved').length,
    rejected: testimonials.filter((t) => t.status === 'rejected').length,
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6" role="tablist" aria-label="Filter testimonials">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={[
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 -mb-px',
              activeTab === tab.value
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ].join(' ')}
          >
            {tab.label}
            <span
              className={[
                'ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium',
                activeTab === tab.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600',
              ].join(' ')}
            >
              {counts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <p className="font-medium">No testimonials yet</p>
          <p className="text-sm mt-1">Share your collection link to start receiving testimonials.</p>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {filtered.map((t) => (
          <article
            key={t.id}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {t.photoUrl ? (
                  <img
                    src={t.photoUrl}
                    alt={`${t.name}'s photo`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold" aria-hidden="true">
                    {getInitials(t.name)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <span className="font-semibold text-gray-900">{t.name}</span>
                    {(t.role || t.company) && (
                      <span className="text-gray-500 text-sm ml-2">
                        {[t.role, t.company].filter(Boolean).join(' @ ')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        t.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : t.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700',
                      ].join(' ')}
                    >
                      {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                    </span>
                    <time dateTime={t.createdAt.toISOString()} className="text-xs text-gray-400">
                      {formatDate(t.createdAt)}
                    </time>
                  </div>
                </div>

                <StarRating value={t.rating} readonly size="sm" />

                <p className="mt-2 text-sm text-gray-700 leading-relaxed line-clamp-3">
                  "{t.testimonialText}"
                </p>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {t.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        loading={actionLoading === t.id + '_approve'}
                        onClick={() => handleAction(t.id + '_approve', () => onApprove(t.id))}
                        aria-label={`Approve testimonial from ${t.name}`}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={actionLoading === t.id + '_reject'}
                        onClick={() => handleAction(t.id + '_reject', () => onReject(t.id))}
                        aria-label={`Reject testimonial from ${t.name}`}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {t.status === 'approved' && (
                    <Button
                      size="sm"
                      variant={t.featured ? 'secondary' : 'outline'}
                      onClick={() => handleAction(t.id + '_feat', () => onToggleFeatured(t.id, !t.featured))}
                      aria-label={t.featured ? `Unfeature testimonial from ${t.name}` : `Feature testimonial from ${t.name}`}
                    >
                      {t.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                  )}
                  {t.status === 'rejected' && (
                    <Button
                      size="sm"
                      variant="outline"
                      loading={actionLoading === t.id + '_approve'}
                      onClick={() => handleAction(t.id + '_approve', () => onApprove(t.id))}
                    >
                      Re-approve
                    </Button>
                  )}

                  {deleteConfirm === t.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={actionLoading === t.id + '_delete'}
                        onClick={() => handleAction(t.id + '_delete', () => onDelete(t.id))}
                      >
                        Confirm delete
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteConfirm(t.id)}
                      aria-label={`Delete testimonial from ${t.name}`}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
