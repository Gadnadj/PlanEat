#!/bin/sh

# Hook pre-push pour bloquer les pushes si les tests échouent

echo "🧪 Lancement des tests avant le push..."

# Exécuter les tests
npm test

# Si les tests échouent, bloquer le push
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Les tests ont échoué. Le push est annulé."
  echo "💡 Corrigez les tests avant de push."
  exit 1
fi

echo ""
echo "✅ Tous les tests ont réussi. Le push continue."
exit 0
