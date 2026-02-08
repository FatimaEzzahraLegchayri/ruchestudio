import { SideBar } from '@/components/admin/side-bar'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard. Use the sidebar to navigate.
          </p>
        </div>
      </main>
    </div>
  )
}
