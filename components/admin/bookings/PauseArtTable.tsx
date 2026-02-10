'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, MessageCircle, Phone, Eye } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import Image from 'next/image'

import { getPauseArtBookings, updatePauseArtBookingStatus } from '@/lib/service/bookingService' 
import { PaginationHelper } from '@/components/admin/pagination-helper'
import { AnswersModal } from '@/components/workShop/AnswersModal'
import { Button } from '@/components/ui/button'

interface PauseArtBooking {
  id: string
  name: string
  email: string
  phone: string
  eventTitle: string
  whyJoin: string
  lastTimeForSelf: string
  paymentProofUrl: string
  status: string
  createdAt: string
}

export function PauseArtTable() {
  const [bookings, setBookings] = useState<PauseArtBooking[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal State for Answers
  const [selectedBooking, setSelectedBooking] = useState<PauseArtBooking | null>(null)
  const [isAnswersOpen, setIsAnswersOpen] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(bookings.length / itemsPerPage)
  const currentBookings = bookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await getPauseArtBookings() 
      setBookings(data as PauseArtBooking[])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const handleShowAnswers = (booking: PauseArtBooking) => {
    setSelectedBooking(booking)
    setIsAnswersOpen(true)
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
      await updatePauseArtBookingStatus(bookingId, newStatus)
    } catch (err) {
      fetchBookings() // rollback
    }
  }

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-center">Answers</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.email}</div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                   <div className="flex items-center gap-1.5 text-sm">{b.phone}</div>
                </TableCell>
                <TableCell className="text-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleShowAnswers(b)}
                    className="hover:bg-primary/10"
                  >
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative h-10 w-10 cursor-pointer rounded overflow-hidden border">
                        <Image src={b.paymentProofUrl} alt="Proof" fill className="object-cover" />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl h-[80vh]">
                       <Image src={b.paymentProofUrl} alt="Payment Proof" fill className="object-contain p-4" />
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <Select value={b.status} onValueChange={(val) => handleStatusChange(b.id, val)}>
                    <SelectTrigger className={`w-[140px] capitalize ${getStatusClasses(b.status)}`}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmé</SelectItem>
                      <SelectItem value="canceled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(b.createdAt), 'dd/MM/yyyy')}
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

      {/* Reusable Answers Modal */}
      {selectedBooking && (
        <AnswersModal 
          isOpen={isAnswersOpen}
          onClose={() => setIsAnswersOpen(false)}
          participantName={selectedBooking.name}
          whyJoin={selectedBooking.whyJoin}
          lastTimeForSelf={selectedBooking.lastTimeForSelf}
        />
      )}
    </Card>
  )
}