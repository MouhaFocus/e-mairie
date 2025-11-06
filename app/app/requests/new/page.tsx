'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createRequest } from '@/lib/actions/requests'
import { ACT_TYPES } from '@/lib/constants'
import { ArrowLeft, FileText, Upload } from 'lucide-react'
import Link from 'next/link'

const requestSchema = z.object({
  type_of_act: z.enum(['birth', 'marriage', 'death']),
  person_fullname: z.string().min(2, 'Le nom complet est requis'),
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  date_of_birth: z.string().optional(),
  place_of_birth: z.string().optional(),
  number_of_copies: z.number().min(1).max(10),
  purpose: z.string().optional(),
})

type RequestFormData = z.infer<typeof requestSchema>

export default function NewRequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<'birth' | 'marriage' | 'death' | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      number_of_copies: 1,
    },
  })

  const typeOfAct = watch('type_of_act')

  async function onSubmit(data: RequestFormData) {
    setIsSubmitting(true)
    setError(null)

    const result = await createRequest(data)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      router.push('/app')
    }
  }

  if (!selectedType) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-8">
        <div>
          <Link
            href="/app"
            className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux demandes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle demande</h1>
          <p className="text-gray-600 mt-1">
            Choisissez le type d'acte que vous souhaitez demander
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(ACT_TYPES).map(([key, act]) => (
            <Card
              key={key}
              className="cursor-pointer hover:border-teal-300 hover:shadow-lg transition-all"
              onClick={() => {
                setSelectedType(key as 'birth' | 'marriage' | 'death')
                setValue('type_of_act', key as 'birth' | 'marriage' | 'death')
              }}
            >
              <CardHeader className="text-center">
                <div className="text-5xl mb-4">{act.icon}</div>
                <CardTitle className="text-xl">{act.label}</CardTitle>
                <CardDescription>{act.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Sélectionner
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Documents nécessaires</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Pièce d'identité (CNI, passeport)</li>
              <li>• Informations sur la personne concernée par l'acte</li>
              <li>• Justificatif de domicile (optionnel mais recommandé)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    )
  }

  const actInfo = ACT_TYPES[selectedType]

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <div>
        <button
          onClick={() => setSelectedType(null)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Changer le type d'acte
        </button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{actInfo.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{actInfo.label}</h1>
            <p className="text-gray-600">{actInfo.description}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations sur la personne</CardTitle>
            <CardDescription>
              Renseignez les informations de la personne concernée par l'acte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="person_fullname">
                Nom complet de la personne *
              </Label>
              <Input
                id="person_fullname"
                {...register('person_fullname')}
                placeholder="Jean Dupont"
              />
              {errors.person_fullname && (
                <p className="text-sm text-red-600">{errors.person_fullname.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Nom et prénom(s) tels qu'ils apparaissent sur l'acte
              </p>
            </div>

            {selectedType === 'birth' && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="father_name">Nom du père</Label>
                    <Input
                      id="father_name"
                      {...register('father_name')}
                      placeholder="Pierre Dupont"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mother_name">Nom de la mère</Label>
                    <Input
                      id="mother_name"
                      {...register('mother_name')}
                      placeholder="Marie Martin"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date de naissance</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      {...register('date_of_birth')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="place_of_birth">Lieu de naissance</Label>
                    <Input
                      id="place_of_birth"
                      {...register('place_of_birth')}
                      placeholder="Paris"
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Détails de la demande</CardTitle>
            <CardDescription>
              Précisez le nombre de copies et l'usage prévu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="number_of_copies">Nombre de copies *</Label>
              <Select
                onValueChange={(value) =>
                  setValue('number_of_copies', parseInt(value))
                }
                defaultValue="1"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} copie{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Motif de la demande</Label>
              <Textarea
                id="purpose"
                {...register('purpose')}
                placeholder="Ex: Renouvellement carte d'identité, dossier mariage..."
                rows={3}
              />
              <p className="text-xs text-gray-500">
                Optionnel mais aide au traitement de votre demande
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pièces justificatives</CardTitle>
            <CardDescription>
              Joignez les documents nécessaires (optionnel)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-300 transition-colors cursor-pointer">
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                Glissez vos fichiers ici ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-gray-500">
                PDF, JPG, PNG (max 5MB par fichier)
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: L'upload de fichiers sera traité après soumission du formulaire
            </p>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            className="sm:w-auto"
            onClick={() => router.push('/app')}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting}
          >
            <FileText className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
          </Button>
        </div>
      </form>

      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Délai de traitement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-800">
            Votre demande sera traitée sous 48 à 72 heures ouvrées. Vous recevrez 
            une notification par email à chaque étape du traitement.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

