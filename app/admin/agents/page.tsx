import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users, Shield, UserCog } from 'lucide-react'
import { Profile } from '@/lib/supabase/types'
import { CreateAgentDialog } from '@/components/create-agent-dialog'

export default async function AgentsPage() {
  const supabase = await createServerSupabaseClient()

  // Check if current user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id || '')
    .single() as { data: { role: 'citizen' | 'agent' | 'admin' } | null }

  const isAdmin = currentUserProfile?.role === 'admin'

  // Fetch all users with agent or admin role
  const { data: agents } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['agent', 'admin'])
    .order('created_at', { ascending: false }) as { data: Profile[] | null }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const roleColors = {
    admin: 'bg-purple-100 text-purple-800',
    agent: 'bg-blue-100 text-blue-800',
    citizen: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des agents</h1>
          <p className="text-gray-600 mt-1">
            Liste des agents et administrateurs de la plateforme
          </p>
        </div>
        {isAdmin && <CreateAgentDialog />}
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Administrateurs
            </CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {agents?.filter((a) => a.role === 'admin').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Agents
            </CardTitle>
            <UserCog className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {agents?.filter((a) => a.role === 'agent').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agents List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des agents</CardTitle>
          <CardDescription>
            Membres de l'équipe avec accès au back-office
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents?.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:border-teal-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-teal-100 text-teal-600 font-semibold">
                      {getInitials(agent.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{agent.full_name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {agent.phone && (
                        <span className="text-sm text-gray-600">{agent.phone}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Badge className={roleColors[agent.role as keyof typeof roleColors]}>
                  {agent.role === 'admin' ? 'Administrateur' : 'Agent'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      {agents && agents.length === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Aucun agent trouvé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800">
              {isAdmin 
                ? "Cliquez sur le bouton 'Créer un agent' pour ajouter votre premier membre d'équipe."
                : "Contactez un administrateur pour ajouter des agents."}
            </p>
          </CardContent>
        </Card>
      )}
      
      {isAdmin && (
        <Card className="bg-teal-50 border-teal-200">
          <CardHeader>
            <CardTitle className="text-teal-900">À propos des rôles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-teal-800">
              <li>• <strong>Administrateur</strong>: Accès complet, peut créer et gérer les agents</li>
              <li>• <strong>Agent</strong>: Gestion des demandes, traitement et validation</li>
              <li>• <strong>Citoyen</strong>: Accès à l'espace citoyen uniquement</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

