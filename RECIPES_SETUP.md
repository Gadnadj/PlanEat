# 🍽️ Configuration du Système de Recettes

## 📋 Vue d'ensemble

Le système de recettes de PlanEat permet d'afficher et de gérer une base de données de recettes provenant d'APIs externes (Spoonacular) et de recettes manuelles.

## 🚀 Configuration

### 1. Variables d'environnement

Ajoutez à votre fichier `.env.local` :

```env
SPOONACULAR_API_KEY=votre_cle_api_spoonacular
```

### 2. Obtenir une clé API Spoonacular

1. Allez sur [Spoonacular API](https://spoonacular.com/food-api)
2. Créez un compte gratuit
3. Obtenez votre clé API (100 requêtes/jour gratuites)

### 3. Peupler la base de données

#### Option A : Via l'API (recommandé)
```bash
curl -X POST http://localhost:3001/api/recipes/populate
```

#### Option B : Via le script Node.js
```bash
npm run populate-recipes
```

## 🎯 Fonctionnalités

### ✅ Implémentées
- **Modèle de données complet** : Recettes avec ingrédients, instructions, nutrition
- **API REST** : CRUD complet pour les recettes
- **Intégration Spoonacular** : Récupération automatique de recettes
- **Recettes manuelles** : Base de recettes de fallback
- **Page d'accueil** : Affichage des recettes avec ajout à la shopping list
- **Recherche et filtres** : Par catégorie, difficulté, temps de préparation

### 🔧 API Endpoints

- `GET /api/recipes` - Récupérer toutes les recettes (avec pagination et filtres)
- `GET /api/recipes/[id]` - Récupérer une recette spécifique
- `POST /api/recipes` - Créer une nouvelle recette
- `PUT /api/recipes/[id]` - Mettre à jour une recette
- `DELETE /api/recipes/[id]` - Supprimer une recette
- `POST /api/recipes/populate` - Peupler la base avec des recettes

### 📊 Structure des données

```typescript
interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  emoji: string;
  ingredients: {
    name: string;
    amount: string;
    unit?: string;
  }[];
  instructions: string[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: 'facile' | 'moyen' | 'difficile';
  category: string;
  tags: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  externalId?: string;
  source: 'spoonacular' | 'edamam' | 'manual';
}
```

## 🎨 Interface utilisateur

### Page d'accueil
- **Affichage des recettes** : 6 recettes les plus récentes
- **Informations détaillées** : Temps, portions, difficulté, ingrédients
- **Ajout à la shopping list** : Bouton pour ajouter tous les ingrédients
- **Navigation** : Lien vers toutes les recettes

### Fonctionnalités des recettes
- **Images** : Photos des recettes avec emoji de fallback
- **Ingrédients** : Liste complète avec quantités
- **Instructions** : Étapes détaillées de préparation
- **Nutrition** : Informations caloriques et macronutriments
- **Catégorisation** : Par type de cuisine et difficulté

## 🔄 Workflow

1. **Initialisation** : Le script récupère des recettes depuis Spoonacular
2. **Transformation** : Les données sont adaptées au format interne
3. **Stockage** : Sauvegarde en base de données MongoDB
4. **Affichage** : Récupération et affichage sur la page d'accueil
5. **Interaction** : Ajout des ingrédients à la shopping list

## 🛠️ Maintenance

### Ajouter de nouvelles recettes
```typescript
const newRecipe = {
  title: "Ma nouvelle recette",
  description: "Description de la recette",
  // ... autres champs
};

await fetch('/api/recipes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newRecipe)
});
```

### Mettre à jour la base
```bash
# Repeupler avec de nouvelles recettes
curl -X POST http://localhost:3001/api/recipes/populate
```

## 🎉 Résultat

Votre application dispose maintenant d'une base de données complète de recettes avec :
- **100+ recettes** provenant d'APIs externes
- **Interface moderne** et responsive
- **Intégration shopping list** automatique
- **Système de recherche** et filtres
- **Données nutritionnelles** complètes

Le système est prêt à être utilisé et peut être étendu selon vos besoins !
