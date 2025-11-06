# 🚀 Déploiement Supabase avec CLI

Guide pour utiliser Supabase CLI pour déployer votre base de données en production.

## 📋 Prérequis

- ✅ Supabase CLI installé (vous avez la version 2.15.8)
- ✅ Compte Supabase avec un projet créé
- ✅ Projet local configuré avec les migrations

## 🔧 Étape 1 : Mettre à jour Supabase CLI (optionnel mais recommandé)

```bash
# Sur macOS avec Homebrew
brew upgrade supabase/tap/supabase

# Ou avec npm
npm install -g supabase@latest
```

## 🔐 Étape 2 : Se connecter à Supabase

```bash
# Se connecter à votre compte Supabase
supabase login
```

Cela ouvrira votre navigateur pour vous authentifier.

## 🔗 Étape 3 : Lier votre projet local au projet Supabase en production

```bash
# Lister vos projets Supabase
supabase projects list

# Lier votre projet local à un projet Supabase (remplacez PROJECT_REF par votre ID)
supabase link --project-ref PROJECT_REF
```

**Comment trouver votre PROJECT_REF ?**
- Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Ouvrez votre projet
- L'ID du projet est dans l'URL : `https://supabase.com/dashboard/project/xxxxx`
- Ou allez dans Settings → General → Reference ID

## 📤 Étape 4 : Pousser les migrations vers la production

```bash
# Pousser toutes les migrations vers la production
supabase db push

# Ou pousser une migration spécifique
supabase db push --db-url "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

⚠️ **Attention** : `db push` applique toutes les migrations en attente. Assurez-vous que :
- ✅ Vos migrations sont correctes
- ✅ Vous avez testé localement avec `supabase db reset`
- ✅ Vous avez sauvegardé vos données de production (si nécessaire)

## 🔍 Étape 5 : Vérifier l'état des migrations

```bash
# Voir les migrations locales
ls -la supabase/migrations/

# Voir les migrations appliquées en production
supabase migration list
```

## 🧪 Étape 6 : Tester la connexion

```bash
# Vérifier la connexion à votre projet
supabase status
```

## 📊 Commandes utiles

### Voir les différences entre local et production

```bash
# Générer un diff entre votre base locale et la production
supabase db diff

# Voir les différences de schéma
supabase db diff --schema public
```

### Créer une nouvelle migration

```bash
# Créer une migration à partir des changements locaux
supabase migration new nom_de_la_migration

# Ou créer une migration depuis un diff
supabase db diff -f nom_de_la_migration
```

### Appliquer les migrations en production

```bash
# Pousser toutes les migrations
supabase db push

# Pousser avec vérification
supabase db push --dry-run
```

### Gérer les seeds (données de test)

```bash
# Appliquer les seeds en production (attention !)
supabase db seed --db-url "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

⚠️ **Ne pas utiliser en production** sauf pour des données initiales.

## 🎯 Workflow de déploiement recommandé

### 1. Développement local

```bash
# Démarrer Supabase local
supabase start

# Tester les migrations
supabase db reset

# Créer une nouvelle migration si nécessaire
supabase migration new ma_nouvelle_feature
```

### 2. Préparation pour la production

```bash
# Vérifier les différences
supabase db diff

# Vérifier que les migrations sont correctes
supabase migration list
```

### 3. Déploiement en production

```bash
# Se connecter si nécessaire
supabase login

# Lier le projet si nécessaire
supabase link --project-ref PROJECT_REF

# Pousser les migrations
supabase db push
```

### 4. Vérification

```bash
# Vérifier l'état
supabase status

# Vérifier les migrations appliquées
supabase migration list
```

## 🔒 Sécurité

### Variables d'environnement pour les mots de passe

Ne jamais mettre le mot de passe directement dans la commande. Utilisez plutôt :

```bash
# Avec variable d'environnement
export SUPABASE_DB_PASSWORD="votre-mot-de-passe"
supabase db push --db-url "postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.[PROJECT_REF].supabase.co:5432/postgres"
```

Ou utilisez le fichier `.env` :

```bash
# Dans .env
SUPABASE_DB_PASSWORD=votre-mot-de-passe

# Puis dans la commande
supabase db push --db-url "postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.[PROJECT_REF].supabase.co:5432/postgres"
```

## 🐛 Dépannage

### Erreur : "project not found"

```bash
# Vérifier que vous êtes connecté
supabase login

# Vérifier que le projet est bien lié
supabase link --project-ref PROJECT_REF
```

### Erreur : "migration already applied"

```bash
# Vérifier les migrations appliquées
supabase migration list

# Si nécessaire, marquer une migration comme appliquée manuellement
```

### Erreur : "connection refused"

```bash
# Vérifier que le projet Supabase est actif
# Allez sur https://supabase.com/dashboard
# Vérifiez que le projet n'est pas en pause
```

## 📝 Checklist de déploiement

- [ ] Supabase CLI à jour
- [ ] Connecté avec `supabase login`
- [ ] Projet lié avec `supabase link`
- [ ] Migrations testées localement
- [ ] Diff vérifié avec `supabase db diff`
- [ ] Migrations poussées avec `supabase db push`
- [ ] Migrations vérifiées avec `supabase migration list`
- [ ] Base de données testée en production

## 🎉 C'est tout !

Votre base de données est maintenant déployée en production ! 🚀

---

**Note** : Pour le premier déploiement, vous pouvez aussi utiliser le script SQL complet (`supabase/production-setup.sql`) directement dans l'éditeur SQL de Supabase, puis utiliser le CLI pour les migrations futures.

