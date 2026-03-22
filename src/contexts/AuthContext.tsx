import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { ProofStackUser, WallSettings } from '../types'

interface AuthContextValue {
  currentUser: User | null
  userProfile: ProofStackUser | null
  loading: boolean
  signUp: (email: string, password: string, displayName: string, businessName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const defaultWallSettings: WallSettings = {
  theme: 'light',
  layout: 'grid',
  primaryColor: '#7c3aed',
  fontFamily: 'Inter',
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<ProofStackUser | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchUserProfile(uid: string): Promise<void> {
    try {
      const docRef = doc(db, 'proofstack_users', uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setUserProfile({
          uid,
          email: data.email,
          displayName: data.displayName,
          businessName: data.businessName,
          plan: data.plan,
          createdAt: data.createdAt?.toDate() ?? new Date(),
          stripeCustomerId: data.stripeCustomerId,
          stripeSubscriptionId: data.stripeSubscriptionId,
          wallSettings: data.wallSettings ?? defaultWallSettings,
        })
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  async function signUp(
    email: string,
    password: string,
    displayName: string,
    businessName: string
  ): Promise<void> {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName })

    const userDoc: Omit<ProofStackUser, 'uid' | 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
      email,
      displayName,
      businessName,
      plan: 'free',
      createdAt: serverTimestamp(),
      wallSettings: defaultWallSettings,
    }

    await setDoc(doc(db, 'proofstack_users', user.uid), userDoc)
    await fetchUserProfile(user.uid)
  }

  async function signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logOut(): Promise<void> {
    await signOut(auth)
    setUserProfile(null)
  }

  async function refreshProfile(): Promise<void> {
    if (currentUser) {
      await fetchUserProfile(currentUser.uid)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await fetchUserProfile(user.uid)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value: AuthContextValue = {
    currentUser,
    userProfile,
    loading,
    signUp,
    signIn,
    logOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
