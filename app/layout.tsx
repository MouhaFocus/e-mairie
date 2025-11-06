import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0F766E',
}

export const metadata: Metadata = {
  title: 'Mairie e-Actes - Demandez vos actes d\'état civil en ligne',
  description: 'Service en ligne de demande d\'actes d\'état civil (naissance, mariage, décès). Simplifiez vos démarches administratives avec la Commune de Ville.',
  keywords: ['mairie', 'actes', 'état civil', 'naissance', 'mariage', 'décès', 'administration', 'en ligne'],
  authors: [{ name: 'Commune de Ville' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mairie e-Actes',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Mairie e-Actes',
    title: 'Mairie e-Actes - Demandez vos actes en ligne',
    description: 'Service en ligne de demande d\'actes d\'état civil',
  },
  twitter: {
    card: 'summary',
    title: 'Mairie e-Actes',
    description: 'Service en ligne de demande d\'actes d\'état civil',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registered:', registration);
                    },
                    function(error) {
                      console.log('Service Worker registration failed:', error);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
