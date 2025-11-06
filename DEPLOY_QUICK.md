# 🚀 Guide de Déploiement Rapide

Guide condensé pour déployer rapidement sur Vercel + Supabase.

## 📋 Checklist rapide

### 1. Supabase (5 minutes)

**Option A : Avec Supabase CLI (Recommandé)** ⭐

```bash
1. Créer projet sur https://supabase.com
2. Récupérer: Project URL, anon key, service_role key, Project REF
3. supabase login
4. supabase link --project-ref PROJECT_REF
5. supabase db push
6. Authentication → Créer admin → Mettre role='admin' en SQL
```

**Option B : Manuellement**

```bash
1. Créer projet sur https://supabase.com
2. Récupérer: Project URL, anon key, service_role key
3. SQL Editor → Exécuter supabase/production-setup.sql
4. Authentication → Créer admin → Mettre role='admin' en SQL
```

📖 **Guide complet CLI** : [DEPLOY_SUPABASE_CLI.md](./DEPLOY_SUPABASE_CLI.md)

### 2. GitHub (2 minutes)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/mairie-e-actes.git
git push -u origin main
```

### 3. Vercel (3 minutes)

```bash
1. Importer repo GitHub sur https://vercel.com
2. Ajouter variables d'environnement:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXT_PUBLIC_SITE_URL
3. Deploy
```

### 4. Configuration Supabase (2 minutes)

```bash
1. Authentication → URL Configuration
2. Redirect URLs:
   - https://votre-domaine.vercel.app/auth/callback
   - https://votre-domaine.vercel.app/app
   - https://votre-domaine.vercel.app/admin-login
3. Site URL: https://votre-domaine.vercel.app
```

## ✅ Variables d'environnement Vercel

| Variable | Où trouver |
|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key |
| `NEXT_PUBLIC_SITE_URL` | Votre URL Vercel (ex: https://xxx.vercel.app) |

## 🧪 Test rapide

1. ✅ `/admin-login` → Connexion admin
2. ✅ `/auth/login` → Création compte citoyen
3. ✅ Admin crée agent depuis `/admin/agents`

## 📖 Pour plus de détails

Voir `DEPLOYMENT.md` pour le guide complet.

