import { requireRole } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  Building2,
} from 'lucide-react'
import Link from 'next/link'
import { signOutAdmin } from '@/lib/actions/auth'
import { getCurrentUser } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const profile = await requireRole(['agent', 'admin'])
    const user = await getCurrentUser()

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    const navItems = [
      {
        href: '/admin',
        icon: LayoutDashboard,
        label: 'Tableau de bord',
      },
      {
        href: '/admin/requests',
        icon: FileText,
        label: 'Demandes',
      },
      {
        href: '/admin/agents',
        icon: Users,
        label: 'Agents',
        adminOnly: true,
      },
      {
        href: '/admin/settings',
        icon: Settings,
        label: 'Paramètres',
        adminOnly: true,
      },
    ]

    const filteredNavItems = navItems.filter(
      (item) => !item.adminOnly || profile.role === 'admin'
    )

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Mobile Header */}
        <header className="bg-white border-b sticky top-0 z-50 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-teal-600" />
              <div>
                <span className="font-semibold text-gray-900">Admin e-Actes</span>
                <p className="text-xs text-gray-600">Back-office</p>
              </div>
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
                    <p className="text-sm font-medium">{profile.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-teal-600 capitalize">{profile.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filteredNavItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action={signOutAdmin} className="w-full">
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
                  <p className="text-xs text-gray-600">Back-office</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {filteredNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" className="w-full justify-start">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-teal-100 text-teal-600">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile.full_name}
                  </p>
                  <p className="text-xs text-teal-600 capitalize">{profile.role}</p>
                </div>
              </div>
              <form action={signOutAdmin}>
                <Button type="submit" variant="outline" className="w-full" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </form>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 max-w-7xl">{children}</div>
          </main>
        </div>

        {/* Mobile Main Content */}
        <main className="lg:hidden p-4">{children}</main>
      </div>
    )
  } catch (error) {
    redirect('/admin-login?redirect=/admin')
  }
}

