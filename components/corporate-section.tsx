"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function CorporateSection() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    workshopType: "",
    participants: "",
    preferredDate: "",
    location: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="entreprises" className="py-24 lg:py-32 bg-muted">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Pour les Entreprises
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 text-balance">
              Team Building Créatif
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Offrez à vos équipes une expérience unique qui renforce les liens et
              stimule la créativité. Nos ateliers sur mesure s'adaptent à vos
              objectifs et à votre culture d'entreprise.
            </p>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <span className="text-foreground font-medium">Ateliers personnalisés</span>
                <br />
                Nous adaptons nos ateliers à vos besoins spécifiques.
              </p>
              <p>
                <span className="text-foreground font-medium">Sur site ou dans notre studio</span>
                <br />
                Nous nous déplaçons ou vous accueillons.
              </p>
              <p>
                <span className="text-foreground font-medium">De 8 à 30 participants</span>
                <br />
                Pour des équipes de toutes tailles.
              </p>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border">
            <h3 className="font-serif text-xl text-card-foreground mb-6">
              Demande de devis
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyName" className="text-sm text-foreground mb-1.5 block">
                    Nom de l'entreprise *
                  </label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                </div>
                <div>
                  <label htmlFor="contactName" className="text-sm text-foreground mb-1.5 block">
                    Nom du contact *
                  </label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="text-sm text-foreground mb-1.5 block">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="text-sm text-foreground mb-1.5 block">
                    Téléphone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="workshopType" className="text-sm text-foreground mb-1.5 block">
                    Type d'atelier souhaité *
                  </label>
                  <select
                    id="workshopType"
                    name="workshopType"
                    value={formData.workshopType}
                    onChange={handleChange}
                    required
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="peinture">Peinture</option>
                    <option value="ecriture">Écriture créative</option>
                    <option value="bougies">Création de bougies</option>
                    <option value="autre">Autre / Sur mesure</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="participants" className="text-sm text-foreground mb-1.5 block">
                    Nombre de participants *
                  </label>
                  <Input
                    id="participants"
                    name="participants"
                    type="number"
                    min="8"
                    max="30"
                    value={formData.participants}
                    onChange={handleChange}
                    required
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferredDate" className="text-sm text-foreground mb-1.5 block">
                    Date souhaitée
                  </label>
                  <Input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="bg-background"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="text-sm text-foreground mb-1.5 block">
                    Lieu souhaité
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="studio">Notre studio</option>
                    <option value="entreprise">Dans vos locaux</option>
                    <option value="autre">Autre lieu</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="text-sm text-foreground mb-1.5 block">
                  Description du projet
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Décrivez vos attentes, le contexte de l'événement..."
                  className="bg-background resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Envoyer ma demande
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
