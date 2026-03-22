import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { getEmbedCode, getWallLink, copyToClipboard } from '../../lib/utils'

interface EmbedCodeProps {
  userId: string
}

export function EmbedCode({ userId }: EmbedCodeProps) {
  const [copied, setCopied] = useState<'iframe' | 'link' | null>(null)

  const wallLink = getWallLink(userId)
  const iframeCode = getEmbedCode(userId)

  async function handleCopy(type: 'iframe' | 'link') {
    const text = type === 'iframe' ? iframeCode : wallLink
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Wall link */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Standalone wall page</h3>
        <p className="text-sm text-gray-500 mb-3">
          Share this URL directly with visitors to show your testimonial wall.
        </p>
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-xs text-gray-700 overflow-x-auto whitespace-nowrap">
            {wallLink}
          </div>
          <Button
            size="sm"
            variant={copied === 'link' ? 'secondary' : 'outline'}
            onClick={() => handleCopy('link')}
            aria-label="Copy wall link"
          >
            {copied === 'link' ? (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </span>
            ) : 'Copy'}
          </Button>
        </div>
      </div>

      {/* iFrame embed */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Embed on your website</h3>
        <p className="text-sm text-gray-500 mb-3">
          Paste this snippet anywhere in your website's HTML to embed your testimonial wall.
        </p>
        <div className="relative bg-gray-900 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span className="text-xs text-gray-400 font-mono">HTML</span>
            <Button
              size="sm"
              variant={copied === 'iframe' ? 'secondary' : 'ghost'}
              onClick={() => handleCopy('iframe')}
              className="text-xs text-gray-300 hover:text-white"
              aria-label="Copy embed code"
            >
              {copied === 'iframe' ? (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </span>
              )}
            </Button>
          </div>
          <pre className="px-4 py-4 text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap break-all">
            <code>{iframeCode}</code>
          </pre>
        </div>
      </div>

      {/* Preview */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Preview</h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 border-b border-gray-200">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="ml-2 text-xs text-gray-500 font-mono truncate">{wallLink}</span>
          </div>
          <div className="relative" style={{ paddingBottom: '40%' }}>
            <iframe
              src={wallLink}
              title="Your testimonial wall preview"
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
