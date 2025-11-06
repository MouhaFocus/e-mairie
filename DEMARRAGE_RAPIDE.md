# 🚀 Démarrage Rapide - Mairie e-Actes

## 1️⃣ Démarrer Docker Desktop
Ouvrez Docker Desktop et attendez qu'il démarre complètement.

## 2️⃣ Démarrer Supabase Local
```bash
cd /Users/mouhamadougueye/mairie-e-actes
supabase start
```

Attendez 2-3 minutes la première fois (téléchargement).

## 3️⃣ Appliquer le schéma de base de données

Ouvrez Supabase Studio en local :
**http://localhost:54323**

Allez dans **SQL Editor** et exécutez le contenu de `supabase/schema.sql`

Ou utilisez le script automatique (si migrations configurées) :
```bash
supabase db reset
```

## 4️⃣ Démarrer l'application
```bash
npm run dev
```

L'app est sur **http://localhost:3000** 🎉

## 5️⃣ Créer votre compte
1. Allez sur http://localhost:3000
2. Cliquez sur **"Se connecter"**
3. Entrez votre email
4. Allez sur **http://localhost:54324** (Inbucket - boîte mail locale)
5. Ouvrez l'email et cliquez sur le lien magique

## 6️⃣ Devenir Admin

Ouvrez **http://localhost:54323** (Supabase Studio)

Allez dans **Table Editor** > **profiles**, trouvez votre ligne et changez :
- `role` : `citizen` → `admin`

Ou exécutez dans SQL Editor :
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'votre-email@test.com');
```

## 7️⃣ Accéder au Back-Office

Allez sur **http://localhost:3000/admin**

Vous êtes admin ! 🎉

---

## 📍 URLs Utiles

- **Application** : http://localhost:3000
- **Supabase Studio** : http://localhost:54323 (gérer la DB)
- **Emails locaux** : http://localhost:54324 (voir les magic links)
- **API Supabase** : http://localhost:54321

---

## 🛠 Commandes Utiles

```bash
# Démarrer Supabase
supabase start

# Arrêter Supabase
supabase stop

# Voir le statut
supabase status

# Voir les logs
supabase logs

# Réinitialiser la DB
supabase db reset
```

---

## ✅ Test Rapide

### Créer une demande (Citoyen)
1. http://localhost:3000/app
2. "Nouvelle demande" → Acte de naissance
3. Remplissez et soumettez

### Traiter la demande (Admin)
1. http://localhost:3000/admin/requests
2. Cliquez sur la demande
3. Changez le statut → "En cours d'examen"
4. Ajoutez un commentaire
5. Changez vers "Prêt à retirer"

### Vérifier côté citoyen
1. Retour sur http://localhost:3000/app
2. La demande est mise à jour avec timeline ! ✅

---

## 🎯 Vous êtes prêt !

Toutes les fonctionnalités sont opérationnelles :
- ✅ Authentification magic link
- ✅ Création de demandes
- ✅ Back-office admin
- ✅ Gestion des statuts
- ✅ Timeline et historique
- ✅ Filtres et recherche
- ✅ Rôles (citizen, agent, admin)
- ✅ PWA (manifest + service worker)

Pour déployer en production, consultez `README.md` !

