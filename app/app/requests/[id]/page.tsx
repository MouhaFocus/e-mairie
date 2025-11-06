import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Calendar, FileText, User, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ACT_TYPES, REQUEST_STATUS } from '@/lib/constants'
import { Request, RequestEvent } from '@/lib/supabase/types'

type RequestWithProfile = Request & {
  profiles: { full_name: string } | null
}

type EventWithProfile = RequestEvent & {
  profiles: { full_name: string } | null
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  const supabase = await createServerSupabaseClient()

  // Fetch request
  const { data: request } = await supabase
    .from('requests')
    .select('*, profiles:citizen_id(full_name)')
    .eq('id', id)
    .single() as { data: RequestWithProfile | null }

  if (!request || request.citizen_id !== user!.id) {
    notFound()
  }

  // Fetch request events (timeline)
  const { data: events } = await supabase
    .from('request_events')
    .select('*, profiles:actor_id(full_name)')
    .eq('request_id', id)
    .order('created_at', { ascending: false }) as { data: EventWithProfile[] | null }

  const actInfo = ACT_TYPES[request.type_of_act]
  const statusInfo = REQUEST_STATUS[request.status]

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div>
        <Link
          href="/app"
          className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux demandes
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

      {/* Status Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>État de votre demande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {request.status === 'delivered' || request.status === 'ready_for_pickup' ? (
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{statusInfo.label}</h3>
              <p className="text-gray-600">{statusInfo.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Details */}
      <Card>
        <CardHeader>
          <CardTitle>Détails de la demande</CardTitle>
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
          <CardDescription>
            Suivi de l'évolution de votre demande
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current status event (always show) */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-teal-600" />
                </div>
                {events && events.length > 0 && (
                  <div className="w-0.5 bg-gray-200 flex-1 mt-2" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">{statusInfo.label}</h4>
                  <span className="text-sm text-gray-500">
                    {format(new Date(request.updated_at), 'dd MMM yyyy, HH:mm', {
                      locale: fr,
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{statusInfo.description}</p>
              </div>
            </div>

            {/* Historical events */}
            {events && events.length > 0 && events.map((event, index) => {
              const isLast = index === events.length - 1
              const eventStatus = REQUEST_STATUS[event.new_status as keyof typeof REQUEST_STATUS]

              return (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    {!isLast && <div className="w-0.5 bg-gray-200 flex-1 mt-2" />}
                  </div>
                  <div className={`flex-1 ${!isLast ? 'pb-6' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">
                        {event.previous_status && (
                          <>
                            {REQUEST_STATUS[event.previous_status as keyof typeof REQUEST_STATUS]?.label || event.previous_status}
                            {' → '}
                          </>
                        )}
                        {eventStatus?.label || event.new_status}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {format(new Date(event.created_at), 'dd MMM yyyy, HH:mm', {
                          locale: fr,
                        })}
                      </span>
                    </div>
                    {event.comment && (
                      <p className="text-sm text-gray-600 mb-1">{event.comment}</p>
                    )}
                    {event.profiles && (
                      <p className="text-xs text-gray-500">
                        Par {(event.profiles as any).full_name || 'Système'}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Initial creation event */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">Demande créée</h4>
                  <span className="text-sm text-gray-500">
                    {format(new Date(request.created_at), 'dd MMM yyyy, HH:mm', {
                      locale: fr,
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Votre demande a été enregistrée avec succès
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {request.status === 'ready_for_pickup' && (
        <Card className="bg-teal-50 border-teal-200">
          <CardHeader>
            <CardTitle className="text-teal-900">Votre document est prêt !</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-teal-800">
              Vous pouvez venir retirer votre document à la mairie aux horaires d'ouverture. 
              N'oubliez pas d'apporter une pièce d'identité.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button className="bg-teal-600 hover:bg-teal-700">
                Voir les horaires
              </Button>
              <Button variant="outline" className="border-teal-300 hover:bg-teal-100">
                Obtenir l'itinéraire
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Card */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">Besoin d'aide ?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Si vous avez des questions sur votre demande, n'hésitez pas à nous contacter.
          </p>
          <Button variant="outline" size="sm">
            Contacter la mairie
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

