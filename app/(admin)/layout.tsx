'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/config'
import { Spinner } from '@/components/ui/spinner'
import { SideBar } from '@/components/admin/side-bar'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'

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
        router.push('/')
        return
      }

      try {
        const userDocRef = doc(db, 'users', user.uid)
        const userDocSnap = await getDoc(userDocRef)

        if (!userDocSnap.exists()) {
          router.push('/')
          return
        }

        const userData = userDocSnap.data()
        const userRole = userData.role

        if (userRole !== 'admin') {
          router.push('/')
          return
        }

        // User is authenticated and is admin
        setAuthorized(true)
      } catch (error) {
        console.error('Error checking user role:', error)
        router.push('/')
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
    return null 
  }

  return (
    <div className="flex min-h-screen">
    <SideBar />

    <main className="flex-1 md:ml-64 bg-slate-50 min-h-screen transition-all duration-300">
      <div className="p-4 md:p-8 pt-20 md:pt-8 max-w-7xl mx-auto">
        <Breadcrumbs />
        
        {children}
      </div>
    </main>
  </div>
  )
}