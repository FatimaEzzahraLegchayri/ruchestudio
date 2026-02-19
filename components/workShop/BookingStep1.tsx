'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface Step1Props {
  formData: { name: string; email: string; phone: string }
  handleChange: (field: string, value: string) => void
  onNext: () => void
  loading: boolean
}

export function BookingStep1({ formData, handleChange, onNext, loading }: Step1Props) {
  const isEmailValid = !formData.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const phoneRegex = /^0[6-7]\d{8}$/;
  const isPhoneValid = phoneRegex.test(formData.phone);
  const isInvalid = !formData.name || !formData.phone || !isEmailValid;

  return (
    <div className="space-y-4 pt-2 animate-in fade-in duration-300">
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
          className={!isEmailValid ? "border-red-500" : ""} 
          disabled={loading}
        />
        {!isEmailValid && (
          <p className="text-red-500 text-xs">Veuillez entrer un email valide (ex: .com, .ma)</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">N° de Téléphone (WhatsApp) *</Label>
        <p className="text-[12px] text-muted-foreground leading-none">
          Vous recevrez la confirmation et les détails de l'atelier sur ce numéro.
        </p>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            if (val.length <= 10) handleChange('phone', val);
          }}
          placeholder="06XXXXXXXX"
          className={formData.phone && !isPhoneValid ? "border-red-500" : ""}
          required
          disabled={loading}
        />
        {formData.phone && !isPhoneValid && (
        <p className="text-red-500 text-[10px] mt-1 italic">
          Veuillez entrer un numéro de mobile valide (commençant par 06 ou 07)
        </p>
      )}
      </div>

      <Button 
        type="button" 
        className="w-full" 
        onClick={onNext} 
        disabled={isInvalid || loading}
      >
        Suivant : Paiement
      </Button>
    </div>
  )
}