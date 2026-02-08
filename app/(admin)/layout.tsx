'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/config'
import { Spinner } from '@/components/ui/spinner'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // User not authenticated, redirect to home
        router.push('http://localhost:3000')
        return
      }

      try {
        // Check user role in Firestore
        const userDocRef = doc(db, 'users', user.uid)
        const userDocSnap = await getDoc(userDocRef)

        if (!userDocSnap.exists()) {
          // User document doesn't exist, redirect
          router.push('http://localhost:3000')
          return
        }

        const userData = userDocSnap.data()
        const userRole = userData.role

        if (userRole !== 'admin') {
          // User is not an admin, redirect
          router.push('http://localhost:3000')
          return
        }

        // User is authenticated and is admin
        setAuthorized(true)
      } catch (error) {
        console.error('Error checking user role:', error)
        router.push('http://localhost:3000')
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null // Will redirect, so show nothing
  }

  return <>{children}</>
}