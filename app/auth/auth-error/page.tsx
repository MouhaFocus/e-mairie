import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-center">Erreur d'authentification</CardTitle>
          <CardDescription className="text-center">
            Une erreur s'est produite lors de la connexion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Le lien de connexion a peut-être expiré ou est invalide. Veuillez réessayer.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/login">Réessayer</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

