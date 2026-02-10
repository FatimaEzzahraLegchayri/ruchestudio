'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/config'
import { Loader2 } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // 1. If no user is logged in, redirect to landing page
      if (!user) {
        router.replace('/')
        return
      }

      try {
        // 2. Fetch the user document from the 'users' collection
        const userDocRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userDocRef)

        if (userSnap.exists()) {
          const userData = userSnap.data()
          
          // 3. Check for the 'admin' role
          if (userData.role === 'admin') {
            router.replace('/workshops')
          } else {
            // Logged in but not an admin
            router.replace('/')
          }
        } else {
          // Document doesn't exist in Firestore
          router.replace('/')
        }
      } catch (error) {
        console.error("Error checking user role in NotFound:", error)
        router.replace('/')
      }
    })

    return () => unsubscribe()
  }, [router])

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-background">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Vérification des accès...
        </p>
      </div>
    </div>
  )
}