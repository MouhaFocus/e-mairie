'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/ui/status-badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Separator } from '@/components/ui/separator'
import { updateRequestStatus, addRequestNote } from '@/lib/actions/requests'
import { ArrowLeft, Save, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ACT_TYPES, REQUEST_STATUS } from '@/lib/constants'
import { Request, RequestEvent, RequestStatus } from '@/lib/supabase/types'
import { use } from 'react'

type RequestWithProfile = Request & {
  profiles: { full_name: string } | null
}

type EventWithProfile = RequestEvent & {
  profiles: { full_name: string } | null
}

export default function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [request, setRequest] = useState<RequestWithProfile | null>(null)
  const [events, setEvents] = useState<EventWithProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [newStatus, setNewStatus] = useState<RequestStatus | ''>('')
  const [newNotes, setNewNotes] = useState('')
  const [statusComment, setStatusComment] = useState('')

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Fetch request
      const { data: requestData } = await supabase
        .from('requests')
        .select('*, profiles:citizen_id(full_name)')
        .eq('id', id)
        .single() as { data: RequestWithProfile | null }

      if (requestData) {
        setRequest(requestData)
        setNewNotes(requestData.notes || '')
      }

      // Fetch events
      const { data: eventsData } = await supabase
        .from('request_events')
        .select('*, profiles:actor_id(full_name)')
        .eq('request_id', id)
        .order('created_at', { ascending: false }) as { data: EventWithProfile[] | null }

      if (eventsData) {
        setEvents(eventsData)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [id])

  async function handleStatusUpdate() {
    if (!newStatus) return

    setIsSaving(true)
    const result = await updateRequestStatus(id, newStatus, statusComment)

    if (!result.error) {
      router.refresh()
      setNewStatus('')
      setStatusComment('')
      // Reload data
      window.location.reload()
    }

    setIsSaving(false)
  }

  async function handleNotesUpdate() {
    setIsSaving(true)
    const result = await addRequestNote(id, newNotes)

    if (!result.error) {
      router.refresh()
    }

    setIsSaving(false)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Demande introuvable</p>
        <Link href="/admin/requests">
          <Button className="mt-4" variant="outline">
            Retour à la liste
          </Button>
        </Link>
      </div>
    )
  }

  const actInfo = ACT_TYPES[request.type_of_act]

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/requests"
          className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{actInfo.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{actInfo.label}</h1>
              <p className="text-gray-600">{request.person_fullname}</p>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de la demande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Numéro de demande</p>
                  <p className="font-mono text-sm">{request.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date de demande</p>
                  <p className="font-medium">
                    {format(new Date(request.created_at), 'dd MMMM yyyy à HH:mm', {
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600 mb-1">Demandeur</p>
                <p className="font-medium">{request.profiles?.full_name || 'Inconnu'}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600 mb-1">Type d'acte</p>
                <p className="font-medium">{actInfo.label}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Personne concernée</p>
                <p className="font-medium">{request.person_fullname}</p>
              </div>

              {request.father_name && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nom du père</p>
                  <p className="font-medium">{request.father_name}</p>
                </div>
              )}

              {request.mother_name && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nom de la mère</p>
                  <p className="font-medium">{request.mother_name}</p>
                </div>
              )}

              {request.date_of_birth && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date de naissance</p>
                  <p className="font-medium">
                    {format(new Date(request.date_of_birth), 'dd MMMM yyyy', {
                      locale: fr,
                    })}
                  </p>
                </div>
              )}

              {request.place_of_birth && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lieu de naissance</p>
                  <p className="font-medium">{request.place_of_birth}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600 mb-1">Nombre de copies</p>
                <p className="font-medium">
                  {request.number_of_copies} copie{request.number_of_copies > 1 ? 's' : ''}
                </p>
              </div>

              {request.purpose && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Motif</p>
                  <p className="font-medium">{request.purpose}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Historique</CardTitle>
              <CardDescription>Événements liés à cette demande</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event, index) => {
                  const isLast = index === events.length - 1
                  const eventStatus = REQUEST_STATUS[event.new_status as keyof typeof REQUEST_STATUS]

                  return (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <Clock className="h-4 w-4 text-teal-600" />
                        </div>
                        {!isLast && <div className="w-0.5 bg-gray-200 flex-1 mt-2" />}
                      </div>
                      <div className={`flex-1 ${!isLast ? 'pb-4' : ''}`}>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">
                            {eventStatus?.label || event.new_status}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {format(new Date(event.created_at), 'dd MMM, HH:mm', {
                              locale: fr,
                            })}
                          </span>
                        </div>
                        {event.comment && (
                          <p className="text-sm text-gray-600 mb-1">{event.comment}</p>
                        )}
                        {event.profiles && (
                          <p className="text-xs text-gray-500">
                            Par {event.profiles.full_name}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* Creation event */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm">Demande créée</h4>
                      <span className="text-xs text-gray-500">
                        {format(new Date(request.created_at), 'dd MMM, HH:mm', {
                          locale: fr,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Par {request.profiles?.full_name || 'Citoyen'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Change Status */}
          <Card className="border-teal-200">
            <CardHeader>
              <CardTitle className="text-teal-900">Changer le statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nouveau statut</label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as RequestStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
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
                <label className="text-sm font-medium">Commentaire (optionnel)</label>
                <Textarea
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  rows={3}
                />
              </div>

              <Button
                onClick={handleStatusUpdate}
                className="w-full"
                disabled={!newStatus || isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Enregistrement...' : 'Mettre à jour'}
              </Button>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes internes</CardTitle>
              <CardDescription>Visibles uniquement par les agents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Ajouter des notes..."
                rows={5}
              />
              <Button
                onClick={handleNotesUpdate}
                variant="outline"
                className="w-full"
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les notes
              </Button>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm text-blue-900">Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800">
                Le citoyen recevra une notification par email à chaque changement de statut.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

