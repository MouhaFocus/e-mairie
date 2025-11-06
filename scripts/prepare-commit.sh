#!/bin/bash

# Script pour préparer un commit propre
# Exclut automatiquement les fichiers lourds et inutiles

echo "🧹 Nettoyage avant commit..."

# S'assurer que node_modules et .next sont bien ignorés
git rm -r --cached node_modules .next 2>/dev/null || true

# Vérifier les fichiers qui vont être ajoutés
echo ""
echo "📋 Fichiers qui seront ajoutés (premiers 20):"
git status --short | head -20

echo ""
echo "📊 Taille des fichiers à commiter (hors node_modules/.next):"
du -sh . --exclude=node_modules --exclude=.next --exclude=.git 2>/dev/null | head -1

echo ""
echo "✅ Prêt pour commit !"
echo ""
echo "Commandes suggérées:"
echo "  git add ."
echo "  git commit -m 'Your commit message'"
echo "  git push"

