'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, Info, Building2, Users } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'

import { getCorporateBookings, updateCorporateBookingStatus } from '@/lib/service/bookingService' 
import { PaginationHelper } from '@/components/admin/pagination-helper'
import { Button } from '@/components/ui/button'
import { CorporateDetailsModal } from '@/components/workShop/CorporateDetailsModal' 

interface CorporateBooking {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  workshopType: string
  customWorkshopType?: string
  participants: string
  preferredDate: string
  location: string
  customLocation?: string
  description: string
  status: string
  createdAt: string
}

export function CorporateTable() {
  const [bookings, setBookings] = useState<CorporateBooking[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedBooking, setSelectedBooking] = useState<CorporateBooking | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(bookings.length / itemsPerPage)
  const currentBookings = bookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await getCorporateBookings()
      setBookings(data as CorporateBooking[])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const handleShowDetails = (booking: CorporateBooking) => {
    setSelectedBooking(booking)
    setIsDetailsOpen(true)
  }

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'canceled':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'pending':
      default:
        return 'bg-white text-gray-800 border-gray-300'
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
    try {
      await updateCorporateBookingStatus(bookingId, newStatus)
    } catch (err) {
      fetchBookings() 
    }
  }

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entreprise / Contact</TableHead>
              <TableHead>Atelier</TableHead>
              <TableHead className="text-center">Participants</TableHead>
              <TableHead>Date Souhaitée</TableHead>
              <TableHead>Détails</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reçu le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div className="font-medium">{b.companyName}</div>
                  </div>
                  <div className="text-xs text-muted-foreground ml-6">
                    {b.contactName} • {b.phone}
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  {b.workshopType === 'autre' ? b.customWorkshopType : b.workshopType}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    {b.participants}
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {b.preferredDate ? format(new Date(b.preferredDate), 'dd/MM/yyyy') : 'N/A'}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShowDetails(b)}
                    className="hover:bg-primary/10"
                  >
                    <Info className="h-5 w-5 text-primary" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Select value={b.status || 'pending'} onValueChange={(val) => handleStatusChange(b.id, val)}>
                    <SelectTrigger className={`w-[130px] capitalize ${getStatusClasses(b.status)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmé</SelectItem>
                      <SelectItem value="canceled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {b.createdAt 
        ? format(
            typeof b.createdAt.toDate === 'function' 
            ? b.createdAt.toDate() 
            : new Date(b.createdAt), 
            'dd/MM/yyyy'
        ) 
        : '--'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationHelper 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

      {selectedBooking && (
        <CorporateDetailsModal 
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          booking={selectedBooking}
        />
      )}
    </Card>
  )
}