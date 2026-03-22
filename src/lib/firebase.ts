/**
 * FIRESTORE SECURITY RULES
 * ========================
 * Deploy these rules in the Firebase Console under Firestore > Rules:
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *
 *     // Users can only read/write their own user document
 *     match /proofstack_users/{userId} {
 *       allow read, write: if request.auth != null && request.auth.uid == userId;
 *     }
 *
 *     // Anyone can CREATE a testimonial (for public collection form)
 *     // Only the owner (userId field) can read, update, and delete their testimonials
 *     match /proofstack_testimonials/{testimonialId} {
 *       allow create: if true;
 *       allow read, update, delete: if request.auth != null
 *         && request.auth.uid == resource.data.userId;
 *       // Allow public read of approved testimonials for the wall
 *       allow read: if resource.data.status == 'approved';
 *     }
 *   }
 * }
 */

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
