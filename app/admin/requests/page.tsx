'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/status-badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { FileText, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ACT_TYPES } from '@/lib/constants'
import { Request } from '@/lib/supabase/types'

type RequestWithProfile = Request & {
  profiles: { full_name: string } | null
}

export default function AdminRequestsListPage() {
  const [requests, setRequests] = useState<RequestWithProfile[]>([])
  const [filteredRequests, setFilteredRequests] = useState<RequestWithProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchRequests() {
      const supabase = createClient()
      const { data } = await supabase
        .from('requests')
        .select('*, profiles:citizen_id(full_name)')
        .order('created_at', { ascending: false })

      if (data) {
        setRequests(data as RequestWithProfile[])
        setFilteredRequests(data as RequestWithProfile[])
      }
      setIsLoading(false)
    }

    fetchRequests()
  }, [])

  useEffect(() => {
    let filtered = [...requests]

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter)
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter((r) => r.type_of_act === typeFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.person_fullname.toLowerCase().includes(query) ||
          r.profiles?.full_name.toLowerCase().includes(query) ||
          r.id.toLowerCase().includes(query)
      )
    }

    setFilteredRequests(filtered)
  }, [statusFilter, typeFilter, searchQuery, requests])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Toutes les demandes</h1>
        <p className="text-gray-600 mt-1">
          Gérez et suivez toutes les demandes d'actes d'état civil
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {requests.filter((r) => r.status === 'pending').length}
            </div>
            <p className="text-xs text-gray-600">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {requests.filter((r) => r.status === 'in_review').length}
            </div>
            <p className="text-xs text-gray-600">En cours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {requests.filter((r) => r.status === 'delivered' || r.status === 'ready_for_pickup').length}
            </div>
            <p className="text-xs text-gray-600">Terminées</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Affiner la liste des demandes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rechercher</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nom, numéro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="in_review">En cours d'examen</SelectItem>
                  <SelectItem value="approved">Approuvée</SelectItem>
                  <SelectItem value="rejected">Refusée</SelectItem>
                  <SelectItem value="ready_for_pickup">Prêt à retirer</SelectItem>
                  <SelectItem value="delivered">Délivré</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type d'acte</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="birth">Naissance</SelectItem>
                  <SelectItem value="marriage">Mariage</SelectItem>
                  <SelectItem value="death">Décès</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(statusFilter !== 'all' || typeFilter !== 'all' || searchQuery) && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>
                {filteredRequests.length} résultat{filteredRequests.length > 1 ? 's' : ''} trouvé{filteredRequests.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des demandes</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRequests.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Aucune demande"
              description="Aucune demande ne correspond à vos critères de recherche."
            />
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((request) => {
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
                              <span>{request.profiles?.full_name || 'Inconnu'}</span>
                              <span>•</span>
                              <span>
                                {format(
                                  new Date(request.created_at),
                                  'dd MMM yyyy, HH:mm',
                                  { locale: fr }
                                )}
                              </span>
                              <span>•</span>
                              <span className="font-mono text-xs">
                                #{request.id.slice(0, 8).toUpperCase()}
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
    </div>
  )
}

