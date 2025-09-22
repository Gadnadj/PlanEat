# 🚀 Intégration ChatGPT - PlanEat

## ✅ Ce qui a été implémenté

### 1. **API Route pour ChatGPT** (`/api/generate-meal-plan`)
- ✅ Endpoint POST pour générer des plans de repas avec l'IA
- ✅ Gestion des erreurs et fallback automatique
- ✅ Support des préférences utilisateur (régime, allergies, budget, etc.)
- ✅ Parsing JSON sécurisé avec plan de secours

### 2. **Interface utilisateur**
- ✅ Bouton "🤖 Générer avec l'IA" sur la page de planification
- ✅ État de chargement avec spinner
- ✅ Gestion des deux formats de données (plan par défaut + plan IA)
- ✅ Affichage du temps de préparation des repas

### 3. **Fonctionnalités**
- ✅ Sauvegarde automatique du plan généré dans localStorage
- ✅ Chargement du plan précédent au refresh
- ✅ Gestion des préférences utilisateur dans le prompt IA

## 🔧 Configuration requise

### 1. **Obtenir une clé API OpenAI**
1. Allez sur [OpenAI Platform](https://platform.openai.com/)
2. Créez un compte ou connectez-vous
3. Allez dans "API Keys" → "Create new secret key"
4. Copiez la clé générée

### 2. **Ajouter la clé à votre .env.local**
```env
# Ajoutez cette ligne à votre fichier .env.local
OPENAI_API_KEY=sk-votre-cle-api-ici
```

### 3. **Redémarrer le serveur**
```bash
npm run dev
```

## 🎯 Comment ça fonctionne

### 1. **Flux utilisateur**
1. Utilisateur configure ses préférences sur `/preferences`
2. Va sur `/planification`
3. Clique sur "🤖 Générer avec l'IA"
4. L'IA génère un plan personnalisé basé sur ses préférences
5. Le plan s'affiche avec des repas variés et équilibrés

### 2. **Prompt IA intelligent**
Le système envoie à ChatGPT :
- Régime alimentaire (omnivore, végétarien, vegan, etc.)
- Nombre de personnes
- Budget (faible, moyen, élevé)
- Temps de cuisine souhaité
- Allergies alimentaires
- Aliments à éviter

### 3. **Format de réponse**
```json
{
  "lundi": {
    "matin": {
      "nom": "Petit-déjeuner protéiné",
      "ingredients": ["Œufs", "Avocat", "Pain complet"],
      "temps": "15 min"
    },
    "midi": { ... },
    "soir": { ... }
  },
  "mardi": { ... }
}
```

## 💡 Avantages de cette implémentation

- **Personnalisation** : Chaque plan est unique selon les préférences
- **Équilibre nutritionnel** : L'IA propose des repas variés et équilibrés
- **Respect des contraintes** : Allergies et préférences alimentaires prises en compte
- **Fallback robuste** : Plan par défaut si l'API échoue
- **UX fluide** : Chargement avec feedback visuel

## 🔄 Prochaines améliorations possibles

1. **Cache intelligent** : Éviter les appels répétés pour les mêmes préférences
2. **Variantes** : Générer plusieurs options de repas
3. **Nutrition** : Ajouter les valeurs nutritionnelles
4. **Saisonnalité** : Adapter les repas à la saison
5. **Liste de courses** : Générer automatiquement les ingrédients nécessaires

Votre application PlanEat est maintenant connectée à ChatGPT ! 🎉
