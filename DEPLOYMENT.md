# Guide de Déploiement - Vercel + Supabase Production

Ce guide vous accompagne étape par étape pour déployer votre application sur Vercel avec Supabase en production.

## 📋 Prérequis

- ✅ Compte GitHub
- ✅ Compte Vercel (gratuit)
- ✅ Compte Supabase (gratuit)
- ✅ Application locale fonctionnelle

## 🚀 Étape 1 : Préparer Supabase Production

### 1.1 Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **"New Project"**
3. Remplissez les informations :
   - **Name** : `mairie-e-actes`
   - **Database Password** : Choisissez un mot de passe fort (⚠️ **SAVEZ-LE !**)
   - **Region** : Choisissez la région la plus proche (ex: `West EU (Paris)`)
   - **Pricing Plan** : Free tier (suffisant pour commencer)
4. Cliquez sur **"Create new project"**
5. Attendez 2-3 minutes que le projet soit créé

### 1.2 Récupérer les clés API

1. Dans votre projet Supabase, allez dans **Settings** → **API**
2. Notez ces informations (vous en aurez besoin) :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon/public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (⚠️ **SECRET - Ne jamais exposer au client !**)

### 1.3 Appliquer le schéma de base de données

**Option A : Avec Supabase CLI (Recommandé)** ⭐

Voir le guide détaillé : **[DEPLOY_SUPABASE_CLI.md](./DEPLOY_SUPABASE_CLI.md)**

```bash
# 1. Se connecter à Supabase
supabase login

# 2. Lier votre projet
supabase link --project-ref PROJECT_REF

# 3. Pousser les migrations
supabase db push
```

**Option B : Manuellement avec SQL Editor**

1. Allez dans **SQL Editor** dans Supabase
2. Copiez le contenu de `supabase/production-setup.sql`
3. Collez-le dans l'éditeur SQL
4. Cliquez sur **"Run"** pour exécuter le script
5. Vérifiez que toutes les tables ont été créées :
   - `profiles`
   - `requests`
   - `request_events`

### 1.4 Vérifier les migrations

Si vous utilisez Supabase CLI :
```bash
supabase migration list
```

Sinon, vérifiez manuellement que la fonction `auth.user_role()` existe :
```sql
SELECT auth.user_role();
```

### 1.5 Configurer les policies RLS

Les policies sont déjà incluses dans le schéma, mais vérifiez qu'elles sont actives :
1. Allez dans **Authentication** → **Policies**
2. Vérifiez que RLS est activé sur toutes les tables

### 1.6 Créer le premier administrateur

1. Allez dans **Authentication** → **Users** → **Add User**
2. Créez un utilisateur avec :
   - **Email** : `admin@votre-mairie.fr`
   - **Password** : Choisissez un mot de passe fort
   - **Auto Confirm User** : ✅ Activé

3. Dans **SQL Editor**, exécutez :
   ```sql
   -- Mettre à jour le rôle en admin
   UPDATE public.profiles 
   SET role = 'admin', full_name = 'Administrateur Principal'
   WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@votre-mairie.fr');
   ```

## 🚀 Étape 2 : Préparer le déploiement Vercel

### 2.1 Pousser le code sur GitHub

1. Initialisez Git si ce n'est pas déjà fait :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Créez un repository sur GitHub :
   - Allez sur [https://github.com/new](https://github.com/new)
   - Nom : `mairie-e-actes`
   - Visibilité : **Private** (recommandé pour les données sensibles)

3. Poussez votre code :
   ```bash
   git remote add origin https://github.com/VOTRE_USERNAME/mairie-e-actes.git
   git branch -M main
   git push -u origin main
   ```

### 2.2 Créer un fichier .env.example

Créons un fichier pour documenter les variables d'environnement nécessaires :

```bash
# .env.example
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://votre-domaine.vercel.app
```

### 2.3 Vérifier les fichiers de configuration

Vérifiez que ces fichiers existent et sont corrects :

- ✅ `next.config.ts` - Configuration Next.js
- ✅ `package.json` - Dépendances
- ✅ `.gitignore` - Pour ne pas commit les fichiers sensibles

## 🚀 Étape 3 : Déployer sur Vercel

### 3.1 Importer le projet

1. Allez sur [https://vercel.com](https://vercel.com)
2. Cliquez sur **"Add New"** → **"Project"**
3. Importez votre repository GitHub
4. Vercel détectera automatiquement que c'est un projet Next.js

### 3.2 Configurer les variables d'environnement

Dans la section **"Environment Variables"**, ajoutez :

| Variable | Valeur | Exemple |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Votre Project URL Supabase | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Votre anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Votre service_role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_SITE_URL` | Votre URL Vercel | `https://mairie-e-actes.vercel.app` |

⚠️ **Important** :
- `NEXT_PUBLIC_*` : Accessibles côté client (browser)
- `SUPABASE_SERVICE_ROLE_KEY` : **NE JAMAIS** exposer au client (côté serveur uniquement)

### 3.3 Configurer les settings du projet

1. **Framework Preset** : Next.js (déjà détecté)
2. **Build Command** : `npm run build` (par défaut)
3. **Output Directory** : `.next` (par défaut)
4. **Install Command** : `npm install` (par défaut)
5. **Root Directory** : `./` (par défaut)

### 3.4 Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes que le build se termine
3. Vercel vous donnera une URL : `https://votre-projet.vercel.app`

### 3.5 Configurer le domaine personnalisé (optionnel)

1. Dans **Settings** → **Domains**
2. Ajoutez votre domaine personnalisé
3. Suivez les instructions pour configurer les DNS

## 🚀 Étape 4 : Configurer Supabase pour la production

### 4.1 Mettre à jour les URLs de redirection

1. Dans Supabase, allez dans **Authentication** → **URL Configuration**
2. Ajoutez ces URLs dans **Redirect URLs** :
   ```
   https://votre-domaine.vercel.app/auth/callback
   https://votre-domaine.vercel.app/app
   https://votre-domaine.vercel.app/admin-login
   ```

3. Dans **Site URL**, mettez :
   ```
   https://votre-domaine.vercel.app
   ```

### 4.2 Configurer les emails (optionnel)

1. Dans **Authentication** → **Email Templates**
2. Personnalisez les templates d'email si nécessaire
3. Configurez un SMTP personnalisé pour les emails transactionnels (optionnel)

### 4.3 Configurer le storage (si nécessaire)

1. Allez dans **Storage**
2. Créez un bucket `request-attachments` si vous utilisez les pièces jointes
3. Configurez les policies de storage

## 🧪 Étape 5 : Tester le déploiement

### 5.1 Test de connexion admin

1. Allez sur `https://votre-domaine.vercel.app/admin-login`
2. Connectez-vous avec votre compte admin
3. ✅ Vérifiez que vous êtes redirigé vers `/admin`

### 5.2 Test de connexion citoyen

1. Allez sur `https://votre-domaine.vercel.app/auth/login`
2. Créez un compte de test
3. ✅ Vérifiez que vous êtes redirigé vers `/app`

### 5.3 Test des redirections

- ✅ Citoyen accède `/admin` → redirigé vers `/app`
- ✅ Admin accède `/app` → redirigé vers `/admin`
- ✅ Non connecté accède `/admin` → redirigé vers `/admin-login`
- ✅ Non connecté accède `/app` → redirigé vers `/auth/login`

### 5.4 Test de création d'agent

1. Connectez-vous en tant qu'admin
2. Allez dans **Agents** → **Créer un agent**
3. ✅ Créez un agent de test
4. ✅ Vérifiez qu'il apparaît dans la liste

## 🔒 Étape 6 : Sécurité et bonnes pratiques

### 6.1 Vérifier les variables d'environnement

Assurez-vous que :
- ✅ `SUPABASE_SERVICE_ROLE_KEY` n'est **PAS** dans les variables `NEXT_PUBLIC_*`
- ✅ Les clés API sont bien sécurisées dans Vercel
- ✅ Le fichier `.env.local` n'est **PAS** commité dans Git

### 6.2 Activer les logs de production

1. Dans Vercel, allez dans **Logs** pour voir les erreurs
2. Dans Supabase, allez dans **Logs** pour voir les requêtes

### 6.3 Configurer les backups

1. Dans Supabase, activez les backups automatiques (disponible sur les plans payants)
2. Configurez des backups manuels réguliers

### 6.4 Monitorer les performances

1. Vercel Analytics : Activez dans **Analytics**
2. Supabase Dashboard : Surveillez l'utilisation des ressources

## 🐛 Dépannage

### Problème : "Invalid API key"

**Solution** : Vérifiez que les variables d'environnement sont bien configurées dans Vercel et que vous avez redéployé après les avoir ajoutées.

### Problème : "Infinite recursion in policy"

**Solution** : Vérifiez que la migration `20250103000000_fix_rls_recursion.sql` a bien été appliquée en production.

### Problème : "Redirect URL mismatch"

**Solution** : Vérifiez que toutes les URLs de redirection sont bien configurées dans Supabase Authentication settings.

### Problème : Les utilisateurs ne peuvent pas se connecter

**Solution** :
1. Vérifiez les logs dans Vercel
2. Vérifiez les logs dans Supabase
3. Vérifiez que RLS est bien activé et que les policies sont correctes

## 📊 Checklist de déploiement

- [ ] Projet Supabase créé
- [ ] Schéma de base de données appliqué
- [ ] Migrations appliquées
- [ ] Premier admin créé
- [ ] Code poussé sur GitHub
- [ ] Projet Vercel créé
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] URLs de redirection configurées dans Supabase
- [ ] Tests de connexion réussis
- [ ] Tests de redirection réussis
- [ ] Tests de création d'agent réussis
- [ ] Logs de production vérifiés

## 🎉 Félicitations !

Votre application est maintenant déployée en production ! 🚀

### URLs importantes

- **Application** : `https://votre-domaine.vercel.app`
- **Admin Login** : `https://votre-domaine.vercel.app/admin-login`
- **Supabase Dashboard** : `https://supabase.com/dashboard/project/xxxxx`
- **Vercel Dashboard** : `https://vercel.com/dashboard`

### Prochaines étapes

1. Configurez un domaine personnalisé
2. Activez les backups automatiques
3. Configurez les notifications d'erreurs (Sentry, etc.)
4. Mettez en place un monitoring (Vercel Analytics, Supabase Monitoring)
5. Configurez un système de sauvegarde régulier

---

**Besoin d'aide ?** Consultez la documentation :
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

