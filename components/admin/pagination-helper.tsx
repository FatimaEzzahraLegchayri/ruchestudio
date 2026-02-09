'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationHelperProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationHelper({ currentPage, totalPages, onPageChange }: PaginationHelperProps) {
  if (totalPages <= 1) return null

  // Helper to prevent out-of-bounds
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#" 
            onClick={(e) => { e.preventDefault(); handlePrev(); }}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {/* Example: Generate simple page numbers */}
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1
          return (
            <PaginationItem key={page}>
              <PaginationLink 
                href="#" 
                isActive={currentPage === page}
                onClick={(e) => { e.preventDefault(); onPageChange(page); }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext 
            href="#" 
            onClick={(e) => { e.preventDefault(); handleNext(); }}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}