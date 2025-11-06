# Guide de test - Backoffice Admin

Ce guide vous permet de tester complètement le système de login et de gestion des rôles avec les pages séparées.

## 📋 Architecture

- **Page de login citoyens** : `/auth/login` (avec inscription publique)
  - Déconnexion → redirige vers `/` (homepage)
- **Page de login admin/agents** : `/admin-login` (sans inscription, accès réservé)
  - Déconnexion → redirige vers `/admin-login`
- **Dashboard citoyens** : `/app`
- **Backoffice admin** : `/admin`

## 🚀 Étapes de test

### 1. Créer le premier administrateur

Puisque la base de données a été réinitialisée, vous devez d'abord créer un compte admin :

#### Option A : Via l'interface de login citoyen puis modifier dans Supabase

1. Allez sur `http://localhost:3000/auth/login`
2. Créez un compte avec :
   - Email : `admin@mairie.fr`
   - Mot de passe : `admin123`
   - Nom : `Administrateur Principal`

3. Ouvrez Supabase Studio : `http://localhost:54323`
4. Allez dans **Table Editor** → **profiles**
5. Trouvez le profil de `admin@mairie.fr`
6. Changez le `role` de `citizen` à `admin`
7. **Déconnectez-vous** de l'application

#### Option B : Via SQL dans Supabase (plus rapide)

1. Créez d'abord le compte via `/auth/login` (inscription)
2. Dans Supabase Studio (`http://localhost:54323`), ouvrez le **SQL Editor**
3. Exécutez :

```sql
-- Mettre à jour le rôle du premier admin
UPDATE public.profiles 
SET role = 'admin', full_name = 'Administrateur Principal'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@mairie.fr');
```

### 2. Tester la connexion Admin

1. Allez sur `http://localhost:3000/admin-login`
2. Connectez-vous avec `admin@mairie.fr` / `admin123`
3. ✅ Vous devriez être redirigé vers `/admin`
4. ✅ Vous devriez voir le dashboard admin

**Logs attendus :**
```
👤 Middleware - User: [user-id]
📋 Profile data: { role: 'admin' }
❌ Profile error: null
🎭 Role: admin
🔗 Path: /admin
✅ Access authorized
```

### 3. Créer un agent depuis l'interface

1. Dans le backoffice admin, allez sur **Agents** (menu de gauche)
2. Cliquez sur **Créer un agent**
3. Remplissez le formulaire :
   - Nom : `Agent Test`
   - Email : `agent@mairie.fr`
   - Mot de passe : `agent123`
   - Téléphone : `01 23 45 67 89`
   - Rôle : **Agent**
4. Cliquez sur **Créer**
5. ✅ Un message de succès devrait apparaître
6. ✅ L'agent devrait apparaître dans la liste

### 4. Tester la connexion Agent

1. **Déconnectez-vous** de l'admin
2. Allez sur `http://localhost:3000/admin-login`
3. Connectez-vous avec `agent@mairie.fr` / `agent123`
4. ✅ Vous devriez être redirigé vers `/admin`
5. ✅ Vous devriez voir le dashboard admin
6. ⚠️ Vous ne devriez **PAS** voir le bouton "Créer un agent" (réservé aux admins)

### 5. Créer un citoyen

1. Allez sur `http://localhost:3000/auth/login`
2. Créez un compte avec :
   - Email : `citoyen@test.fr`
   - Mot de passe : `citoyen123`
   - Nom : `Citoyen Test`

### 6. Tester la connexion Citoyen

1. Connectez-vous avec `citoyen@test.fr` / `citoyen123`
2. ✅ Vous devriez être redirigé vers `/app` (espace citoyen)
3. ✅ Vous devriez voir le dashboard citoyen

### 7. Tester les restrictions d'accès

#### Test A : Citoyen essaie d'accéder au backoffice

1. Connecté en tant que citoyen, allez manuellement sur `http://localhost:3000/admin`
2. ✅ Vous devriez être **redirigé automatiquement vers `/app`**

**Logs attendus :**
```
👤 Middleware - User: [user-id]
🎭 Role: citizen
🔗 Path: /admin
🔀 Citizen accessing /admin - redirecting to /app
```

#### Test B : Admin essaie d'accéder à l'espace citoyen

1. Connecté en tant qu'admin, allez sur `http://localhost:3000/app`
2. ✅ Vous devriez être **redirigé automatiquement vers `/admin`**

**Logs attendus :**
```
👤 Middleware - User: [user-id]
🎭 Role: admin
🔗 Path: /app
🔀 Admin/Agent accessing /app - redirecting to /admin
```

#### Test C : Non connecté essaie d'accéder au backoffice

1. **Déconnectez-vous** complètement
2. Allez sur `http://localhost:3000/admin`
3. ✅ Vous devriez être **redirigé vers `/admin-login`**

#### Test D : Non connecté essaie d'accéder à l'espace citoyen

1. **Déconnectez-vous** complètement
2. Allez sur `http://localhost:3000/app`
3. ✅ Vous devriez être **redirigé vers `/auth/login`**

### 8. Tester les redirections après login

#### Test A : Login admin avec paramètre redirect

1. **Déconnectez-vous**
2. Allez sur `http://localhost:3000/admin/agents`
3. ✅ Vous êtes redirigé vers `/admin-login?redirect=/admin/agents`
4. Connectez-vous en tant qu'admin
5. ✅ Vous devriez être redirigé vers `/admin/agents` (la page demandée)

#### Test B : Utilisateur déjà connecté accède à la page de login

1. Connecté en tant qu'admin, allez sur `http://localhost:3000/admin-login`
2. ✅ Vous devriez être redirigé vers `/admin`

## ✅ Récapitulatif des tests

| Test | Description | Résultat attendu |
|------|-------------|-----------------|
| 1 | Admin se connecte sur `/admin-login` | Redirigé vers `/admin` |
| 2 | Agent se connecte sur `/admin-login` | Redirigé vers `/admin` |
| 3 | Citoyen se connecte sur `/auth/login` | Redirigé vers `/app` |
| 4 | Citoyen essaie d'accéder `/admin` | Redirigé vers `/app` |
| 5 | Admin essaie d'accéder `/app` | Redirigé vers `/admin` |
| 6 | Non connecté accède `/admin` | Redirigé vers `/admin-login` |
| 7 | Non connecté accède `/app` | Redirigé vers `/auth/login` |
| 8 | Admin déjà connecté accède `/admin-login` | Redirigé vers `/admin` |
| 9 | Admin crée un agent depuis l'interface | Agent créé et visible dans la liste |
| 10 | Agent ne voit pas le bouton "Créer agent" | Bouton masqué (réservé admin) |

## 🐛 En cas de problème

### Problème : "infinite recursion in policy"

Si vous voyez cette erreur, la migration n'a pas été appliquée :

```bash
cd /Users/mouhamadougueye/mairie-e-actes
npx supabase db reset
```

### Problème : "Role: undefined" dans les logs

Le profil n'existe pas. Créez-le via `/auth/login` puis modifiez le rôle dans Supabase.

### Problème : Toujours redirigé vers `/app`

1. Vérifiez que le rôle dans la table `profiles` est bien `admin` ou `agent`
2. Videz le cache du navigateur
3. Déconnectez-vous complètement et reconnectez-vous

## 📊 Tableau des comptes de test

| Email | Mot de passe | Rôle | Accès |
|-------|--------------|------|-------|
| `admin@mairie.fr` | `admin123` | admin | `/admin` (backoffice complet) |
| `agent@mairie.fr` | `agent123` | agent | `/admin` (backoffice lecture seule) |
| `citoyen@test.fr` | `citoyen123` | citizen | `/app` (espace citoyen) |

## 🎉 Félicitations !

Si tous les tests passent, votre système de login et de gestion des rôles fonctionne parfaitement !

