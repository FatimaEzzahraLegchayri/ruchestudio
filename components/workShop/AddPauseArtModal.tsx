'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, X, Loader2, ListChecks, Image as ImageIcon } from 'lucide-react'
import { addPauseArt, updatePauseArt } from '@/lib/service/workshopService'
// import { uploadToCloudinary } from '@/lib/service/uploadService'

interface AddPauseArtModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  sessionToEdit?: any | null
}

// FIXED: Added sessionToEdit to the destructured props here
export function AddPauseArtModal({ isOpen, onClose, onSuccess, sessionToEdit }: AddPauseArtModalProps) {
  const [loading, setLoading] = useState(false)
  const [todoInput, setTodoInput] = useState('')
  
  // Image States
  // const [imageFile, setImageFile] = useState<File | null>(null)
  // const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    price: '',
    capacity: '',
    // image: '',
    status: 'draft',
    todos: [] as string[]
  })

  // Populating form for Edit Mode
  useEffect(() => {
    if (sessionToEdit && isOpen) {
      setFormData({
        title: sessionToEdit.title || '',
        description: sessionToEdit.description || '',
        date: sessionToEdit.date || '',
        startTime: sessionToEdit.startTime || '',
        endTime: sessionToEdit.endTime || '',
        price: sessionToEdit.price?.toString() || '',
        capacity: sessionToEdit.capacity?.toString() || '',
        // image: sessionToEdit.image || '',
        status: sessionToEdit.status || 'draft',
        todos: sessionToEdit.todos || []
      })
      // setImagePreview(sessionToEdit.image || null)
    } else if (!sessionToEdit && isOpen) {
      // Reset for "Add" mode
      setFormData({
        title: '', description: '', date: '', startTime: '',
        endTime: '', price: '', capacity: '', // image: '',
        status: 'draft', todos: []
      })
      // setImagePreview(null)
      // setImageFile(null)
    }
  }, [sessionToEdit, isOpen])

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (file) {
  //     setImageFile(file)
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result as string)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  // const handleRemoveImage = () => {
  //   setImageFile(null)
  //   setImagePreview(null)
  //   setFormData(prev => ({ ...prev, image: '' }))
  // }

  const addTodo = () => {
    if (todoInput.trim()) {
      setFormData(prev => ({
        ...prev,
        todos: [...prev.todos, todoInput.trim()]
      }))
      setTodoInput('')
    }
  }

  const removeTodo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      todos: prev.todos.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // let finalImageUrl = formData.image

      // 1. Upload to Cloudinary if a new file was selected
      // if (imageFile) {
      //   finalImageUrl = await uploadToCloudinary(imageFile, "pause_art")
      // }

      // 2. Prepare payload
      const payload = {
        ...formData,
        // image: finalImageUrl,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity)
      }

      if (sessionToEdit) {
        await updatePauseArt(sessionToEdit.id, payload)
      } else {
        await addPauseArt(payload)
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error:", error)
      alert("Une erreur est survenue.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto font-sans">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ListChecks className="w-6 h-6 text-primary" />
            {sessionToEdit ? "Modifier la Pause d'Art" : "Nouvelle Pause d'Art"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title">Titre de l'événement *</Label>
              <Input 
                id="title" required 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* Image Upload Section */}
            {/* <div className="md:col-span-2 space-y-2">
              <Label>Image de couverture *</Label>
              <div className="flex flex-col gap-4">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="cursor-pointer"
                  required={!sessionToEdit} // Only required if we aren't editing
                />
                {imagePreview && (
                  <div className="relative w-full h-40 border rounded-lg overflow-hidden bg-muted">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={handleRemoveImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div> */}

            <div className="space-y-2">
              <Label>Date *</Label>
              <Input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Début *</Label>
                <Input type="time" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Fin</Label>
                <Input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Prix (DH) *</Label>
              <Input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            
            <div className="space-y-2">
              <Label>Capacité *</Label>
              <Input type="number" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Statut</Label>
              <Select value={formData.status} onValueChange={val => setFormData({...formData, status: val})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Program Section */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
            <Label className="font-bold">Programme de la journée</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Ajouter une étape..." 
                value={todoInput}
                onChange={e => setTodoInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTodo())}
              />
              <Button type="button" size="icon" onClick={addTodo}><Plus className="w-4 h-4" /></Button>
            </div>
            <ul className="space-y-2 mt-2">
              {formData.todos.map((todo, index) => (
                <li key={index} className="flex items-center justify-between bg-background p-2 px-3 rounded border text-sm">
                  <span>{todo}</span>
                  <button type="button" onClick={() => removeTodo(index)} className="text-destructive"><X className="w-4 h-4" /></button>
                </li>
              ))}
            </ul>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {loading ? "Chargement..." : sessionToEdit ? "Mettre à jour" : "Créer la session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}