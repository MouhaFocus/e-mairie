# 🔍 Debug - Accès Admin

## Votre situation
- ✅ Email `admin@test.com` a le rôle `admin` dans Supabase
- ❌ Vous voyez la page citoyen au lieu de l'admin

## Solutions à tester (dans l'ordre)

### Solution 1 : Se déconnecter et reconnecter (LE PLUS IMPORTANT)

La session de connexion garde en cache l'ancien rôle. Il FAUT se reconnecter :

1. Sur l'application, **déconnectez-vous** complètement
   - Cliquez sur votre profil (coin supérieur droit)
   - Cliquez sur **"Déconnexion"**
2. Allez sur **http://localhost:3000/auth/login**
3. **Reconnectez-vous** avec `admin@test.com` / `password123`
4. Allez directement sur **http://localhost:3000/admin**

Si vous voyez le Dashboard Admin → ✅ C'est résolu !

---

### Solution 2 : Vérifier dans le navigateur

Ouvrez les **DevTools** (F12) :

#### A. Vérifier les cookies
1. Onglet **Application** (ou Storage)
2. Cookies > http://localhost:3000
3. Cherchez les cookies `sb-*`
4. **Supprimez-les tous**
5. Reconnectez-vous

#### B. Vérifier la console
1. Onglet **Console**
2. Regardez s'il y a des erreurs en rouge
3. Partagez-les si vous en voyez

---

### Solution 3 : Test de diagnostic

Créez une page de test pour voir ce qui est récupéré :

Allez sur **http://localhost:3000/app/profile** et regardez vos infos.

Si le rôle affiché est "citizen" alors que c'est "admin" dans Supabase :
→ C'est un problème de cache de session

---

### Solution 4 : Forcer le rechargement de la session

Dans la console du navigateur (F12), exécutez :

```javascript
// Voir le user actuel
const { data: { user } } = await (await fetch('/api/auth/user')).json()
console.log(user)

// Vider tout le localStorage
localStorage.clear()

// Recharger la page
window.location.reload()
```

---

### Solution 5 : Tester avec une URL directe

Sans passer par l'application, allez **directement** sur :

**http://localhost:3000/admin/requests**

Que se passe-t-il ?
- A) Vous voyez la liste des demandes → Vous êtes admin ! ✅
- B) Vous êtes redirigé vers `/auth/login` → Problème d'auth
- C) Vous voyez "Unauthorized" → Problème de rôle

---

### Solution 6 : Vérifier la requête SQL

Dans Supabase Studio > SQL Editor :

```sql
-- Voir TOUS les utilisateurs et leurs rôles
SELECT 
  u.id,
  u.email,
  u.created_at as user_created,
  p.id as profile_id,
  p.role,
  p.full_name,
  p.created_at as profile_created
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC;
```

Vérifiez :
- ✅ Votre email apparaît dans `auth.users`
- ✅ L'id du user correspond à l'id du profile
- ✅ Le role est bien `admin`
- ✅ profile_id n'est pas NULL

Si profile_id est NULL → Le profil n'existe pas, créez-le :

```sql
-- Créer le profil manuellement
INSERT INTO profiles (id, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@test.com'),
  'Admin Test',
  'admin'
)
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';
```

---

### Solution 7 : Redémarrer l'application Next.js

Parfois le cache de Next.js pose problème :

```bash
# Dans le terminal où tourne npm run dev
# Appuyez sur Ctrl+C pour arrêter

# Puis relancez
npm run dev
```

Ensuite reconnectez-vous.

---

### Solution 8 : Vérifier les logs du serveur

Dans le terminal où `npm run dev` tourne, regardez les logs.

Si vous voyez des erreurs comme :
- `Error: Unauthorized`
- `Error: Forbidden`
- `PostgrestError`

Partagez-les !

---

## 🎯 Ce qui DEVRAIT se passer

Quand vous allez sur **http://localhost:3000/admin** :

1. Le middleware vérifie que vous êtes connecté
2. Le layout admin (`app/admin/layout.tsx`) appelle `requireRole(['agent', 'admin'])`
3. Cette fonction récupère votre profil depuis la table `profiles`
4. Elle vérifie que `profile.role` est `'agent'` ou `'admin'`
5. Si oui → Affiche le dashboard
6. Si non → Redirige vers `/auth/login` ou affiche "Forbidden"

---

## 🔧 Script de diagnostic complet

Exécutez ceci dans Supabase Studio > SQL Editor :

```sql
-- 1. Voir votre utilisateur
SELECT 'USER' as type, id, email, created_at 
FROM auth.users 
WHERE email = 'admin@test.com';

-- 2. Voir votre profil
SELECT 'PROFILE' as type, id, full_name, role, created_at 
FROM profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@test.com');

-- 3. Vérifier la jointure
SELECT 
  'JOINED' as type,
  u.email,
  p.role,
  p.full_name,
  u.id = p.id as "ids_match"
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'admin@test.com';

-- 4. Forcer le rôle admin (au cas où)
UPDATE profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@test.com')
RETURNING id, role, full_name;
```

Résultats attendus :
- USER : Doit montrer votre utilisateur
- PROFILE : Doit montrer role = 'admin'
- JOINED : Doit montrer ids_match = true
- UPDATE : Doit retourner 1 ligne avec role = 'admin'

---

## ⚡ Solution rapide (99% des cas)

La plupart du temps, c'est juste qu'il faut **se déconnecter et reconnecter** :

1. **Déconnexion** complète de l'app
2. **Connexion** avec admin@test.com
3. Aller sur **http://localhost:3000/admin**

✅ Ça devrait marcher !

---

Testez la **Solution 1** en premier et dites-moi le résultat ! 🚀

