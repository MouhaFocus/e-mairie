# Mairie e-Actes

Une plateforme moderne de digitalisation de l'état civil pour les communes, permettant aux citoyens de demander leurs actes d'état civil en ligne.

## 🎯 Fonctionnalités

### Espace Public
- Page d'accueil avec présentation du service
- Informations sur les types d'actes disponibles (naissance, mariage, décès)
- Guide d'utilisation en 4 étapes
- Informations de contact de la mairie

### Espace Citoyen (PWA)
- **Authentification** : Connexion sécurisée par email (magic link)
- **Tableau de bord** : Vue d'ensemble des demandes avec statistiques
- **Création de demande** : Formulaire guidé pour demander un acte
- **Suivi en temps réel** : Timeline détaillée de chaque demande
- **Profil utilisateur** : Gestion des informations personnelles
- **PWA** : Installation sur mobile, notifications, mode hors ligne

### Back-office Agents
- **Tableau de bord** : Statistiques et vue d'ensemble
- **Gestion des demandes** : Liste, filtres, recherche
- **Traitement** : Changement de statut, ajout de notes internes
- **Timeline** : Historique complet de chaque demande
- **Gestion agents** : Liste des agents et administrateurs
- **Paramètres** : Configuration du service

## 🛠 Stack Technique

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **UI Components** : shadcn/ui
- **Backend** : Supabase (PostgreSQL)
  - Auth avec magic link
  - Database avec RLS
  - Storage pour pièces jointes
- **Forms** : react-hook-form + zod
- **PWA** : Service Worker, Manifest, Install prompt

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd mairie-e-actes
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Supabase**

Créez un projet sur [Supabase](https://supabase.com) puis :

- Exécutez le script SQL dans `supabase/schema.sql` dans l'éditeur SQL
- Créez un bucket de stockage nommé `request-attachments`
- Configurez les politiques RLS (incluses dans le schema.sql)

4. **Configuration des variables d'environnement**

Copiez le fichier `.env.local.example` vers `.env.local` :
```bash
cp .env.local.example .env.local
```

Puis modifiez `.env.local` avec vos credentials Supabase :
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

5. **Lancer en développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📱 PWA - Configuration

### Icônes

Générez les icônes PWA et placez-les dans `/public/icons/` :
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

Outils recommandés :
- [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)
- [Real Favicon Generator](https://realfavicongenerator.net/)

### Service Worker

Le service worker est configuré dans `/public/sw.js` et enregistré automatiquement au chargement de l'application.

## 🗄 Base de données

### Tables principales

- **profiles** : Profils utilisateurs (citoyens, agents, admins)
- **requests** : Demandes d'actes d'état civil
- **request_events** : Historique des changements de statut

### Sécurité (RLS)

Les politiques de Row Level Security sont configurées pour :
- Les citoyens ne voient que leurs propres demandes
- Les agents/admins ont accès à toutes les demandes
- Seuls les agents/admins peuvent modifier les statuts

### Créer un utilisateur admin

Pour créer un compte admin, après inscription :

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'user-uuid';
```

## 🎨 Design System

Le design suit les principes d'une application gouvernementale moderne :
- **Couleur principale** : Teal (#0F766E)
- **Cartes** : rounded-2xl avec shadow-sm
- **Mobile-first** : Responsive avec bottom navigation sur mobile
- **Status badges** : Codes couleur clairs pour les statuts
- **Typographie** : Système de fonts par défaut

## 📦 Scripts disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Lancer en production
npm start

# Linter
npm run lint
```

## 🔐 Authentification

L'authentification utilise les **Magic Links** de Supabase :
1. L'utilisateur entre son email
2. Un lien de connexion est envoyé par email
3. En cliquant sur le lien, l'utilisateur est authentifié
4. Un profil est créé automatiquement si première connexion

## 📊 Statuts des demandes

- **pending** : En attente de traitement
- **in_review** : En cours d'examen par un agent
- **approved** : Demande approuvée
- **rejected** : Demande refusée
- **ready_for_pickup** : Document prêt à être retiré
- **delivered** : Document délivré

## 🚀 Déploiement

### Vercel (recommandé)

1. Pushez votre code sur GitHub
2. Importez le projet sur [Vercel](https://vercel.com)
3. Ajoutez les variables d'environnement
4. Déployez !

### Autres plateformes

Compatible avec toutes les plateformes supportant Next.js :
- Netlify
- Railway
- Render
- etc.

## 📝 TODO / Améliorations futures

- [ ] Upload réel de fichiers vers Supabase Storage
- [ ] Notifications push web
- [ ] Envoi d'emails automatiques (Resend, SendGrid)
- [ ] Export PDF des actes
- [ ] Statistiques avancées pour les admins
- [ ] Tests unitaires et E2E
- [ ] i18n (multilingue)
- [ ] Dark mode

## 🤝 Contribution

Ce projet est un template de démonstration. Pour l'adapter à votre commune :

1. Modifiez les informations de la mairie dans les pages
2. Personnalisez les couleurs dans `tailwind.config.ts`
3. Remplacez les icônes PWA par votre logo
4. Adaptez le schéma de base de données selon vos besoins

## 📄 Licence

Ce projet est fourni à titre d'exemple. Adaptez-le selon vos besoins.

## 🚀 Déploiement

### Déploiement rapide

Pour déployer rapidement sur Vercel + Supabase, suivez le guide condensé :

📖 **[Guide de déploiement rapide](./DEPLOY_QUICK.md)**

### Guide complet

Pour un guide détaillé avec toutes les étapes et le dépannage :

📖 **[Guide de déploiement complet](./DEPLOYMENT.md)**

### Prérequis

- ✅ Compte GitHub
- ✅ Compte Vercel (gratuit)
- ✅ Compte Supabase (gratuit)

### Variables d'environnement requises

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service_role Supabase (serveur uniquement) |
| `NEXT_PUBLIC_SITE_URL` | URL de votre application déployée |

## 🆘 Support

Pour toute question ou problème :
- Vérifiez que Supabase est correctement configuré
- Vérifiez les logs de la console navigateur
- Vérifiez les logs Supabase pour les erreurs RLS
- Consultez le [guide de déploiement](./DEPLOYMENT.md) pour le dépannage

## 🎓 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
