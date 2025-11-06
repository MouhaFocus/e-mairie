#!/usr/bin/env node

/**
 * Script de vérification des variables d'environnement
 * Usage: node scripts/check-env.js
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
]

const optionalEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'NODE_ENV',
]

console.log('🔍 Vérification des variables d\'environnement...\n')

let hasErrors = false
let hasWarnings = false

// Vérifier les variables requises
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ ${varName} est manquante (requise)`)
    hasErrors = true
  } else {
    console.log(`✅ ${varName} est définie`)
  }
})

// Vérifier les variables optionnelles
optionalEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.warn(`⚠️  ${varName} est manquante (optionnelle)`)
    hasWarnings = true
  } else {
    console.log(`✅ ${varName} est définie`)
  }
})

// Vérifier les formats
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://')) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL doit commencer par https://')
    hasErrors = true
  }
}

if (process.env.NEXT_PUBLIC_SITE_URL) {
  if (!process.env.NEXT_PUBLIC_SITE_URL.startsWith('https://') && !process.env.NEXT_PUBLIC_SITE_URL.startsWith('http://localhost')) {
    console.warn('⚠️  NEXT_PUBLIC_SITE_URL devrait utiliser https:// en production')
    hasWarnings = true
  }
}

console.log('\n' + '='.repeat(50))

if (hasErrors) {
  console.error('\n❌ Des erreurs ont été détectées. Veuillez corriger les variables manquantes.')
  process.exit(1)
} else if (hasWarnings) {
  console.warn('\n⚠️  Des avertissements ont été détectés, mais le déploiement peut continuer.')
  process.exit(0)
} else {
  console.log('\n✅ Toutes les variables d\'environnement sont correctement configurées !')
  process.exit(0)
}

