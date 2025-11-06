'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/client'
import { User, Phone, CreditCard, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Profile } from '@/lib/supabase/types'

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    national_id: '',
  })
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setEmail(user.email || '')
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single() as { data: Profile | null }

        if (data) {
          setProfile({
            full_name: data.full_name || '',
            phone: data.phone || '',
            national_id: data.national_id || '',
          })
        }
      }
    }

    loadProfile()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const result = await updateProfile(profile)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    }

    setIsLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-600 mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>
            Ces informations sont utilisées pour vos demandes d'actes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="pl-9 bg-gray-50"
                />
              </div>
              <p className="text-xs text-gray-500">
                Votre email ne peut pas être modifié
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="full_name"
                  type="text"
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  required
                  className="pl-9"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="pl-9"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="national_id">Numéro de pièce d'identité</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="national_id"
                  type="text"
                  value={profile.national_id}
                  onChange={(e) =>
                    setProfile({ ...profile, national_id: e.target.value })
                  }
                  className="pl-9"
                  placeholder="CNI, Passeport..."
                />
              </div>
              <p className="text-xs text-gray-500">
                Optionnel, mais peut accélérer le traitement de vos demandes
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-600">
                  Profil mis à jour avec succès !
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Protection des données</CardTitle>
          <CardDescription className="text-amber-700">
            Vos données personnelles sont sécurisées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-800">
            Vos informations sont stockées de manière sécurisée et ne sont utilisées 
            que dans le cadre de vos demandes d'actes d'état civil. Conformément au 
            RGPD, vous pouvez demander l'accès, la modification ou la suppression de 
            vos données à tout moment.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

