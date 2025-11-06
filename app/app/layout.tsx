import { getCurrentUser, getCurrentProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Home, FileText, User, LogOut, Menu, Building2 } from 'lucide-react'
import Link from 'next/link'
import { signOut } from '@/lib/actions/auth'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/login?redirect=/app')
  }

  const profile = await getCurrentProfile()

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      {/* Mobile Header */}
      <header className="bg-white border-b sticky top-0 z-50 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-teal-600" />
            <span className="font-semibold text-gray-900">e-Actes</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{profile?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/app" className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Mes demandes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/app/requests/new" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Nouvelle demande
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/app/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action={signOut} className="w-full">
                  <button type="submit" className="flex items-center w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-teal-600" />
              <div>
                <h1 className="font-bold text-gray-900">Mairie e-Actes</h1>
                <p className="text-xs text-gray-600">Espace citoyen</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link href="/app">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Mes demandes
              </Button>
            </Link>
            <Link href="/app/requests/new">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Nouvelle demande
              </Button>
            </Link>
            <Link href="/app/profile">
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Mon profil
              </Button>
            </Link>
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarFallback className="bg-teal-100 text-teal-600">
                  {getInitials(profile?.full_name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name}
                </p>
                <p className="text-xs text-gray-600 truncate">{user.email}</p>
              </div>
            </div>
            <form action={signOut}>
              <Button type="submit" variant="outline" className="w-full" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </form>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Main Content */}
      <main className="lg:hidden p-4">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex items-center justify-around py-2">
          <Link href="/app" className="flex flex-col items-center p-2 text-gray-600 hover:text-teal-600">
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Accueil</span>
          </Link>
          <Link href="/app/requests/new" className="flex flex-col items-center p-2 text-gray-600 hover:text-teal-600">
            <FileText className="h-5 w-5" />
            <span className="text-xs mt-1">Nouvelle</span>
          </Link>
          <Link href="/app/profile" className="flex flex-col items-center p-2 text-gray-600 hover:text-teal-600">
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profil</span>
          </Link>
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="lg:hidden h-16" />

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  )
}

