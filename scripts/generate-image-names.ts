// Script pour générer les noms de fichiers images à partir des titres de recettes
// Utilise ce script pour obtenir les noms de fichiers exacts à utiliser

import { generateRecipeSlug } from '../lib/recipeHelpers';

// Liste des titres de tes recettes
const recipeTitles = [
  // Recettes existantes
  'Salade Méditerranéenne',
  'Pâtes au Pesto',
  
  // Nouvelles recettes
  'Honey Garlic Salmon',
  'Avocado Toast Supreme',
  'Chicken Teriyaki Bowl',
  'Mediterranean Quinoa Salad',
  'Beef Tacos with Lime Crema',
  'Creamy Mushroom Risotto',
  'Greek Yogurt Parfait',
  'Thai Basil Chicken',
  'Chocolate Chip Cookies',
  'Caesar Salad with Grilled Chicken'
];

console.log('='.repeat(60));
console.log('📸 NOMS DE FICHIERS IMAGES POUR TES RECETTES');
console.log('='.repeat(60));
console.log();

recipeTitles.forEach((title, index) => {
  const slug = generateRecipeSlug(title);
  const filename = `${slug}.jpg`;
  
  console.log(`${(index + 1).toString().padStart(2, '0')}. ${title}`);
  console.log(`    📁 Nom de fichier: ${filename}`);
  console.log(`    📂 Chemin complet: public/images/recipes/${filename}`);
  console.log();
});

console.log('='.repeat(60));
console.log('💡 INSTRUCTIONS');
console.log('='.repeat(60));
console.log('1. Prends tes photos de recettes');
console.log('2. Renomme-les avec les noms ci-dessus');
console.log('3. Place-les dans le dossier public/images/recipes/');
console.log('4. Format recommandé: JPG, 800x600px minimum');
console.log('5. Taille recommandée: < 500KB');
console.log();
console.log('✅ Une fois fait, tes recettes utiliseront tes propres images !');

// Export pour utilisation dans d'autres scripts
export { recipeTitles };
