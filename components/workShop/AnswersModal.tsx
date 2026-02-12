'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquareQuote, Heart } from "lucide-react"

interface AnswersModalProps {
  isOpen: boolean
  onClose: () => void
  participantName: string
  whyJoin: string
  lastTimeForSelf: string
}

export function AnswersModal({
  isOpen,
  onClose,
  participantName,
  whyJoin,
  lastTimeForSelf
}: AnswersModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      
      <DialogContent className="w-[92vw] sm:max-w-[425px] rounded-2xl p-5 sm:p-6 gap-0">
        <DialogHeader className="text-left">
          <DialogTitle className="font-serif text-xl sm:text-2xl break-words pr-6">
            Réponses de {participantName}
          </DialogTitle>
          <DialogDescription className="pt-2">
            Détails de motivation pour la session Pause d'Art.
          </DialogDescription>
        </DialogHeader>
        
        
        <ScrollArea className="mt-4 max-h-[70vh] w-full pr-3">
          <div className="space-y-6 py-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                <MessageSquareQuote className="h-4 w-4" />
                <span>Pourquoi participer ?</span>
              </div>
              <p className="text-sm sm:text-base text-foreground leading-relaxed bg-muted/40 p-4 rounded-xl italic border border-muted">
                "{whyJoin}"
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-widest">
                <Heart className="h-4 w-4" />
                <span>Dernière fois pour soi ?</span>
              </div>
              <p className="text-sm sm:text-base text-foreground leading-relaxed bg-muted/40 p-4 rounded-xl italic border border-muted">
                "{lastTimeForSelf}"
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}