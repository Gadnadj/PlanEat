# Images de Recettes

## 📁 Comment ajouter tes propres images

### 1. Structure des fichiers
Place tes images dans ce dossier : `public/images/recipes/`

### 2. Noms des fichiers recommandés
- Format : `nom-de-la-recette.jpg` ou `.png`
- Utilise des tirets au lieu d'espaces
- Évite les caractères spéciaux

### 3. Images actuellement configurées

Voici les noms de fichiers attendus pour les recettes existantes :

#### Nouvelles recettes (en anglais)
- `honey-garlic-salmon.jpg`
- `avocado-toast-supreme.jpg` 
- `chicken-teriyaki-bowl.jpg`
- `mediterranean-quinoa-salad.jpg`
- `beef-tacos-lime-crema.jpg`
- `creamy-mushroom-risotto.jpg`
- `greek-yogurt-parfait.jpg`
- `thai-basil-chicken.jpg`
- `chocolate-chip-cookies.jpg`
- `caesar-salad-grilled-chicken.jpg`

#### Recettes existantes (en français)
- `salade-mediterraneenne.jpg`
- `pates-au-pesto.jpg`

### 4. Image par défaut
Si une image n'est pas trouvée, le système utilisera : `default-recipe.jpg`

### 5. Dimensions recommandées
- **Largeur** : 800px minimum
- **Hauteur** : 600px minimum
- **Ratio** : 4:3 ou 16:10
- **Format** : JPG ou PNG
- **Taille** : < 500KB pour optimiser les performances

### 6. Comment ajouter une nouvelle recette avec image

1. **Ajoute ton image** dans ce dossier
2. **Ouvre** le fichier `lib/recipeImages.ts`
3. **Ajoute** une ligne dans l'objet `recipeImages` :
   ```typescript
   'ma-nouvelle-recette': 'ma-nouvelle-recette.jpg',
   ```

### 7. Exemple complet

Si tu veux ajouter une recette "Tarte aux Pommes" :

1. **Nom du fichier image** : `tarte-aux-pommes.jpg`
2. **Place l'image** dans `public/images/recipes/tarte-aux-pommes.jpg`
3. **Ajoute dans** `lib/recipeImages.ts` :
   ```typescript
   'tarte-aux-pommes': 'tarte-aux-pommes.jpg',
   ```

## 🖼️ Avantages de ce système

- ✅ **Images locales** = chargement plus rapide
- ✅ **Contrôle total** sur la qualité des images
- ✅ **Pas de dépendance** aux services externes
- ✅ **Cohérence visuelle** pour ton application
- ✅ **Facilité d'ajout** de nouvelles images

## 🔧 Maintenance

- Le système détecte automatiquement si une image existe
- Fallback automatique vers l'image par défaut
- Facile d'ajouter/modifier/supprimer des images
