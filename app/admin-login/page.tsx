'use client'

import { useState } from 'react'
import { signInWithPassword } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await signInWithPassword(loginEmail, loginPassword)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      // Check if user is admin or agent
      if (result.role !== 'admin' && result.role !== 'agent') {
        setError('Accès non autorisé. Cette page est réservée aux administrateurs et agents.')
        setIsLoading(false)
        // Sign out unauthorized user
        // await signOut()
      } else {
        // Redirect to admin dashboard
        router.push('/admin')
        router.refresh()
      }
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="h-10 w-10 text-teal-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mairie e-Actes</h1>
              <p className="text-sm text-gray-600">Backoffice administratif</p>
            </div>
          </div>
          <div className="space-y-4 text-gray-600">
            <p className="text-lg">
              Gérez les demandes d'actes d'état civil de votre commune de manière efficace et sécurisée.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-1">✓</span>
                <span>Traitement et validation des demandes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-1">✓</span>
                <span>Gestion des agents et des permissions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 mt-1">✓</span>
                <span>Suivi en temps réel des statistiques</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <Building2 className="h-8 w-8 text-teal-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mairie e-Actes</h1>
              <p className="text-xs text-gray-600">Backoffice</p>
            </div>
          </div>

          {/* Login form */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Connexion
            </h2>
            <p className="text-gray-600">
              Accès réservé aux administrateurs et agents
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Adresse e-mail *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@mairie.fr"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mot de passe *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 bg-teal-600 hover:bg-teal-700"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Vous avez oublié votre mot de passe ? Contactez votre administrateur système.
            </p>
          </div>

          <div className="mt-8">
            <a 
              href="/"
              className="text-sm text-teal-600 hover:text-teal-700 flex items-center justify-center gap-1"
            >
              ← Retour au site public
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

