import { useState, useCallback } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import type { WallSettings } from '../types'

export function useUser() {
  const { userProfile, refreshProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateWallSettings = useCallback(
    async (settings: Partial<WallSettings>) => {
      if (!userProfile) return
      setSaving(true)
      setError(null)
      try {
        const updatedSettings = { ...userProfile.wallSettings, ...settings }
        await updateDoc(doc(db, 'proofstack_users', userProfile.uid), {
          wallSettings: updatedSettings,
        })
        await refreshProfile()
      } catch (err) {
        console.error('Error updating wall settings:', err)
        setError('Failed to save settings')
      } finally {
        setSaving(false)
      }
    },
    [userProfile, refreshProfile]
  )

  const updateBusinessName = useCallback(
    async (businessName: string) => {
      if (!userProfile) return
      setSaving(true)
      setError(null)
      try {
        await updateDoc(doc(db, 'proofstack_users', userProfile.uid), {
          businessName,
        })
        await refreshProfile()
      } catch (err) {
        console.error('Error updating business name:', err)
        setError('Failed to save business name')
      } finally {
        setSaving(false)
      }
    },
    [userProfile, refreshProfile]
  )

  return {
    userProfile,
    saving,
    error,
    updateWallSettings,
    updateBusinessName,
  }
}
