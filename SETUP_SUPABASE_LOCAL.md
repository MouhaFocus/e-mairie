# Configuration Supabase Local avec CLI

## Option 1 : Supabase Local (avec Docker) - RECOMMANDÉ

### Prérequis
- Docker Desktop doit être installé et démarré
- Supabase CLI (déjà installé ✅)

### Étapes

#### 1. Démarrer Docker Desktop
- Ouvrez **Docker Desktop** sur votre Mac
- Attendez qu'il démarre complètement (l'icône dans la barre de menu devient stable)

#### 2. Démarrer Supabase Local
```bash
cd /Users/mouhamadougueye/mairie-e-actes
supabase start
```

Cela va télécharger et démarrer tous les services Supabase en local (PostgreSQL, GoTrue Auth, etc.)

**Attendez 2-3 minutes** la première fois (téléchargement des images Docker).

#### 3. Récupérer les credentials locaux
Une fois démarré, vous verrez quelque chose comme :

```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 4. Mettre à jour .env.local
Copiez les credentials dans votre `.env.local` :

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...votre-anon-key-locale
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...votre-service-role-key-locale
```

#### 5. Appliquer le schéma SQL

**Option A : Via Studio (Interface graphique)**
- Ouvrez http://localhost:54323 (Supabase Studio)
- Allez dans **SQL Editor**
- Copiez le contenu de `supabase/schema.sql`
- Collez et cliquez sur **Run**

**Option B : Via CLI**
```bash
supabase db reset
```

Cela applique automatiquement tous les fichiers SQL dans `supabase/migrations/`.

Pour créer une migration depuis notre schema.sql :
```bash
# Créer un fichier de migration
supabase migration new initial_schema

# Puis copiez le contenu de schema.sql dans le fichier créé
# Le fichier sera dans supabase/migrations/XXXXXX_initial_schema.sql

# Appliquer la migration
supabase db reset
```

#### 6. Démarrer l'application
```bash
npm run dev
```

Allez sur http://localhost:3000 🚀

#### 7. Créer votre premier compte admin

Après inscription via l'app, ouvrez Supabase Studio :
- http://localhost:54323
- Allez dans **Table Editor** > **profiles**
- Trouvez votre utilisateur
- Changez `role` de `citizen` → `admin`

Ou via SQL dans Studio :
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'votre-email@exemple.com'
);
```

#### 8. Tester le back-office
Allez sur http://localhost:3000/admin ✅

### Arrêter Supabase Local
```bash
supabase stop
```

### Redémarrer
```bash
supabase start
```

### Voir les logs
```bash
supabase status
```

---

## Option 2 : Supabase Cloud (sans Docker)

Si vous ne voulez pas utiliser Docker, utilisez Supabase Cloud :

### 1. Créer un projet
- Allez sur [supabase.com](https://supabase.com)
- Créez un compte (gratuit)
- Créez un nouveau projet
- Choisissez un mot de passe et une région

### 2. Récupérer les credentials
- Dans votre projet, allez dans **Settings > API**
- Copiez :
  - Project URL
  - anon/public key
  - service_role key

### 3. Mettre à jour .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...votre-service-role-key
```

### 4. Appliquer le schéma
- Allez dans **SQL Editor**
- Copiez tout le contenu de `supabase/schema.sql`
- Collez et cliquez sur **Run**

### 5. Configurer l'authentification
- Allez dans **Authentication > URL Configuration**
- Ajoutez les Site URL et Redirect URLs :
  - Site URL: `http://localhost:3000`
  - Redirect URLs: `http://localhost:3000/**`

### 6. Lancer l'app
```bash
npm run dev
```

---

## Commandes utiles

### Supabase Local
```bash
# Démarrer
supabase start

# Arrêter
supabase stop

# Voir le statut
supabase status

# Réinitialiser la DB (ATTENTION: efface les données)
supabase db reset

# Voir les logs
supabase logs

# Accéder à la DB via psql
supabase db shell

# Push vers le cloud (si vous avez un projet Supabase lié)
supabase db push
```

### Studio Local
- **URL**: http://localhost:54323
- Interface web complète pour gérer votre base de données locale
- Table Editor, SQL Editor, Auth, Storage, etc.

### Inbucket (Emails locaux)
- **URL**: http://localhost:54324
- Tous les emails (magic links, etc.) sont capturés ici en local
- Parfait pour tester sans envoyer de vrais emails !

---

## Troubleshooting

### "Cannot connect to Docker daemon"
→ Démarrez Docker Desktop

### "Port already in use"
→ Un service utilise déjà le port
```bash
supabase stop
# Puis redémarrez
supabase start
```

### "Migration failed"
→ Vérifiez la syntaxe SQL dans schema.sql
→ Regardez les logs : `supabase logs`

### Les magic links ne fonctionnent pas
→ En local, allez sur http://localhost:54324 (Inbucket)
→ Les emails y sont capturés automatiquement !

### "Invalid API key"
→ Vérifiez que vous avez bien copié les clés depuis `supabase status`
→ Redémarrez l'app Next.js après avoir modifié .env.local

---

## Recommandation

**Pour le développement** : Utilisez Supabase Local (Option 1)
- Plus rapide
- Pas besoin de compte
- Données isolées
- Gratuit et illimité

**Pour la production** : Utilisez Supabase Cloud (Option 2)
- Hébergé et géré
- Sauvegardes automatiques
- CDN global
- Scaling automatique

Vous pouvez développer en local puis déployer vers le cloud quand vous êtes prêt !

