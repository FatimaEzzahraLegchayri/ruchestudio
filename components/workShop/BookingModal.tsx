'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { newBooking, updateBookingWithPayment } from '@/lib/service/bookingService'
import { uploadToCloudinary } from '@/lib/service/uploadService'
import { BookingStep1 } from './BookingStep1'
import { BookingStep2 } from './BookingStep2'
import { CheckCircle2 } from 'lucide-react'

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
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialFormData)
  const [paymentImage, setPaymentImage] = useState<File | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null)

  useEffect(() => {
    if (open && workshop) {
      // Check if there's an unfinished booking for THIS specific workshop in this browser
      const savedBookingId = localStorage.getItem(`pending_booking_${workshop.id}`)
      
      if (savedBookingId) {
        setActiveBookingId(savedBookingId)
        setStep(2)
        
        const savedInfo = localStorage.getItem(`user_info_${workshop.id}`)
        if (savedInfo) {
          setFormData(JSON.parse(savedInfo))
        }
        
      }
    }
    
    if (!open) {
      setTimeout(() => {
        setStep(1)
        setFormData(initialFormData)
        setPaymentImage(null)
        setSuccess(false)
        setError('')
        setActiveBookingId(null)
      }, 300)
    }
  }, [open, workshop])

  const handleNext = async () => {
    if (!workshop) return
    setLoading(true)
    setError('')
    
    try {
      const result = await newBooking({
        workshopId: workshop.id,
        workshopTitle: workshop.title,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: 'draft' 
      })

      setActiveBookingId(result.id)
      localStorage.setItem(`pending_booking_${workshop.id}`, result.id)
      localStorage.setItem(`user_info_${workshop.id}`, JSON.stringify(formData))
      setStep(2)
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'initialisation")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workshop || !paymentImage || !activeBookingId) return
    setLoading(true)

    try {
      const imageUrl = await uploadToCloudinary(paymentImage, 'workshop-payments')

      await updateBookingWithPayment(activeBookingId, imageUrl)

      localStorage.removeItem(`pending_booking_${workshop.id}`)
      localStorage.removeItem(`user_info_${workshop.id}`)
      setSuccess(true)
      
      setTimeout(() => {
        onOpenChange(false)
        if (onSuccess) onSuccess()
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'envoi.')
    } finally {
      setLoading(false)
    }
  }

  if (!workshop) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Réserver l'atelier</DialogTitle>
          <DialogDescription>Réservation pour {workshop.title}</DialogDescription>
        </DialogHeader>

        {success ? (
          <SuccessView />
        ) : (
          <form onSubmit={handleSubmit}>
             <div className="bg-muted/50 p-3 rounded-md mb-4 text-sm flex justify-between items-center">
               <span className="font-medium text-muted-foreground">Total à régler:</span>
               <span className="font-bold text-primary">{workshop.price} DH</span>
             </div>

             {step === 1 ? (
               <BookingStep1 
                 formData={formData} 
                 handleChange={(f, v) => setFormData(p => ({...p, [f]: v}))}
                 onNext={handleNext}
                 loading={loading}
               />
             ) : (
               <BookingStep2 
                 workshopTitle={workshop.title}
                 userName={formData.name || "Client"}
                 paymentImage={paymentImage}
                 handleFileChange={(e) => setPaymentImage(e.target.files?.[0] || null)}
                 onPrev={() => setStep(1)}
                 loading={loading}
               />
             )}
             
             {error && (
               <p className="text-destructive text-xs mt-2 bg-destructive/10 p-2 rounded">
                 {error}
               </p>
             )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function SuccessView() {
  return (
    <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
      <CheckCircle2 className="h-12 w-12 text-green-500 animate-in zoom-in duration-300" />
      <div>
        <h3 className="text-lg font-semibold">Demande reçue !</h3>
        <p className="text-sm text-muted-foreground">
          Nous vérifions votre paiement et vous confirmerons votre place par WhatsApp.
        </p>
      </div>
    </div>
  )
} 