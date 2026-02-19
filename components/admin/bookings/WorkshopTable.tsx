'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'

import { getBookings, updateBooking } from '@/lib/service/bookingService'
import { PaginationHelper } from '@/components/admin/pagination-helper'

interface Booking {
  id: string
  workshopId: string
  workshopTitle: string
  name: string
  email: string
  phone: string
  paymentProofUrl: string
  status: string
  createdAt: string
  updatedAt: string
}

export function WorkshopTable() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const totalPages = Math.ceil(bookings.length / itemsPerPage)
  const currentBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await getBookings()
      const sortedBookings = (data as Booking[]).sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      setBookings(sortedBookings)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const formatDate = (dateValue: any) => {
    try {
      if (!dateValue) return 'N/A'
  
      let date: Date
  
      if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
        date = new Date(dateValue.seconds * 1000)
      } 
      else {
        date = new Date(dateValue)
      }
  
      if (isNaN(date.getTime())) {
        return 'Date invalide'
      }
  
      return format(date, 'MMM dd, yyyy HH:mm')
    } catch (error) {
      console.error("FormatDate Error:", error)
      return 'Erreur date'
    }
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
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    )

    try {
      await updateBooking(bookingId, newStatus)
    } catch (error) {
      console.error('Failed to update booking status:', error)
      setError('Failed to update booking status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
        {error}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">No workshop bookings found</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Workshop</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  <div className="font-medium">{booking.name}</div>
                  <div className="text-xs text-muted-foreground">{booking.email}</div>
                </TableCell>
                <TableCell>{booking.phone}</TableCell>
                <TableCell>{booking.workshopTitle}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="cursor-pointer overflow-hidden rounded border transition-opacity hover:opacity-80">
                        <Image
                          src={booking.paymentProofUrl}
                          alt="Payment Proof"
                          width={40}
                          height={40}
                          className="aspect-square object-cover"
                        />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] sm:max-w-3xl p-1 rounded-lg">
                      <div className="relative mt-2 w-full h-[60vh] sm:h-[70vh] bg-muted/30 rounded-md overflow-hidden">
                        <Image
                          src={booking.paymentProofUrl}
                          alt="Payment Proof Large"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <Select
                    value={booking.status || 'pending'}
                    onValueChange={(value) => handleStatusChange(booking.id, value)}
                  >
                    <SelectTrigger
                      className={`w-[140px] capitalize ${getStatusClasses(booking.status)}`}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending" className="cursor-pointer">Pending</SelectItem>
                      <SelectItem value="confirmed" className="cursor-pointer">Confirmed</SelectItem>
                      <SelectItem value="canceled" className="cursor-pointer">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(booking.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8 border-t pt-6">
        <PaginationHelper
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      </div>
    </Card>
  )
}