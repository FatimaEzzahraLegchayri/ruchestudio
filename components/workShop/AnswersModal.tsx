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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Réponses de {participantName}</DialogTitle>
          <DialogDescription>
            Détails de motivation pour la session Pause d'Art.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="mt-4 max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                <MessageSquareQuote className="h-4 w-4" />
                <span>Pourquoi participer ?</span>
              </div>
              <p className="text-foreground leading-relaxed bg-muted/50 p-4 rounded-lg italic">
                "{whyJoin}"
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-wider">
                <Heart className="h-4 w-4" />
                <span>Dernière fois pour soi ?</span>
              </div>
              <p className="text-foreground leading-relaxed bg-muted/50 p-4 rounded-lg italic">
                "{lastTimeForSelf}"
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}