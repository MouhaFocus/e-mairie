# Créer des utilisateurs de test

Après avoir réinitialisé la base de données, suivez ces étapes pour créer des utilisateurs de test avec différents rôles.

## Option 1 : Via l'interface web (Recommandé)

1. **Démarrez votre serveur** : `npm run dev`

2. **Créez 3 comptes** via `/auth/login` (onglet Inscription) :
   - `admin@test.com` / `password123`
   - `agent@test.com` / `password123`
   - `citizen@test.com` / `password123`

3. **Mettez à jour les rôles** via Supabase Studio :
   ```
   http://localhost:54323
   ```
   
   - Allez dans **Table Editor** → **profiles**
   - Pour `admin@test.com` : changez `role` en `admin`
   - Pour `agent@test.com` : changez `role` en `agent`
   - Pour `citizen@test.com` : laissez `citizen` (par défaut)

## Option 2 : Via SQL (Plus rapide)

1. **Créez d'abord les utilisateurs Auth** dans Supabase Studio :
   - http://localhost:54323
   - Allez dans **Authentication** → **Users** → **Add user**
   - Créez 3 utilisateurs avec les emails ci-dessus

2. **Exécutez ce SQL** dans l'éditeur SQL de Supabase Studio :

```sql
-- Créer les profils avec les bons rôles
-- Note: Remplacez les emails par les vrais IDs si nécessaire

-- Admin
UPDATE public.profiles 
SET role = 'admin', full_name = 'Admin Test'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@test.com');

-- Agent
UPDATE public.profiles 
SET role = 'agent', full_name = 'Agent Test'
WHERE id = (SELECT id FROM auth.users WHERE email = 'agent@test.com');

-- Citizen (déjà par défaut, mais on peut mettre à jour le nom)
UPDATE public.profiles 
SET full_name = 'Citizen Test'
WHERE id = (SELECT id FROM auth.users WHERE email = 'citizen@test.com');
```

## Vérification

Connectez-vous avec chaque compte et vérifiez la redirection :
- ✅ `admin@test.com` → `/admin`
- ✅ `agent@test.com` → `/admin`
- ✅ `citizen@test.com` → `/app`

## Logs attendus

Après connexion, vous devriez voir dans votre terminal :
```
👤 Middleware - User: [user-id]
📋 Profile data: { role: 'admin' }
❌ Profile error: null
🎭 Role: admin
🔗 Path: /admin
✅ Access authorized
```

