# Guide d'installation et de configuration - Mairie e-Actes

Ce guide vous accompagne pas à pas dans l'installation et la configuration de la plateforme.

## Étape 1 : Installation locale

### 1.1 Prérequis
- Node.js 18 ou supérieur
- npm ou yarn
- Un éditeur de code (VS Code recommandé)

### 1.2 Cloner et installer
```bash
# Aller dans le dossier du projet (déjà créé)
cd mairie-e-actes

# Les dépendances sont déjà installées, mais si besoin :
npm install
```

## Étape 2 : Configuration Supabase

### 2.1 Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet :
   - Nom : "mairie-e-actes" (ou autre)
   - Mot de passe : Choisissez un mot de passe fort
   - Région : Choisissez la plus proche de vous

### 2.2 Exécuter le schéma SQL
1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Ouvrez le fichier `supabase/schema.sql` de ce projet
3. Copiez tout le contenu
4. Collez-le dans l'éditeur SQL de Supabase
5. Cliquez sur **Run** (en bas à droite)

Vous devriez voir :
- ✓ Tables créées : profiles, requests, request_events
- ✓ Politiques RLS activées
- ✓ Fonctions et triggers créés

### 2.3 Configurer le Storage
1. Dans Supabase, allez dans **Storage**
2. Créez un nouveau bucket :
   - Nom : `request-attachments`
   - Public : **Non** (privé)
3. Dans les politiques du bucket, vous pouvez ajouter les règles suivantes :
   - Voir les commentaires dans `supabase/schema.sql` pour les politiques de storage

### 2.4 Récupérer les clés API
1. Dans Supabase, allez dans **Settings > API**
2. Copiez :
   - **Project URL** (commence par https://xxx.supabase.co)
   - **anon/public key** (commence par eyJ...)
   - **service_role key** (commence par eyJ...)

### 2.5 Configurer les variables d'environnement
1. Ouvrez le fichier `.env.local` à la racine du projet
2. Remplacez les valeurs par vos clés :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...votre-service-role-key
```

## Étape 3 : Configuration de l'authentification

### 3.1 Configurer les emails
1. Dans Supabase, allez dans **Authentication > Email Templates**
2. Personnalisez le template "Magic Link" si vous le souhaitez

### 3.2 Configurer l'URL de redirection
1. Allez dans **Authentication > URL Configuration**
2. Ajoutez les URLs autorisées :
   - `http://localhost:3000/**` (pour le développement)
   - `https://votre-domaine.com/**` (pour la production)

## Étape 4 : Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## Étape 5 : Créer votre premier compte

### 5.1 S'inscrire comme citoyen
1. Allez sur http://localhost:3000
2. Cliquez sur "Se connecter"
3. Entrez votre email
4. Cliquez sur "Envoyer le lien magique"
5. Ouvrez votre boîte mail et cliquez sur le lien
6. Vous êtes connecté ! 🎉

### 5.2 Promouvoir un utilisateur en admin

Par défaut, tous les nouveaux utilisateurs sont des "citoyens". Pour créer un admin :

1. Allez dans **Supabase > Table Editor > profiles**
2. Trouvez votre utilisateur (par son email dans la table auth.users)
3. Modifiez le champ `role` :
   - `citizen` → `admin`
4. Actualisez l'application
5. Vous avez maintenant accès au back-office sur `/admin`

### 5.3 Créer d'autres agents

Répétez l'opération avec `role = 'agent'` pour créer des agents (sans accès à la page agents et paramètres).

## Étape 6 : Générer les icônes PWA

### 6.1 Créer votre logo
Créez un logo carré de 512x512px au minimum (PNG avec fond transparent de préférence).

### 6.2 Générer les icônes
Utilisez un outil en ligne :
- [PWA Builder](https://www.pwabuilder.com/imageGenerator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

### 6.3 Placer les icônes
Placez les icônes générées dans `/public/icons/` :
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

### 6.4 Favicon
Placez aussi le `favicon.ico` à la racine de `/public/`

## Étape 7 : Personnalisation

### 7.1 Informations de la mairie
Modifiez les fichiers suivants avec les informations de votre commune :
- `/app/page.tsx` : Nom, adresse, téléphone, email
- `/lib/constants.ts` : Délais, messages par défaut

### 7.2 Couleurs
Modifiez le thème dans `/app/globals.css` si vous voulez changer la couleur principale.

### 7.3 SEO
Modifiez `/app/layout.tsx` pour personnaliser :
- Title
- Description
- Open Graph tags

## Étape 8 : Tester l'application

### 8.1 Tester le parcours citoyen
1. Créez un compte
2. Créez une demande d'acte de naissance
3. Vérifiez qu'elle apparaît dans le tableau de bord

### 8.2 Tester le back-office
1. Connectez-vous avec votre compte admin
2. Allez sur `/admin`
3. Trouvez la demande créée
4. Changez son statut
5. Retournez sur `/app` avec votre compte citoyen
6. Vérifiez que le statut a changé et que la timeline est à jour

### 8.3 Tester le PWA
1. Ouvrez l'app sur un téléphone (via le réseau local)
2. Vous devriez voir une popup "Installer l'app"
3. Installez-la et testez

## Étape 9 : Déploiement en production

### 9.1 Préparer le déploiement
```bash
npm run build
```

Vérifiez qu'il n'y a pas d'erreurs.

### 9.2 Déployer sur Vercel

1. Pushez votre code sur GitHub
2. Allez sur [vercel.com](https://vercel.com)
3. Créez un compte et importez votre projet GitHub
4. Ajoutez les variables d'environnement (les 3 clés Supabase)
5. Déployez !

### 9.3 Configurer le domaine

1. Dans Vercel, allez dans **Settings > Domains**
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions
4. Mettez à jour les URLs autorisées dans Supabase

### 9.4 Configurer les notifications email (optionnel)

Pour les emails de notification (pas le magic link qui est géré par Supabase) :
1. Intégrez un service comme Resend, SendGrid ou AWS SES
2. Configurez des webhooks Supabase pour envoyer des emails sur changement de statut

## Dépannage

### Problème : Erreur "Invalid API key"
→ Vérifiez que les clés dans `.env.local` sont correctes et que le fichier est à la racine

### Problème : "User not authenticated" 
→ Vérifiez que les URLs de redirection sont configurées dans Supabase

### Problème : Pas d'accès aux données
→ Vérifiez que les politiques RLS sont bien créées (relancez le script SQL)

### Problème : Le service worker ne s'enregistre pas
→ Vérifiez que vous êtes en HTTPS en production (ou localhost en dev)

### Problème : Les icônes PWA ne s'affichent pas
→ Vérifiez que les fichiers PNG sont bien dans `/public/icons/` avec les bons noms

## Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Guide Supabase Auth](https://supabase.com/docs/guides/auth)
- [Guide PWA](https://web.dev/progressive-web-apps/)

## Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de la console du navigateur (F12)
2. Vérifiez les logs Supabase (onglet Logs)
3. Vérifiez que toutes les étapes ont été suivies

Bon déploiement ! 🚀

