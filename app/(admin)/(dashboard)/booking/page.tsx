'use client'

import { SideBar } from '@/components/admin/side-bar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WorkshopTable } from '@/components/admin/bookings/WorkshopTable'
import { PauseArtTable } from '@/components/admin/bookings/PauseArtTable'
import { CorporateTable } from '@/components/admin/bookings/CorporateTable' // Import your new component

export default function BookingPage() {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Réservations</h1>
            <p className="text-muted-foreground">
              Gérez les inscriptions aux ateliers, aux événements spéciaux et aux demandes d'entreprises.
            </p>
          </div>

          <Tabs defaultValue="workshops" className="w-full">
            {/* Updated grid-cols-3 and max-width to accommodate the new tab */}
            <TabsList className="grid w-full max-w-[600px] grid-cols-3 mb-8">
              <TabsTrigger value="workshops">Ateliers</TabsTrigger>
              <TabsTrigger value="pause-art">Pause d'Art</TabsTrigger>
              <TabsTrigger value="corporate">Entreprises</TabsTrigger>
            </TabsList>

            <TabsContent value="workshops" className="space-y-4">
              <WorkshopTable />
            </TabsContent>

            <TabsContent value="pause-art" className="space-y-4">
              <PauseArtTable />
            </TabsContent>

            <TabsContent value="corporate" className="space-y-4">
              <CorporateTable />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
