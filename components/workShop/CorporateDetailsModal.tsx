'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { Building2, User, Mail, Phone, Calendar, MapPin, Users, AlignLeft } from "lucide-react"

interface CorporateDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  booking: any // Using any to match your Table's selectedBooking state
}

export function CorporateDetailsModal({ isOpen, onClose, booking }: CorporateDetailsModalProps) {
  if (!booking) return null

  // Helper to handle both String dates and Firestore Timestamps
  const formatPreferredDate = (date: any) => {
    try {
      const d = date?.toDate ? date.toDate() : new Date(date)
      return format(d, 'dd MMMM yyyy')
    } catch {
      return "Non spécifiée"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl font-serif">
            <Building2 className="h-6 w-6 text-primary" />
            {booking.companyName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Section: Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" /> Contact
              </p>
              <p className="text-sm font-medium">{booking.contactName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" /> Participants
              </p>
              <p className="text-sm font-medium">{booking.participants} personnes</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email
              </p>
              <p className="text-sm font-medium break-all">{booking.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> Téléphone
              </p>
              <p className="text-sm font-medium">{booking.phone}</p>
            </div>
          </div>

          <hr className="border-border" />

          {/* Section: Workshop Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Date souhaitée
              </p>
              <p className="text-sm font-medium">{formatPreferredDate(booking.preferredDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Lieu
              </p>
              <p className="text-sm font-medium capitalize">
                {booking.location === 'autre' ? booking.customLocation : booking.location}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <AlignLeft className="h-3 w-3" /> Type d'atelier
            </p>
            <p className="text-sm bg-muted p-2 rounded-md capitalize font-medium">
              {booking.workshopType === 'autre' ? booking.customWorkshopType : booking.workshopType}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              Description du projet
            </p>
            <div className="text-sm bg-primary/5 border border-primary/10 p-4 rounded-lg italic leading-relaxed whitespace-pre-wrap">
              {booking.description || "Aucune description supplémentaire fournie."}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Fermer l'aperçu
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}