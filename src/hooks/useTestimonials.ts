import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Testimonial, TestimonialFormData, TestimonialStatus, DashboardStats } from '../types'
import { getMonthStart } from '../lib/utils'

export function useTestimonials(userId: string | undefined) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    setLoading(true)
    const q = query(
      collection(db, 'proofstack_testimonials'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate() ?? new Date(),
          approvedAt: d.data().approvedAt?.toDate(),
        })) as Testimonial[]
        setTestimonials(docs)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Error fetching testimonials:', err)
        setError('Failed to load testimonials')
        setLoading(false)
      }
    )

    return unsubscribe
  }, [userId])

  const approveTestimonial = useCallback(async (id: string) => {
    await updateDoc(doc(db, 'proofstack_testimonials', id), {
      status: 'approved',
      approvedAt: serverTimestamp(),
    })
  }, [])

  const rejectTestimonial = useCallback(async (id: string) => {
    await updateDoc(doc(db, 'proofstack_testimonials', id), {
      status: 'rejected',
    })
  }, [])

  const deleteTestimonial = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'proofstack_testimonials', id))
  }, [])

  const toggleFeatured = useCallback(async (id: string, featured: boolean) => {
    await updateDoc(doc(db, 'proofstack_testimonials', id), { featured })
  }, [])

  const getStats = useCallback((): DashboardStats => {
    const monthStart = getMonthStart()
    return {
      total: testimonials.length,
      pending: testimonials.filter((t) => t.status === 'pending').length,
      approved: testimonials.filter((t) => t.status === 'approved').length,
      rejected: testimonials.filter((t) => t.status === 'rejected').length,
      thisMonth: testimonials.filter((t) => t.createdAt >= monthStart).length,
    }
  }, [testimonials])

  const filterByStatus = useCallback(
    (status: TestimonialStatus | 'all') => {
      if (status === 'all') return testimonials
      return testimonials.filter((t) => t.status === status)
    },
    [testimonials]
  )

  return {
    testimonials,
    loading,
    error,
    approveTestimonial,
    rejectTestimonial,
    deleteTestimonial,
    toggleFeatured,
    getStats,
    filterByStatus,
  }
}

export async function submitTestimonial(
  userId: string,
  data: TestimonialFormData
): Promise<void> {
  await addDoc(collection(db, 'proofstack_testimonials'), {
    userId,
    name: data.name,
    role: data.role || '',
    company: data.company || '',
    testimonialText: data.testimonialText,
    rating: data.rating,
    photoUrl: data.photoUrl || '',
    status: 'pending',
    createdAt: serverTimestamp(),
    featured: false,
  })
}

export async function getApprovedTestimonials(userId: string): Promise<Testimonial[]> {
  const q = query(
    collection(db, 'proofstack_testimonials'),
    where('userId', '==', userId),
    where('status', '==', 'approved'),
    orderBy('approvedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate() ?? new Date(),
    approvedAt: d.data().approvedAt?.toDate(),
  })) as Testimonial[]
}
