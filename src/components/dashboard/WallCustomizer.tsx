import React, { useState } from 'react'
import { Button } from '../ui/Button'
import type { WallSettings, WallLayout, WallTheme } from '../../types'

interface WallCustomizerProps {
  settings: WallSettings
  onSave: (settings: Partial<WallSettings>) => Promise<void>
  isPro: boolean
}

const FONT_OPTIONS = ['Inter', 'Georgia', 'Playfair Display', 'Roboto', 'Lato']

const LAYOUT_OPTIONS: { value: WallLayout; label: string; icon: React.ReactNode }[] = [
  {
    value: 'grid',
    label: 'Grid',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    value: 'masonry',
    label: 'Masonry',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
  },
  {
    value: 'carousel',
    label: 'Carousel',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
  },
]

const THEME_OPTIONS: { value: WallTheme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const COLOR_PRESETS = [
  '#7c3aed',
  '#2563eb',
  '#16a34a',
  '#dc2626',
  '#d97706',
  '#0891b2',
  '#be185d',
  '#374151',
]

export function WallCustomizer({ settings, onSave, isPro }: WallCustomizerProps) {
  const [localSettings, setLocalSettings] = useState<WallSettings>(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(localSettings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  function updateSetting<K extends keyof WallSettings>(key: K, value: WallSettings[K]) {
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
  }

  const ProBadge = () => (
    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700">
      Pro
    </span>
  )

  return (
    <div className="space-y-8">
      {!isPro && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-primary-900">Customisation requires Pro</p>
            <p className="text-sm text-primary-700 mt-0.5">Upgrade to Pro to unlock custom branding, layouts, and colours.</p>
          </div>
        </div>
      )}

      {/* Theme */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Theme <ProBadge />
        </label>
        <div className="flex gap-3">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => isPro && updateSetting('theme', option.value)}
              disabled={!isPro}
              className={[
                'flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all',
                localSettings.theme === option.value
                  ? 'border-primary-600 text-primary-700 bg-primary-50'
                  : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300',
                !isPro ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}
              aria-pressed={localSettings.theme === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Layout <ProBadge />
        </label>
        <div className="flex gap-3">
          {LAYOUT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => isPro && updateSetting('layout', option.value)}
              disabled={!isPro}
              className={[
                'flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-lg border-2 text-xs font-medium transition-all',
                localSettings.layout === option.value
                  ? 'border-primary-600 text-primary-700 bg-primary-50'
                  : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300',
                !isPro ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}
              aria-pressed={localSettings.layout === option.value}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Color */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Accent colour <ProBadge />
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              onClick={() => isPro && updateSetting('primaryColor', color)}
              disabled={!isPro}
              className={[
                'w-8 h-8 rounded-full transition-transform border-2',
                localSettings.primaryColor === color
                  ? 'border-gray-900 scale-110 shadow-md'
                  : 'border-transparent hover:scale-105',
                !isPro ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}
              style={{ backgroundColor: color }}
              aria-label={`Set accent colour to ${color}`}
              aria-pressed={localSettings.primaryColor === color}
            />
          ))}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={localSettings.primaryColor}
              onChange={(e) => isPro && updateSetting('primaryColor', e.target.value)}
              disabled={!isPro}
              className={['w-8 h-8 rounded cursor-pointer border border-gray-200', !isPro ? 'opacity-50 cursor-not-allowed' : ''].join(' ')}
              aria-label="Custom accent colour"
            />
            <span className="text-xs text-gray-500 font-mono">{localSettings.primaryColor}</span>
          </div>
        </div>
      </div>

      {/* Font */}
      <div>
        <label htmlFor="font-select" className="block text-sm font-semibold text-gray-700 mb-3">
          Font family <ProBadge />
        </label>
        <select
          id="font-select"
          value={localSettings.fontFamily}
          onChange={(e) => isPro && updateSetting('fontFamily', e.target.value)}
          disabled={!isPro}
          className={[
            'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            !isPro ? 'opacity-50 cursor-not-allowed' : '',
          ].join(' ')}
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Save */}
      {isPro && (
        <Button
          onClick={handleSave}
          loading={saving}
          variant={saved ? 'secondary' : 'primary'}
          className="w-full"
        >
          {saved ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </span>
          ) : 'Save customisation'}
        </Button>
      )}
    </div>
  )
}
