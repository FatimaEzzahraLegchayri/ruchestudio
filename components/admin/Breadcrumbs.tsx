'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs() {
  const pathname = usePathname()
  
  // Split the path and filter out empty strings
  // Example: /workshops/edit -> ['workshops', 'edit']
  const pathSegments = pathname.split('/').filter((segment) => segment !== '')

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link 
        href="/booking" 
        className="hover:text-foreground transition-colors flex items-center gap-1"
      >
        <Home className="h-4 w-4" />
      </Link>

      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`
        const isLast = index === pathSegments.length - 1
        
        // Capitalize first letter and replace hyphens with spaces
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

        return (
          <div key={href} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 opacity-50" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link 
                href={href} 
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}