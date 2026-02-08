'use client'

import { useState, useEffect, useRef } from 'react'
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
import { newBooking } from '@/lib/service/bookingService'
import { uploadPaymentImage } from '@/lib/service/uploadService' 
import { Loader2, Upload, FileCheck } from 'lucide-react'
import { format } from 'date-fns'

interface Workshop {
  id: string
  title: string
  date: string
  startTime: string
  endTime?: string
  price: number
}

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  workshop: Workshop | null
}

const initialFormData = {
  name: '',
  email: '',
  phone: '',
}

export function BookingModal({ open, onOpenChange, onSuccess, workshop }: BookingModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialFormData)
  const [paymentImage, setPaymentImage] = useState<File | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) {
      setFormData(initialFormData)
      setPaymentImage(null)
      setError('')
      setSuccess(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [open])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image est trop grande. Max 5Mo.')
        return
      }
      setPaymentImage(file)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!workshop) {
      setError('Workshop information is missing.')
      return
    }

    if (!paymentImage) {
      setError('Veuillez télécharger une preuve de paiement.')
      return
    }

    setLoading(true)

    try {
      // 1. Upload to Cloudinary (returns the URL)
      const imageUrl = await uploadPaymentImage(paymentImage)

      // 2. Save booking to Firestore using the URL
      await newBooking({
        workshopId: workshop.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        paymentImage: imageUrl, 
      })

      // 3. Handle UI Success
      setSuccess(true)
      setFormData(initialFormData)
      setPaymentImage(null)

      setTimeout(() => {
        onOpenChange(false)
        if (onSuccess) onSuccess()
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la réservation.')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE, MMM d')
    } catch { return dateString }
  }

  if (!workshop) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Réserver l'atelier</DialogTitle>
          <DialogDescription>
            Complétez votre réservation pour <strong>{workshop.title}</strong>
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Réservation confirmée !</h3>
              <p className="text-muted-foreground">Votre demande a été envoyée avec succès.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
              <div className="font-semibold">{workshop.title}</div>
              <div className="text-muted-foreground">
                {formatDate(workshop.date)} • {formatTime(workshop.startTime)}
                {workshop.endTime && ` - ${formatTime(workshop.endTime)}`}
              </div>
              <div className="text-primary font-semibold">{workshop.price} DH</div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom Complet *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Votre nom"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="votre@email.com"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">N° de Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="06XXXXXXXX"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment">Preuve de Paiement *</Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors text-center cursor-pointer hover:bg-muted/50 ${paymentImage ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/20'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Input
                    id="payment"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                  <div className="flex flex-col items-center gap-2">
                    {paymentImage ? (
                      <>
                        <FileCheck className="h-8 w-8 text-primary" />
                        <span className="text-sm font-medium text-primary line-clamp-1">{paymentImage.name}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Cliquez pour envoyer votre reçu</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive border border-destructive/20 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  'Confirmer la réservation'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}