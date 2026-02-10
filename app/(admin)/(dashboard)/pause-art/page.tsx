'use client'

import { useEffect, useState } from 'react'
import { SideBar } from '@/components/admin/side-bar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Loader2, Calendar, Users, Pencil, Trash2, Clock, DollarSign } from 'lucide-react'
import { getPauseArt, deletePauseArt } from '@/lib/service/workshopService'
import { AddPauseArtModal } from '@/components/workShop/AddPauseArtModal'
import { DeleteConfirmation } from '@/components/workShop/DeleteConfirmation'
import { PaginationHelper } from '@/components/admin/pagination-helper'
import { format } from 'date-fns'
import Image from 'next/image'

export default function AdminPauseArtPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<any | null>(null)
  
  // Delete States
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<any | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 
  const totalPages = Math.ceil(sessions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentSessions = sessions.slice(startIndex, startIndex + itemsPerPage)

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const data = await getPauseArt()
      setSessions(data)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
      setError("Impossible de charger les sessions.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'default'
      case 'draft': return 'secondary'
      default: return 'outline'
    }
  }

  // --- Actions ---
  const handleEditClick = (session: any) => {
    setEditingSession(session)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (session: any) => {
    setSessionToDelete(session)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return
    try {
      setDeleting(true)
      await deletePauseArt(sessionToDelete.id)
      setIsDeleteDialogOpen(false)
      setSessionToDelete(null)
      fetchSessions()
    } catch (err) {
      alert("Erreur lors de la suppression")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <SideBar />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">La Pause d'Art</h1>
              <p className="text-muted-foreground mt-1">
                Gérer les sessions de journées bien-être et créativité.
              </p>
            </div>
            <Button 
              onClick={() => {
                setEditingSession(null)
                setIsModalOpen(true)
              }}
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouvelle session
            </Button>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">{error}</div>
          )}

          {/* Content Section */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sessions.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Aucune session trouvée.</p>
            </Card>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentSessions.map((session) => (
                  <Card key={session.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                    <div className="relative h-48 w-full">
                      <Image 
                        src={session.image || '/placeholder-art.jpg'} 
                        alt={session.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant={getStatusBadgeVariant(session.status)}>
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl line-clamp-1">{session.title}</CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col gap-4">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{session.startTime} {session.endTime && ` - ${session.endTime}`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{session.bookedSeats} / {session.capacity} places</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="font-bold text-foreground text-base">{session.price} DH</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-2"
                          onClick={() => handleEditClick(session)}
                        >
                          <Pencil className="w-4 h-4" /> Modifier
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-destructive hover:bg-destructive hover:text-white"
                          disabled={deleting && sessionToDelete?.id === session.id}
                          onClick={() => handleDeleteClick(session)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="pt-6 border-t">
                <PaginationHelper 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Shared Modal for Add & Update */}
      <AddPauseArtModal 
        isOpen={isModalOpen} 
        sessionToEdit={editingSession}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSession(null)
        }} 
        onSuccess={fetchSessions} 
      />

      {/* Delete Confirmation Component */}
      <DeleteConfirmation
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        workshopTitle={sessionToDelete?.title}
      />
    </div>
  )
}