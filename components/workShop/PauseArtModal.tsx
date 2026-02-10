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
import { Textarea } from '@/components/ui/textarea'
import { newPauseBooking } from '@/lib/service/bookingService'
import { uploadToCloudinary } from '@/lib/service/uploadService' 
import { Loader2, Upload, FileCheck, Sparkles } from 'lucide-react'

interface PauseArtModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  pauseArtId: string | null
}

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  whyJoin: '',
  lastTimeForSelf: '',
}

export function PauseArtModal({ open, onOpenChange, onSuccess, pauseArtId }: PauseArtModalProps) {
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
        setError("L'image est trop grande. Max 5Mo.")
        return
      }
      setPaymentImage(file)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!pauseArtId) {
      setError("Erreur: Aucune session Pause d'Art n'a été sélectionnée.")
      return
    }

    if (!paymentImage) {
      setError('Veuillez télécharger votre preuve de paiement.')
      return
    }

    setLoading(true)

    try {
      // 1. Upload Payment Proof to Cloudinary
      const imageUrl = await uploadToCloudinary(paymentImage, 'pause-art-payments')

      // 2. Save Entry using the transactional service
      await newPauseBooking({
        pauseArtId: pauseArtId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        whyJoin: formData.whyJoin,
        lastTimeForSelf: formData.lastTimeForSelf,
        paymentImage: imageUrl, 
      })

      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        if (onSuccess) onSuccess()
      }, 2500)

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-primary" />
            <DialogTitle className="text-2xl">Pause d'Art</DialogTitle>
          </div>
          <DialogDescription>
            Prenez un moment pour vous. Remplissez ce formulaire pour confirmer votre participation.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-in zoom-in">
              <FileCheck className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Inscription Reçue !</h3>
              <p className="text-muted-foreground">Merci d'avoir pris ce temps pour vous. À bientôt !</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            
            {/* Questions Group */}
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="whyJoin">Pourquoi souhaitez-vous rejoindre la pause d'art ? *</Label>
                  <span className="text-[10px] text-muted-foreground">{formData.whyJoin.length}/300</span>
                </div>
                <Textarea
                  id="whyJoin"
                  value={formData.whyJoin}
                  onChange={(e) => handleChange('whyJoin', e.target.value)}
                  placeholder="Partagez vos motivations..."
                  className="min-h-[100px] resize-none"
                  required
                  maxLength={300}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="lastTimeForSelf">C'était quand la dernière fois que vous vous êtes accordé du temps ? </Label>
                  <span className="text-[10px] text-muted-foreground">{formData.lastTimeForSelf.length}/300</span>
                </div>
                <Textarea
                  id="lastTimeForSelf"
                  value={formData.lastTimeForSelf}
                  onChange={(e) => handleChange('lastTimeForSelf', e.target.value)}
                  placeholder="Un moment, un jour, une année..."
                  className="min-h-[80px] resize-none"
                  required
                  maxLength={300}
                />
              </div>
            </div>
            
            {/* Personal Info Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom Complet *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Votre nom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="06XXXXXXXX"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="votre@email.com"
              />
            </div>

            {/* Payment Proof */}
            <div className="space-y-2 border-t pt-4">
              <Label>Preuve de Paiement *</Label>
              <div 
                className={`border-2 border-dashed rounded-xl p-6 transition-all text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 ${paymentImage ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <div className="flex flex-col items-center gap-3">
                  {paymentImage ? (
                    <>
                      <FileCheck className="h-10 w-10 text-primary" />
                      <span className="text-sm font-medium text-primary">{paymentImage.name}</span>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-muted rounded-full">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Cliquez pour télécharger le reçu</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG jusqu'à 5Mo</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => onOpenChange(false)} disabled={loading}>
                Plus tard
              </Button>
              <Button type="submit" className="flex-[2]" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  'Confirmer ma participation'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}