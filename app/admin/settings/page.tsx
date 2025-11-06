import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, FileText, Mail, Clock, Shield } from 'lucide-react'
import { ACT_TYPES } from '@/lib/constants'

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">
          Configuration de la plateforme
        </p>
      </div>

      {/* Act Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Types d'actes disponibles
          </CardTitle>
          <CardDescription>
            Actes d'état civil proposés aux citoyens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(ACT_TYPES).map(([key, act]) => (
              <div key={key} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-3xl">{act.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{act.label}</h3>
                  <p className="text-sm text-gray-600">{act.description}</p>
                </div>
                <div className="text-sm text-green-600 font-medium">Actif</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processing Times */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Délais de traitement
          </CardTitle>
          <CardDescription>
            Temps moyen de traitement par type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">Acte de naissance</span>
              <span className="text-sm text-gray-600">48-72h ouvrées</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">Acte de mariage</span>
              <span className="text-sm text-gray-600">48-72h ouvrées</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium">Acte de décès</span>
              <span className="text-sm text-gray-600">24-48h ouvrées</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configuration des notifications par email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Nouvelle demande</p>
                <p className="text-sm text-gray-600">Alerter les agents</p>
              </div>
              <div className="text-sm text-green-600 font-medium">Activé</div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Changement de statut</p>
                <p className="text-sm text-gray-600">Notifier le citoyen</p>
              </div>
              <div className="text-sm text-green-600 font-medium">Activé</div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Document prêt</p>
                <p className="text-sm text-gray-600">Notification de retrait</p>
              </div>
              <div className="text-sm text-green-600 font-medium">Activé</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité et authentification
          </CardTitle>
          <CardDescription>
            Paramètres de sécurité de la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Authentification par email (Magic Link)</p>
                <p className="text-sm text-gray-600">Connexion sécurisée sans mot de passe</p>
              </div>
              <div className="text-sm text-green-600 font-medium">Actif</div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">RLS Supabase</p>
                <p className="text-sm text-gray-600">Sécurité au niveau des lignes</p>
              </div>
              <div className="text-sm text-green-600 font-medium">Actif</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Configuration avancée</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-800">
            Pour modifier ces paramètres, veuillez accéder directement à la configuration 
            Supabase ou modifier les fichiers de constantes dans le code source. 
            Une interface de configuration complète peut être ajoutée dans une version future.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

