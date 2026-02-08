'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/lib/service/adminService'
import { Loader2 } from 'lucide-react'

interface UpdateProfileProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  currentName?: string
}

const initialFormData = {
  name: '',
  currentPassword: '',
  password: '',
}

export function UpdateProfile({ open, onOpenChange, onSuccess, currentName }: UpdateProfileProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialFormData)
  const [updatePassword, setUpdatePassword] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        name: currentName || '',
        currentPassword: '',
        password: '',
      })
      setUpdatePassword(false)
      setError('')
    } else {
      setFormData(initialFormData)
      setUpdatePassword(false)
      setError('')
    }
  }, [open, currentName])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('') // Clear error when user starts typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const updateData: {
        name?: string
        password?: string
        currentPassword?: string
      } = {}

      // Add name if provided
      if (formData.name.trim()) {
        updateData.name = formData.name.trim()
      }

      // Add password fields if user wants to update password
      if (updatePassword) {
        if (!formData.currentPassword) {
          setError('Current password is required to update password')
          setLoading(false)
          return
        }
        if (!formData.password) {
          setError('New password is required')
          setLoading(false)
          return
        }
        updateData.password = formData.password
        updateData.currentPassword = formData.currentPassword
      }

      // Check if there's anything to update
      if (!updateData.name && !updateData.password) {
        setError('Please provide at least one field to update')
        setLoading(false)
        return
      }

      await updateProfile(updateData)

      // Reset form
      setFormData(initialFormData)
      setUpdatePassword(false)

      // Close modal and refresh profile
      onOpenChange(false)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your profile information below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="updatePassword"
                checked={updatePassword}
                onChange={(e) => {
                  setUpdatePassword(e.target.checked)
                  if (!e.target.checked) {
                    setFormData((prev) => ({ ...prev, currentPassword: '', password: '' }))
                  }
                }}
                disabled={loading}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="updatePassword" className="font-medium cursor-pointer">
                Update Password
              </Label>
            </div>

            {updatePassword && (
              <div className="space-y-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password *</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => handleChange('currentPassword', e.target.value)}
                    placeholder="Enter current password"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">New Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
