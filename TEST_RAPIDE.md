# 🚀 Test Rapide - Connexion Email/Password

## Étape 1 : Redémarrer l'app

```bash
# Arrêter l'app (Ctrl+C)
# Puis relancer
npm run dev
```

## Étape 2 : Créer un compte test

1. Allez sur **http://localhost:3000/auth/login**
2. Cliquez sur l'onglet **"Inscription"**
3. Remplissez :
   - Nom : Admin Test
   - Email : `admin@test.com`
   - Mot de passe : `password123`
4. Cliquez sur **"Créer un compte"**
5. Vous serez automatiquement redirigé vers **/app** ✅

## Étape 3 : Promouvoir en admin

Dans Supabase Studio (**http://localhost:54323**) > **SQL Editor** :

```sql
-- Promouvoir admin@test.com en admin
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'admin@test.com'
);
```

Cliquez sur **Run**.

## Étape 4 : Se reconnecter

1. Déconnectez-vous de l'app ou rafraîchissez simplement
2. Allez sur **http://localhost:3000/admin**
3. **Vous êtes dans le back-office ! 🎉**

---

## 🎯 Comptes de test rapides

### Compte Admin
```
Email: admin@test.com
Password: password123
Role: admin (à promouvoir dans Supabase)
```

### Compte Citoyen
```
Email: citoyen@test.com
Password: password123
Role: citizen (par défaut)
```

### Compte Agent
```
Email: agent@test.com
Password: password123
Role: agent (à configurer dans Supabase)
```

---

## 📍 Workflow complet de test

### 1. Créer les 3 comptes

Via **http://localhost:3000/auth/login** > Inscription :
- admin@test.com / password123
- agent@test.com / password123
- citoyen@test.com / password123

### 2. Configurer les rôles

Dans Supabase Studio SQL Editor :

```sql
-- Promouvoir admin
UPDATE profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@test.com');

-- Promouvoir agent
UPDATE profiles 
SET role = 'agent' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'agent@test.com');

-- Vérifier
SELECT u.email, p.full_name, p.role 
FROM auth.users u 
JOIN profiles p ON p.id = u.id 
ORDER BY p.role DESC;
```

### 3. Tester le workflow

#### En tant que CITOYEN (citoyen@test.com)
1. Connexion sur http://localhost:3000/auth/login
2. Aller sur http://localhost:3000/app/requests/new
3. Créer une demande d'acte de naissance
4. Voir la demande sur /app avec statut "En attente"

#### En tant qu'AGENT (agent@test.com)
1. Se déconnecter et reconnecter avec agent@test.com
2. Aller sur http://localhost:3000/admin
3. Voir la demande dans la liste
4. Cliquer dessus et changer le statut → "En cours d'examen"
5. Ajouter un commentaire
6. ✅ Peut gérer les demandes
7. ❌ Ne peut PAS accéder à /admin/agents ni /admin/settings

#### En tant qu'ADMIN (admin@test.com)
1. Se déconnecter et reconnecter avec admin@test.com
2. Accès complet à tout le back-office
3. Changer le statut → "Prêt à retirer"
4. ✅ Peut accéder à /admin/agents
5. ✅ Peut accéder à /admin/settings

#### Revenir en CITOYEN
1. Se reconnecter avec citoyen@test.com
2. Voir la demande mise à jour
3. Voir la timeline complète avec tous les changements ✅

---

## ⚡ Raccourcis

### Se connecter rapidement
Allez sur http://localhost:3000/auth/login et utilisez :
- Email: `admin@test.com`
- Password: `password123`

### Promouvoir n'importe quel email en admin
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'VOTRE-EMAIL@test.com'
);
```

### Voir tous les utilisateurs
```sql
SELECT 
  u.email,
  u.created_at,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC;
```

### Réinitialiser un mot de passe (en local)
Via Supabase Studio > Authentication > Users :
- Cliquez sur l'utilisateur
- Cliquez sur "Send password recovery"
- Le lien sera dans http://localhost:54324 (Inbucket)

---

## 🎉 C'est prêt !

Plus besoin de magic links ni d'emails !
Connexion instantanée avec email/password pour tous vos tests.

**Dashboard Admin** : http://localhost:3000/admin
**Dashboard Citoyen** : http://localhost:3000/app

