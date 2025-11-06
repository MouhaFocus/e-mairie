# Guide : Comment tester le back-office

## Étape 1 : Démarrer l'application

```bash
cd /Users/mouhamadougueye/mairie-e-actes
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

## Étape 2 : Configurer Supabase

### 2.1 Exécuter le schéma SQL
1. Allez sur [supabase.com](https://supabase.com) et connectez-vous
2. Créez un nouveau projet (si ce n'est pas déjà fait)
3. Dans votre projet, allez dans **SQL Editor**
4. Copiez tout le contenu de `supabase/schema.sql`
5. Collez-le dans l'éditeur SQL
6. Cliquez sur **Run** (en bas à droite)

### 2.2 Configurer .env.local
Ouvrez `.env.local` et remplacez par vos vraies credentials Supabase :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...votre-vraie-clé
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...votre-vraie-clé
```

Les clés se trouvent dans **Settings > API** de votre projet Supabase.

## Étape 3 : Créer votre compte

1. Allez sur http://localhost:3000
2. Cliquez sur **"Se connecter"**
3. Entrez votre adresse email
4. Cliquez sur **"Envoyer le lien magique"**
5. Ouvrez votre boîte mail
6. Cliquez sur le lien de connexion
7. Vous êtes maintenant connecté en tant que **citoyen** ✅

## Étape 4 : Promouvoir votre compte en ADMIN

Par défaut, vous êtes un "citizen". Pour accéder au back-office, vous devez devenir "admin" :

### Option A : Via Supabase Dashboard (le plus simple)

1. Allez dans votre projet Supabase
2. Cliquez sur **Table Editor** dans la sidebar
3. Sélectionnez la table **profiles**
4. Trouvez votre ligne (celle avec votre email/id)
5. Double-cliquez sur la cellule **role**
6. Changez `citizen` → `admin`
7. Appuyez sur Entrée pour sauvegarder

### Option B : Via SQL Editor

1. Allez dans **SQL Editor** de Supabase
2. Exécutez cette requête (remplacez l'email) :

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'votre-email@exemple.com'
);
```

3. Vérifiez avec :
```sql
SELECT p.*, u.email 
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.role = 'admin';
```

## Étape 5 : Accéder au back-office

1. Rafraîchissez la page ou reconnectez-vous
2. Allez sur **http://localhost:3000/admin**
3. Vous devriez voir le **Dashboard Admin** ! 🎉

### Pages disponibles :

- **http://localhost:3000/admin** → Dashboard avec statistiques
- **http://localhost:3000/admin/requests** → Liste de toutes les demandes
- **http://localhost:3000/admin/agents** → Liste des agents/admins
- **http://localhost:3000/admin/settings** → Paramètres

## Étape 6 : Tester le workflow complet

### 6.1 Créer une demande (en tant que citoyen)

1. Connectez-vous avec votre compte
2. Allez sur http://localhost:3000/app
3. Cliquez sur **"Nouvelle demande"**
4. Choisissez **Acte de naissance**
5. Remplissez le formulaire :
   - Nom complet : Jean Dupont
   - Nom du père : Pierre Dupont
   - Nom de la mère : Marie Martin
   - Date de naissance : 01/01/1990
   - Lieu de naissance : Paris
   - Nombre de copies : 1
   - Motif : Renouvellement carte d'identité
6. Cliquez sur **"Soumettre la demande"**
7. Vous revenez au dashboard → La demande apparaît avec le statut **"En attente"** (gris)

### 6.2 Traiter la demande (en tant qu'admin)

1. Allez sur http://localhost:3000/admin
2. Vous voyez la demande dans les statistiques (1 demande en attente)
3. Cliquez sur **"Voir tout →"** ou allez sur **/admin/requests**
4. Cliquez sur la demande de Jean Dupont
5. Dans la colonne de droite, **"Changer le statut"** :
   - Sélectionnez **"En cours d'examen"**
   - Ajoutez un commentaire : "Vérification des documents en cours"
   - Cliquez sur **"Mettre à jour"**
6. Le statut change → badge orange "En cours d'examen"
7. L'historique est mis à jour avec votre commentaire

### 6.3 Approuver la demande

1. Toujours sur la même page
2. Changez le statut vers **"Prêt à retirer"**
3. Commentaire : "Votre document est prêt. Vous pouvez le retirer à la mairie."
4. Cliquez sur **"Mettre à jour"**

### 6.4 Vérifier côté citoyen

1. Retournez sur http://localhost:3000/app
2. La demande a maintenant le badge bleu **"Prêt à retirer"**
3. Cliquez sur la demande pour voir le détail
4. La **timeline** montre tous les changements :
   - ✓ Prêt à retirer (maintenant)
   - ⏱ En cours d'examen (il y a X minutes) avec le commentaire
   - 📄 Demande créée

### 6.5 Notes internes (visible uniquement par les agents)

1. Retournez sur http://localhost:3000/admin/requests/[id]
2. Dans **"Notes internes"** :
   - Ajoutez : "RDV fixé pour le retrait le 15/11 à 14h"
   - Cliquez sur **"Enregistrer les notes"**
3. Ces notes ne sont PAS visibles par le citoyen ✅

## Étape 7 : Créer un agent (pas admin)

Pour tester la différence entre **agent** et **admin** :

1. Créez un 2ème compte avec un autre email
2. Dans Supabase, changez son role en **"agent"**
3. Connectez-vous avec ce compte
4. Allez sur http://localhost:3000/admin
5. L'agent peut :
   - ✅ Voir le dashboard
   - ✅ Gérer les demandes
   - ❌ NE PEUT PAS accéder à /admin/agents
   - ❌ NE PEUT PAS accéder à /admin/settings

## Étape 8 : Tester les filtres et recherches

1. Créez plusieurs demandes de différents types
2. Allez sur **/admin/requests**
3. Testez les filtres :
   - Recherche par nom
   - Filtre par statut
   - Filtre par type d'acte
4. Les résultats se mettent à jour en temps réel

## Étape 9 : Tester les statistiques

1. Créez plusieurs demandes avec différents statuts
2. Sur le dashboard (/admin), les cartes se mettent à jour :
   - Total demandes
   - En attente (orange)
   - En cours (bleu)
   - Traitées aujourd'hui (vert)
3. La répartition par type d'acte s'affiche en bas

## Fonctionnalités à tester

### ✅ Dashboard Admin
- [ ] Statistiques s'affichent correctement
- [ ] "Dernières demandes" montre les 10 dernières
- [ ] Liens vers les demandes fonctionnent
- [ ] Répartition par type d'acte

### ✅ Liste des demandes
- [ ] Toutes les demandes s'affichent
- [ ] Recherche par nom fonctionne
- [ ] Filtres par statut fonctionnent
- [ ] Filtres par type d'acte fonctionnent
- [ ] Badges de couleur corrects

### ✅ Détail d'une demande
- [ ] Toutes les infos s'affichent
- [ ] Changement de statut fonctionne
- [ ] Commentaire sur changement de statut s'enregistre
- [ ] Notes internes fonctionnent
- [ ] Timeline/historique complet
- [ ] Liens vers citoyen

### ✅ Gestion des agents
- [ ] Liste de tous les agents/admins
- [ ] Badge de rôle correct
- [ ] Infos de contact

### ✅ Paramètres
- [ ] Types d'actes disponibles
- [ ] Délais de traitement
- [ ] Configuration des notifications

## Problèmes courants

### "Unauthorized" / Accès refusé
→ Vérifiez que votre rôle est bien "admin" ou "agent" dans la table profiles

### "Not authenticated"
→ Le lien magic link a expiré, reconnectez-vous

### Les demandes ne s'affichent pas
→ Vérifiez que les politiques RLS sont bien créées (relancez schema.sql)

### Erreur "Invalid API key"
→ Vérifiez .env.local avec les bonnes clés Supabase

## Résumé des URL importantes

```
PUBLIC
http://localhost:3000                    → Landing page
http://localhost:3000/auth/login         → Connexion

CITOYEN
http://localhost:3000/app                → Dashboard citoyen
http://localhost:3000/app/requests/new   → Nouvelle demande
http://localhost:3000/app/profile        → Profil

ADMIN (nécessite role agent ou admin)
http://localhost:3000/admin              → Dashboard admin
http://localhost:3000/admin/requests     → Liste demandes
http://localhost:3000/admin/agents       → Liste agents (admin seulement)
http://localhost:3000/admin/settings     → Paramètres (admin seulement)
```

## Prochaines étapes

Une fois le test validé, vous pouvez :
1. Ajouter d'autres agents
2. Personnaliser les messages et délais
3. Générer les icônes PWA
4. Déployer sur Vercel
5. Configurer un domaine personnalisé

Bon test ! 🚀

