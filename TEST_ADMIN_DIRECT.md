# 🔧 Test Direct - Accès Admin

## Le problème
Vous êtes toujours redirigé vers `/app` même avec le rôle admin.

## Solutions à tester maintenant

### Solution 1 : Vider complètement le cache et se reconnecter

1. **Dans votre navigateur**, ouvrez DevTools (F12)
2. **Application** > **Storage** > **Clear site data** (ou "Effacer les données du site")
3. Ou plus simple : **Ouvrez un onglet en navigation privée** (Ctrl+Shift+N)

4. Dans la navigation privée :
   - Allez sur http://localhost:3000/auth/login
   - Connexion avec `admin@test.com` / `password123`
   - Observez où vous êtes redirigé

### Solution 2 : Aller DIRECTEMENT sur /admin (contourner la redirection)

Au lieu d'attendre la redirection automatique, allez **manuellement** sur :

**http://localhost:3000/admin**

Si vous voyez le dashboard admin → Le problème est juste la redirection après login
Si vous êtes redirigé vers /auth/login → Problème d'authentification
Si vous voyez /app → Problème de vérification du rôle

### Solution 3 : Tester avec la console

1. Allez sur http://localhost:3000/auth/login
2. Ouvrez la console (F12)
3. Avant de cliquer sur "Se connecter", collez ce code :

```javascript
// Intercepter la redirection pour voir le rôle
console.log('Prêt à intercepter la connexion');
```

4. Connectez-vous et regardez les logs dans la console

### Solution 4 : Vérifier que le serveur a bien redémarré

Dans le terminal où tourne `npm run dev`, vérifiez qu'il n'y a pas d'erreur.

Si vous voyez des erreurs TypeScript ou de compilation, partagez-les.

## Test ultime : URL directe

**Testez immédiatement cette URL dans un nouvel onglet :**

http://localhost:3000/admin

Dites-moi ce qui se passe :
- A) Vous voyez le Dashboard Admin → ✅ Vous êtes admin, c'est juste la redirection qui ne marche pas
- B) Vous êtes redirigé vers /auth/login → ❌ Session perdue
- C) Vous voyez "Forbidden" ou "Unauthorized" → ❌ Problème de rôle

---

## Diagnostic SQL

Dans Supabase Studio > SQL Editor, exécutez :

```sql
-- Voir votre session actuelle
SELECT 
  u.id,
  u.email,
  p.role,
  p.full_name
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE u.email = 'admin@test.com';
```

Vérifiez que le rôle est bien `admin`.

---

## Solution de contournement temporaire

En attendant que la redirection automatique fonctionne, vous pouvez :

1. Vous connecter (vous arrivez sur /app)
2. **Taper manuellement dans la barre d'adresse** : `http://localhost:3000/admin`
3. Appuyer sur Entrée
4. Vous devriez voir le back-office admin ✅

C'est un contournement, mais au moins vous pourrez tester !

---

Essayez ces solutions et dites-moi ce qui se passe avec **http://localhost:3000/admin** !

