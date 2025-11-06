// Layout vide pour la page de login admin
// Ce layout override le layout parent et permet d'accéder à la page sans authentification

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

