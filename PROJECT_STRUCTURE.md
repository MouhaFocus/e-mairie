# Structure du projet Mairie e-Actes

## 📁 Organisation des fichiers

```
mairie-e-actes/
├── app/                          # Application Next.js (App Router)
│   ├── layout.tsx               # Layout racine + PWA config
│   ├── page.tsx                 # Page d'accueil publique
│   ├── globals.css              # Styles globaux Tailwind
│   │
│   ├── auth/                    # Routes d'authentification
│   │   ├── login/page.tsx      # Page de connexion (magic link)
│   │   ├── callback/route.ts   # Callback OAuth Supabase
│   │   └── auth-error/page.tsx # Page d'erreur auth
│   │
│   ├── app/                     # Espace citoyen (PWA)
│   │   ├── layout.tsx          # Layout avec sidebar + nav mobile
│   │   ├── page.tsx            # Dashboard citoyen
│   │   ├── profile/page.tsx    # Page profil utilisateur
│   │   └── requests/
│   │       ├── new/page.tsx    # Création de demande
│   │       └── [id]/page.tsx   # Détail d'une demande
│   │
│   └── admin/                   # Back-office agents
│       ├── layout.tsx          # Layout admin avec sidebar
│       ├── page.tsx            # Dashboard admin
│       ├── requests/
│       │   ├── page.tsx        # Liste des demandes
│       │   └── [id]/page.tsx   # Détail + gestion demande
│       ├── agents/page.tsx     # Gestion des agents
│       └── settings/page.tsx   # Paramètres
│
├── components/                  # Composants React
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── status-badge.tsx    # Badge de statut personnalisé
│   │   ├── empty-state.tsx     # État vide personnalisé
│   │   └── loading-spinner.tsx # Spinner de chargement
│   └── pwa-install-prompt.tsx  # Prompt d'installation PWA
│
├── lib/                         # Utilitaires et logique métier
│   ├── supabase/
│   │   ├── client.ts           # Client Supabase (browser)
│   │   ├── server.ts           # Client Supabase (server)
│   │   ├── middleware.ts       # Middleware Supabase
│   │   └── types.ts            # Types TypeScript générés
│   ├── actions/
│   │   ├── auth.ts             # Server actions auth
│   │   └── requests.ts         # Server actions demandes
│   ├── auth.ts                 # Helpers authentification
│   ├── constants.ts            # Constantes (types actes, statuts)
│   └── utils.ts                # Utilitaires (cn, etc.)
│
├── supabase/
│   └── schema.sql              # Schéma complet de la BDD
│
├── public/                      # Fichiers statiques
│   ├── manifest.json           # Manifest PWA
│   ├── sw.js                   # Service Worker
│   ├── offline.html            # Page hors ligne
│   ├── favicon.ico             # Favicon
│   └── icons/                  # Icônes PWA (à générer)
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png
│       ├── icon-384x384.png
│       └── icon-512x512.png
│
├── middleware.ts                # Middleware Next.js (auth)
├── .env.local                   # Variables d'environnement
├── .env.local.example          # Exemple de .env
├── package.json                # Dépendances npm
├── tsconfig.json               # Config TypeScript
├── tailwind.config.ts          # Config Tailwind
├── next.config.ts              # Config Next.js
├── README.md                   # Documentation principale
├── SETUP.md                    # Guide d'installation
└── PROJECT_STRUCTURE.md        # Ce fichier
```

## 🔑 Fichiers clés

### Configuration
- **`.env.local`** : Variables d'environnement Supabase (ne pas commit)
- **`middleware.ts`** : Protection des routes /app et /admin
- **`next.config.ts`** : Configuration Next.js
- **`tailwind.config.ts`** : Personnalisation des couleurs

### Routes principales
- **`/`** : Landing page publique
- **`/auth/login`** : Page de connexion
- **`/app`** : Dashboard citoyen (protégé)
- **`/app/requests/new`** : Création de demande
- **`/app/requests/[id]`** : Détail d'une demande
- **`/admin`** : Dashboard admin (protégé, role agent/admin)
- **`/admin/requests`** : Liste des demandes
- **`/admin/requests/[id]`** : Gestion d'une demande

### Logique métier
- **`lib/auth.ts`** : Helpers pour l'authentification (getCurrentUser, requireRole, etc.)
- **`lib/actions/auth.ts`** : Server actions pour auth (signIn, signOut, updateProfile)
- **`lib/actions/requests.ts`** : Server actions pour demandes (create, update, assign)
- **`lib/constants.ts`** : Définition des types d'actes et statuts

### Base de données
- **`supabase/schema.sql`** : Schéma complet avec :
  - Tables (profiles, requests, request_events)
  - Politiques RLS
  - Triggers et fonctions
  - Commentaires pour le storage

## 🎨 Design System

### Couleurs principales
- **Teal** (#0F766E) : Couleur principale (CTA, accents)
- **Blue** : Informations, en cours
- **Amber** : Avertissements, en attente
- **Green** : Succès, complété
- **Red** : Erreurs, refusé

### Composants UI
- Tous les composants shadcn/ui sont dans `components/ui/`
- Composants personnalisés : `status-badge`, `empty-state`, `loading-spinner`
- Style : rounded-2xl, shadow-sm, gradients subtils

### Layouts
- **Desktop** : Sidebar fixe à gauche
- **Mobile** : Header sticky + bottom navigation
- **Responsive** : Mobile-first, breakpoints Tailwind

## 🔐 Authentification et sécurité

### Flow d'authentification
1. User entre son email sur `/auth/login`
2. Server action `signInWithEmail` envoie un magic link
3. User clique sur le lien dans son email
4. Redirection vers `/auth/callback` qui échange le code
5. Création automatique du profil si première connexion
6. Redirection vers `/app`

### Protection des routes
- **Middleware** : Vérifie l'auth sur `/app/*` et `/admin/*`
- **Server components** : Utilisent `getCurrentUser()` et `requireRole()`
- **RLS Supabase** : Double sécurité au niveau de la base de données

### Rôles
- **citizen** : Accès à `/app` uniquement, voit ses propres demandes
- **agent** : Accès à `/admin`, peut gérer toutes les demandes
- **admin** : Comme agent + accès aux pages agents et settings

## 📊 Flux de données

### Citizen crée une demande
```
User (browser)
  → Server Action createRequest()
  → Supabase insert dans 'requests'
  → RLS vérifie que citizen_id = auth.uid()
  → Trigger crée un event dans 'request_events'
  → Retour vers dashboard
```

### Agent change un statut
```
Agent (browser)
  → Server Action updateRequestStatus()
  → Vérification du rôle (agent/admin)
  → Supabase update 'requests'
  → Trigger automatique crée un event
  → Revalidation des caches Next.js
  → Citizen voit le changement
```

## 🔄 État et caching

### Server Components
- Récupèrent les données directement depuis Supabase
- Utilisent le cache Next.js par défaut
- Revalidation avec `revalidatePath()` après mutations

### Client Components
- Pour les interactions utilisateur (formulaires, filtres)
- Utilisent `createClient()` pour Supabase
- useState/useEffect pour l'état local

### Server Actions
- Fonctions marquées `'use server'`
- Gèrent les mutations (create, update)
- Revalidate automatiquement les pages concernées

## 📱 PWA

### Manifest (`public/manifest.json`)
- Nom, icônes, couleurs
- Display: standalone
- Shortcuts vers pages clés

### Service Worker (`public/sw.js`)
- Cache les assets statiques
- Stratégie network-first pour les requêtes
- Page offline de fallback
- Placeholder pour push notifications

### Install Prompt
- Composant `PWAInstallPrompt`
- Écoute l'événement `beforeinstallprompt`
- Affichage après 3 secondes
- Mémorisation du refus dans localStorage

## 🧪 Testing (à implémenter)

Suggestions pour les tests futurs :
- **Unit tests** : lib/auth.ts, lib/constants.ts
- **Integration tests** : Server actions
- **E2E tests** : Parcours complets (Playwright, Cypress)

## 📦 Déploiement

### Variables d'environnement requises
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Build
```bash
npm run build
```

### Plateforme recommandée
Vercel (support natif Next.js + edge functions)

## 🔮 Extensions futures possibles

1. **Upload de fichiers** : Implémenter l'upload réel vers Supabase Storage
2. **Notifications email** : Intégrer Resend ou SendGrid
3. **Push notifications** : Activer les notifications web push
4. **Export PDF** : Génération d'actes en PDF
5. **Stats avancées** : Graphiques et métriques pour les admins
6. **i18n** : Support multilingue
7. **Dark mode** : Thème sombre
8. **Paiement** : Intégration Stripe pour les actes payants
9. **Signature électronique** : DocuSign, HelloSign
10. **Historique d'audit** : Logs détaillés de toutes les actions

## 📚 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

