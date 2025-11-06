# ✅ Vérification de l'authentification

## Étape 1 : Vérifier si votre compte existe

### Dans Supabase Studio (http://localhost:54323)

1. Allez dans **Authentication** (icône 👤 dans la sidebar)
2. Cliquez sur **Users**
3. Vous devriez voir votre utilisateur avec votre email ✅

Si vous ne le voyez pas, le magic link n'a pas fonctionné correctement.

## Étape 2 : Vérifier la table profiles

1. Allez dans **Table Editor**
2. Cliquez sur la table **profiles**
3. Vous devriez voir votre ligne avec :
   - `id` : UUID
   - `full_name` : Votre nom
   - `role` : `citizen` (par défaut)

## Étape 3 : Promouvoir en admin

Dans **Table Editor > profiles** :
1. Double-cliquez sur la cellule `role` de votre ligne
2. Changez `citizen` → `admin`
3. Appuyez sur Entrée

**OU** via SQL Editor :
```sql
-- Voir tous les utilisateurs
SELECT u.email, p.role 
FROM auth.users u 
LEFT JOIN profiles p ON p.id = u.id;

-- Promouvoir en admin (remplacez l'email)
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'votre-email@test.com'
);

-- Vérifier
SELECT u.email, p.role 
FROM auth.users u 
JOIN profiles p ON p.id = u.id;
```

## Étape 4 : Redémarrer l'application

Arrêtez et relancez :
```bash
# Ctrl+C pour arrêter
npm run dev
```

## Étape 5 : Se reconnecter

1. Allez sur **http://localhost:3000/auth/login**
2. Entrez le même email
3. Allez sur **http://localhost:54324** (Inbucket)
4. Cliquez sur le nouveau magic link
5. Vous devriez être redirigé vers **/app**

## Étape 6 : Accéder au back-office

Une fois connecté, allez directement sur :
**http://localhost:3000/admin**

Vous devriez voir le dashboard admin ! 🎉

---

## 🔧 Si ça ne fonctionne toujours pas

### Vider le cache du navigateur
1. Ouvrez les DevTools (F12)
2. Clic droit sur le bouton de rafraîchissement
3. Choisissez "Empty Cache and Hard Reload"

### Vérifier les cookies
Dans DevTools > Application > Cookies :
- Vous devriez avoir des cookies `sb-*` pour localhost

### Forcer une reconnexion
1. Allez sur http://localhost:3000
2. Ouvrez la console (F12)
3. Tapez : `localStorage.clear()`
4. Rafraîchissez la page
5. Reconnectez-vous

### Vérifier les logs Supabase
```bash
supabase logs
```

Regardez s'il y a des erreurs.

---

## 🎯 Test simple : Êtes-vous connecté ?

Allez sur **http://localhost:3000/app**

- ✅ Si vous voyez "Mes demandes" → Vous êtes connecté !
- ❌ Si vous êtes redirigé vers /auth/login → Pas connecté

Si vous êtes connecté mais ne pouvez pas accéder à /admin :
→ Votre rôle n'est pas "admin", vérifiez l'étape 3.

