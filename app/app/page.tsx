import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { EmptyState } from '@/components/ui/empty-state'
import { FileText, Plus, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ACT_TYPES } from '@/lib/constants'
import { Request } from '@/lib/supabase/types'

export default async function CitizenDashboard() {
  const user = await getCurrentUser()
  const supabase = await createServerSupabaseClient()

  // Fetch user's requests
  const { data: requests } = await supabase
    .from('requests')
    .select('*')
    .eq('citizen_id', user!.id)
    .order('created_at', { ascending: false }) as { data: Request[] | null }

  // Calculate stats
  const pendingCount = requests?.filter(r => r.status === 'pending').length || 0
  const inReviewCount = requests?.filter(r => r.status === 'in_review').length || 0
  const completedCount = requests?.filter(
    r => r.status === 'delivered' || r.status === 'ready_for_pickup'
  ).length || 0

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes demandes</h1>
          <p className="text-gray-600 mt-1">
            Suivez l'état de vos demandes d'actes d'état civil
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/app/requests/new">
            <Plus className="mr-2 h-5 w-5" />
            Nouvelle demande
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En attente
            </CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              En cours
            </CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inReviewCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Terminées
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des demandes</CardTitle>
          <CardDescription>
            {requests?.length || 0} demande{(requests?.length || 0) > 1 ? 's' : ''} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!requests || requests.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Aucune demande"
              description="Vous n'avez pas encore fait de demande d'acte d'état civil. Commencez par créer votre première demande."
              actionLabel="Créer une demande"
              actionHref="/app/requests/new"
            />
          ) : (
            <div className="space-y-4">
              {requests.map((request) => {
                const actType = ACT_TYPES[request.type_of_act]
                return (
                  <Link
                    key={request.id}
                    href={`/app/requests/${request.id}`}
                    className="block"
                  >
                    <div className="border rounded-xl p-4 hover:border-teal-200 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{actType.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900">
                                {actType.label}
                              </h3>
                              <p className="text-sm text-gray-600 truncate">
                                {request.person_fullname}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                            <span>
                              Demandé le{' '}
                              {format(new Date(request.created_at), 'dd MMMM yyyy', {
                                locale: fr,
                              })}
                            </span>
                            <span>•</span>
                            <span>{request.number_of_copies} copie{request.number_of_copies > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <StatusBadge status={request.status} />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="bg-teal-50 border-teal-200">
        <CardHeader>
          <CardTitle className="text-teal-900">Besoin d'aide ?</CardTitle>
          <CardDescription className="text-teal-700">
            Consultez notre FAQ ou contactez-nous
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="border-teal-300 hover:bg-teal-100">
              Consulter la FAQ
            </Button>
            <Button variant="outline" className="border-teal-300 hover:bg-teal-100">
              Nous contacter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

