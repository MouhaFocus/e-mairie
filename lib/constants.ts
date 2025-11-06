import { ActType, RequestStatus } from './supabase/types'

export const ACT_TYPES: Record<ActType, { label: string; description: string; icon: string }> = {
  birth: {
    label: 'Acte de naissance',
    description: 'Certificat attestant de votre naissance',
    icon: '👶',
  },
  marriage: {
    label: 'Acte de mariage',
    description: 'Certificat attestant de votre union',
    icon: '💍',
  },
  death: {
    label: 'Acte de décès',
    description: 'Certificat attestant du décès',
    icon: '🕊️',
  },
}

export const REQUEST_STATUS: Record<
  RequestStatus,
  {
    label: string
    color: 'gray' | 'amber' | 'green' | 'red' | 'blue' | 'emerald'
    description: string
  }
> = {
  pending: {
    label: 'En attente',
    color: 'gray',
    description: 'Votre demande a été reçue et est en attente de traitement',
  },
  in_review: {
    label: 'En cours d\'examen',
    color: 'amber',
    description: 'Votre demande est actuellement examinée par nos services',
  },
  approved: {
    label: 'Approuvée',
    color: 'green',
    description: 'Votre demande a été approuvée',
  },
  rejected: {
    label: 'Refusée',
    color: 'red',
    description: 'Votre demande a été refusée',
  },
  ready_for_pickup: {
    label: 'Prêt à retirer',
    color: 'blue',
    description: 'Votre document est prêt et peut être retiré',
  },
  delivered: {
    label: 'Délivré',
    color: 'emerald',
    description: 'Votre document a été délivré',
  },
}

