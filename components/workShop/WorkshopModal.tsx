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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

import { addWorkshop, updateWorkshop } from '@/lib/service/workshopService'
import { getCategories } from '@/lib/service/categorieService'
import { uploadToCloudinary } from '@/lib/service/uploadService'

interface Workshop {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime?: string
  duration?: number
  category: string
  capacity: number
  bookedSeats?: number
  price: number
  status: string
  image?: string | null
}

interface Category {
  id: string
  name: string
  slug: string
}

interface WorkshopModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  workshop?: Workshop | null
}

const initialFormData = {
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  category: '',
  capacity: '',
  price: '',
  status: 'draft',
  image: '',
}

export function WorkshopModal({ open, onOpenChange, onSuccess, workshop }: WorkshopModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialFormData)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const isEditMode = !!workshop
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)

  useEffect(() => {
    if (!open) return
  
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        console.error('Failed to load categories', err)
      } finally {
        setCategoriesLoading(false)
      }
    }
  
    fetchCategories()
  }, [open])
  

  // Populate form when editing
  useEffect(() => {
    if (workshop && open) {
      setFormData({
        title: workshop.title || '',
        description: workshop.description || '',
        date: workshop.date || '',
        startTime: workshop.startTime || '',
        endTime: workshop.endTime || '',
        category: workshop.category || '',
        capacity: workshop.capacity?.toString() || '',
        price: workshop.price?.toString() || '',
        status: workshop.status || 'draft',
        image: workshop.image || '',
      })
      setImagePreview(workshop.image || null)
      setImageFile(null)
    } else if (!workshop && open) {
      // Reset form when creating new workshop
      setFormData(initialFormData)
      setImagePreview(null)
      setImageFile(null)
    }
  }, [workshop, open])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      setImageFile(file)
      setError('')
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData((prev) => ({ ...prev, image: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let imageUrl = formData.image

      if (imageFile) {
        try {
          imageUrl = await uploadToCloudinary(imageFile, "workshop_thumbnail")
        } catch (uploadErr) {
          throw new Error("Failed to upload image to Cloudinary. Please try again.")
        }
      }

      const workshopData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime || undefined,
        category: formData.category,
        capacity: parseInt(formData.capacity),
        price: parseFloat(formData.price),
        status: formData.status,
        image: imageUrl || undefined,
      }

      if (isEditMode && workshop) {
        await updateWorkshop(workshop.id, workshopData)
      } else {
        await addWorkshop(workshopData)
      }

      // Reset form
      setFormData(initialFormData)
      setImagePreview(null)
      setImageFile(null)

      // Close modal and refresh list
      onOpenChange(false)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEditMode
          ? 'Failed to update workshop'
          : 'Failed to add workshop'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Workshop' : 'Add New Workshop'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the workshop details below'
              : 'Fill in the details to create a new workshop'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Workshop title"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>

              <Select
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
                disabled={loading || categoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      categoriesLoading
                        ? 'Loading categories...'
                        : 'Select category'
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {categories.length === 0 && !categoriesLoading && (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No categories found
                    </div>
                  )}

                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.slug} // or category.name (your choice)
                      className="cursor-pointer"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Workshop description"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            
              <div className="relative">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={loading}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload an image file (max 5MB)
                </p>
              </div>
              {imagePreview && (
                <div className="relative mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    className="absolute top-2 right-2"
                  >
                    Remove
                  </Button>
                </div>
              )}
            {/* </div> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="fully booked">Fully Booked</SelectItem>
                  <SelectItem value="canceled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                placeholder="20"
                min="1"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (DH) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="45.00"
                step="0.01"
                min="0"
                required
                disabled={loading}
              />
            </div>
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
                  {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditMode ? 'Update Workshop' : 'Add Workshop'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
