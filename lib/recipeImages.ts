// Configuration des images de recettes locales
// Place tes images dans le dossier public/images/recipes/

export const recipeImages = {
  // Format: 'recipe-slug': 'filename' (correspondant aux fichiers existants)
  
  // Recettes existantes (françaises)
  'salade-mditerranenne': 'salade-medi.png',
  'ptes-au-pesto': 'pates-pesto.png',
  
  // Nouvelles recettes (anglaises) - correspondant aux fichiers existants
  'honey-garlic-salmon': 'honey-garlic-salmon.png',
  'avocado-toast-supreme': 'avocado-toast.png',
  'chicken-teriyaki-bowl': 'chicken-teriyaki.png',
  'mediterranean-quinoa-salad': 'mediteraneen-salad.png',
  'beef-tacos-with-lime-crema': 'beef-tacos-lime.png',
  'creamy-mushroom-risotto': 'risotto-mushroom.png',
  'greek-yogurt-parfait': 'greek-yogurt.png',
  'thai-basil-chicken': 'thai-basil.png',
  'chocolate-chip-cookies': 'chocolate-chip.png',
  'caesar-salad-with-grilled-chicken': 'grille-chicken-caesar.png',
  
  // Tu peux ajouter d'autres recettes ici
  // Format recommandé : nom-de-la-recette.png
};

// Fonction helper pour obtenir l'URL de l'image
export function getRecipeImageUrl(recipeTitle: string): string {
  // Convertir le titre en slug
  const slug = recipeTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Enlever les caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer espaces par tirets
    .replace(/-+/g, '-') // Éviter les doubles tirets
    .trim();

  // Chercher l'image correspondante
  const imageName = recipeImages[slug as keyof typeof recipeImages];
  
  if (imageName) {
    return `/images/recipes/${imageName}`;
  }
  
  // Image par défaut si aucune image trouvée
  return '/images/recipes/default-recipe.jpg';
}

// Fonction pour vérifier si une image existe pour une recette
export function hasCustomImage(recipeTitle: string): boolean {
  const slug = recipeTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
    
  return slug in recipeImages;
}
