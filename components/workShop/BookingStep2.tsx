'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Upload, FileCheck, MessageCircle, Loader2, Info } from 'lucide-react'

interface Step2Props {
  workshopTitle: string
  userName: string
  paymentImage: File | null
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPrev: () => void
  loading: boolean
}

export function BookingStep2({ 
  workshopTitle, 
  userName, 
  paymentImage, 
  handleFileChange, 
  onPrev, 
  loading 
}: Step2Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openWhatsApp = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP
    const message = `Bonjour, je souhaite m'inscrire à l'atelier "${workshopTitle}". Mon nom est ${userName}. Pourriez-vous m'envoyer votre RIB pour le virement ?`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="space-y-5 pt-2 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-900 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-blue-600" />
          <p className="font-bold">Comment finaliser votre réservation :</p>
        </div>
        <ol className="space-y-2 ml-1">
          <li className="flex gap-2">
            <span className="font-bold text-blue-600">1.</span>
            <span>Cliquez sur le bouton vert pour demander le RIB via WhatsApp.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-blue-600">2.</span>
            <span>Effectuez votre virement bancaire.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-blue-600">3.</span>
            <span>Revenez ici pour <strong>télécharger la capture d'écran</strong> de votre reçu et confirmer.</span>
          </li>
        </ol>
      </div>

      <div className="space-y-3">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full h-12 gap-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800 transition-all font-semibold"
          onClick={openWhatsApp}
        >
          <MessageCircle className="h-5 w-5 fill-current" /> 1. Demander le RIB sur WhatsApp
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="font-bold text-gray-700">2. Télécharger votre preuve de paiement</Label>
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            paymentImage 
              ? 'border-green-500 bg-green-50/30' 
              : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'
          }`}
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
                <div className="bg-green-100 p-2 rounded-full">
                  <FileCheck className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-semibold text-green-800 line-clamp-1">{paymentImage.name}</p>
                   <p className="text-xs text-green-600">Cliquez pour modifier</p>
                </div>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Cliquez pour envoyer votre reçu</p>
                  <p className="text-xs text-muted-foreground">Format JPG, PNG (Capture d'écran)</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t items-center">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onPrev} 
          disabled={loading}
          className="text-muted-foreground"
        >
          Retour
        </Button>
        <Button 
          type="submit" 
          className="flex-1 h-11 text-base shadow-lg" 
          disabled={loading || !paymentImage}
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...</>
          ) : (
            'Confirmer ma place'
          )}
        </Button>
      </div>
    </div>
  )
}