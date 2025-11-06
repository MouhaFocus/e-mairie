import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { StatusBadge } from '@/components/ui/status-badge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ACT_TYPES } from '@/lib/constants'
import { Request } from '@/lib/supabase/types'

type RequestWithProfile = Request & {
  profiles: { full_name: string } | null
}

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient()

  // Fetch all requests
  const { data: requests } = await supabase
    .from('requests')
    .select('*, profiles:citizen_id(full_name)')
    .order('created_at', { ascending: false }) as { data: RequestWithProfile[] | null }

  // Calculate stats
  const totalRequests = requests?.length || 0
  const pendingCount = requests?.filter((r) => r.status === 'pending').length || 0
  const inReviewCount = requests?.filter((r) => r.status === 'in_review').length || 0
  const completedToday = requests?.filter((r) => {
    const today = new Date()
    const createdDate = new Date(r.created_at)
    return (
      (r.status === 'delivered' || r.status === 'ready_for_pickup') &&
      createdDate.toDateString() === today.toDateString()
    )
  }).length || 0

  // Get recent requests (last 10)
  const recentRequests = requests?.slice(0, 10) || []

  // Stats by type
  const birthCount = requests?.filter((r) => r.type_of_act === 'birth').length || 0
  const marriageCount = requests?.filter((r) => r.type_of_act === 'marriage').length || 0
  const deathCount = requests?.filter((r) => r.type_of_act === 'death').length || 0

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">
          Vue d'ensemble de l'activité des demandes d'actes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total demandes
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">Toutes périodes</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">
              En attente
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{pendingCount}</div>
            <p className="text-xs text-amber-700 mt-1">À traiter</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              En cours
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{inReviewCount}</div>
            <p className="text-xs text-blue-700 mt-1">En traitement</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-900">
              Traitées aujourd'hui
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{completedToday}</div>
            <p className="text-xs text-green-700 mt-1">Dernières 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats by Type */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par type d'acte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <span className="text-3xl">👶</span>
              <div>
                <p className="text-sm text-gray-600">Naissances</p>
                <p className="text-2xl font-bold text-gray-900">{birthCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg">
              <span className="text-3xl">💍</span>
              <div>
                <p className="text-sm text-gray-600">Mariages</p>
                <p className="text-2xl font-bold text-gray-900">{marriageCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <span className="text-3xl">🕊️</span>
              <div>
                <p className="text-sm text-gray-600">Décès</p>
                <p className="text-2xl font-bold text-gray-900">{deathCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Dernières demandes</CardTitle>
            <CardDescription>Les 10 demandes les plus récentes</CardDescription>
          </div>
          <Link href="/admin/requests">
            <span className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              Voir tout →
            </span>
          </Link>
        </CardHeader>
        <CardContent>
          {recentRequests.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucune demande pour le moment</p>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((request) => {
                const actType = ACT_TYPES[request.type_of_act]
                return (
                  <Link
                    key={request.id}
                    href={`/admin/requests/${request.id}`}
                    className="block"
                  >
                    <div className="border rounded-lg p-4 hover:border-teal-200 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-2xl">{actType.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {request.person_fullname}
                              </h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                              <span>{actType.label}</span>
                              <span>•</span>
                              <span>
                                {(request.profiles as any)?.full_name || 'Citoyen'}
                              </span>
                              <span>•</span>
                              <span>
                                {format(
                                  new Date(request.created_at),
                                  'dd MMM yyyy, HH:mm',
                                  { locale: fr }
                                )}
                              </span>
                            </div>
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

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="bg-teal-50 border-teal-200">
          <CardHeader>
            <CardTitle className="text-teal-900">Demandes en attente</CardTitle>
            <CardDescription className="text-teal-700">
              {pendingCount} demande{pendingCount > 1 ? 's' : ''} nécessite{pendingCount > 1 ? 'nt' : ''} votre attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/requests?status=pending">
              <span className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Traiter les demandes →
              </span>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Performance</CardTitle>
            <CardDescription className="text-blue-700">
              Temps moyen de traitement: 48h
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">+12% ce mois-ci</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

