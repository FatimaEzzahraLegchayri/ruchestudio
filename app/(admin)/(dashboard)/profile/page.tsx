'use client'

import { useEffect, useState } from 'react'
import { SideBar } from '@/components/admin/side-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getProfile } from '@/lib/service/adminService'
import { UpdateProfile } from '@/components/admin/update-profile'
import { Loader2, User, Mail, Shield, Calendar, Clock, Pencil } from 'lucide-react'
import { format } from 'date-fns'

interface AdminProfile {
  uid: string
  email: string
  emailVerified: boolean
  name: string
  role: string
  createdAt: string
  updatedAt?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await getProfile()
      setProfile(data as AdminProfile)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, 'MMM dd, yyyy HH:mm')
    } catch {
      return dateString
    }
  }

  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Profile</h1>
              <p className="text-muted-foreground">
                View and manage your admin profile information
              </p>
            </div>
            {!loading && !error && profile && (
              <Button
                onClick={() => setIsUpdateModalOpen(true)}
                size="lg"
              >
                <Pencil className="mr-2 h-5 w-5" />
                Edit Profile
              </Button>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!loading && !error && profile && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Profile Information</CardTitle>
                    <Badge variant="default" className="bg-primary">
                      {profile.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-8 w-8" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-2xl font-semibold">{profile.name || 'No name set'}</div>
                      <div className="text-sm text-muted-foreground">Admin Account</div>
                    </div>
                  </div>

                  <div className="grid gap-4 pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-muted-foreground">Email</div>
                        <div className="text-base">{profile.email}</div>
                        {profile.emailVerified && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-muted-foreground">Role</div>
                        <div className="text-base capitalize">{profile.role}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-muted-foreground">Account Created</div>
                        <div className="text-base">{formatDate(profile.createdAt)}</div>
                      </div>
                    </div>

                    {profile.updatedAt && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                          <div className="text-base">{formatDate(profile.updatedAt)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <UpdateProfile
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        onSuccess={fetchProfile}
        currentName={profile?.name}
      />
    </div>
  )
}
