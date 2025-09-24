#!/bin/bash

# Script de déploiement pour Plan-Eat
# Ce script automatise le déploiement sur Vercel

echo "🚀 Déploiement de Plan-Eat sur Vercel"
echo "=====================================\n"

# Utiliser npx pour Vercel CLI (pas besoin d'installation globale)
echo "🔧 Utilisation de Vercel CLI via npx..."

# Vérifier que l'utilisateur est connecté à Vercel
echo "🔐 Vérification de l'authentification Vercel..."
if ! npx vercel whoami &> /dev/null; then
    echo "⚠️  Vous n'êtes pas connecté à Vercel"
    echo "Connecting to Vercel..."
    npx vercel login
fi

# Tester le build local
echo "\n🔨 Test du build local..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Le build local a échoué. Veuillez corriger les erreurs avant de déployer."
    exit 1
fi

echo "✅ Build local réussi !"

# Demander confirmation avant le déploiement
echo "\n🚨 Variables d'environnement requises sur Vercel :"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET"
echo "   - OPENAI_API_KEY (optionnel)"
echo "\nAssurez-vous que ces variables sont configurées dans Vercel Dashboard."

read -p "\n🤔 Voulez-vous continuer avec le déploiement ? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Déploiement annulé."
    exit 0
fi

# Déploiement
echo "\n🚀 Déploiement en cours..."
npx vercel --prod

echo "\n✅ Déploiement terminé !"
echo "🌐 Votre application est maintenant disponible en ligne."
