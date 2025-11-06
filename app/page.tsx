import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Mail, CheckCircle, Download, ArrowRight, Building2, Phone } from 'lucide-react'
import Link from 'next/link'
import { ACT_TYPES } from '@/lib/constants'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-teal-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mairie e-Actes</h1>
              <p className="text-xs text-gray-600">Commune de Ville</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
              Services
            </a>
            <a href="#fonctionnement" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
              Fonctionnement
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors">
              Contact
            </a>
            <Button asChild>
              <Link href="/auth/login">Se connecter</Link>
            </Button>
          </nav>
          <Button asChild className="md:hidden">
            <Link href="/auth/login">Connexion</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-6">
            <CheckCircle className="h-4 w-4" />
            Service disponible 24h/24
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Demandez vos actes d'état civil{' '}
            <span className="text-teal-600">en ligne</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Simplifiez vos démarches administratives. Demandez vos documents officiels 
            depuis chez vous, suivez leur traitement en temps réel, et recevez des notifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg h-14 px-8">
              <Link href="/auth/login">
                Faire une demande
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg h-14 px-8">
              <Link href="#fonctionnement">
                Comment ça marche ?
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-4 py-16 bg-white/50 rounded-3xl mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Types d'actes disponibles
            </h2>
            <p className="text-lg text-gray-600">
              Tous vos documents d'état civil en quelques clics
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(ACT_TYPES).map(([key, act]) => (
              <Card key={key} className="border-2 hover:border-teal-200 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="text-4xl mb-4">{act.icon}</div>
                  <CardTitle>{act.label}</CardTitle>
                  <CardDescription>{act.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Copie intégrale ou extrait</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Traitement sous 48-72h</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Gratuit et sécurisé</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="fonctionnement" className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="text-lg text-gray-600">
              Une démarche simple en 4 étapes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-100 text-teal-600 text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Remplissez votre demande</h3>
              <p className="text-gray-600 text-sm">
                Créez un compte et remplissez le formulaire en ligne avec les informations nécessaires
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">La mairie valide</h3>
              <p className="text-gray-600 text-sm">
                Nos agents vérifient votre demande et préparent votre document officiel
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Recevez une notification</h3>
              <p className="text-gray-600 text-sm">
                Vous êtes alerté par email dès que votre document est prêt
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 text-2xl font-bold mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Retirez votre acte</h3>
              <p className="text-gray-600 text-sm">
                Venez retirer votre document à la mairie ou recevez-le par courrier
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Install Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-teal-600 to-blue-600 text-white border-0">
          <CardHeader className="text-center">
            <Download className="h-12 w-12 mx-auto mb-4" />
            <CardTitle className="text-3xl text-white">Installez l'application</CardTitle>
            <CardDescription className="text-teal-50 text-lg">
              Accédez plus rapidement à vos démarches en installant notre application sur votre téléphone
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Download className="mr-2 h-5 w-5" />
                Installer l'app
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                En savoir plus
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contactez-nous
            </h2>
            <p className="text-lg text-gray-600">
              Notre équipe est là pour vous accompagner
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <Building2 className="h-8 w-8 mx-auto mb-2 text-teal-600" />
                <CardTitle className="text-lg">Adresse</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-gray-600">
                <p>1 Place de la Mairie</p>
                <p>75000 Paris</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Phone className="h-8 w-8 mx-auto mb-2 text-teal-600" />
                <CardTitle className="text-lg">Téléphone</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-gray-600">
                <p>01 23 45 67 89</p>
                <p className="text-xs text-gray-500 mt-1">Lun-Ven: 9h-17h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Mail className="h-8 w-8 mx-auto mb-2 text-teal-600" />
                <CardTitle className="text-lg">Email</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-gray-600">
                <p>contact@mairie-ville.fr</p>
                <p className="text-xs text-gray-500 mt-1">Réponse sous 24h</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6 text-teal-400" />
                <span className="font-semibold text-white">Mairie e-Actes</span>
              </div>
              <p className="text-sm">
                Service de demande d'actes d'état civil en ligne de la Commune de Ville.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Acte de naissance</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Acte de mariage</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Acte de décès</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Informations</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Données personnelles</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Accessibilité</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>1 Place de la Mairie</li>
                <li>75000 Paris</li>
                <li>01 23 45 67 89</li>
                <li>contact@mairie-ville.fr</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2025 Commune de Ville. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
