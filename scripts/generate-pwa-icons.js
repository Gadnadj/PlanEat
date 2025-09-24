import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// Tailles d'icônes requises pour PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = join(__dirname, '..', 'public', 'icons');

// Créer le dossier icons s'il n'existe pas
if (!existsSync(iconDir)) {
  mkdirSync(iconDir, { recursive: true });
}

// Template SVG pour l'icône Plan-Eat
const createSVGIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.2"/>
    </filter>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#grad1)" filter="url(#shadow)"/>
  
  <!-- Text "PE" for Plan-Eat -->
  <text x="${size/2}" y="${size * 0.7}" 
        font-family="Arial, Helvetica, sans-serif" 
        font-size="${size * 0.4}" 
        font-weight="900" 
        text-anchor="middle" 
        fill="white" 
        opacity="0.95">PE</text>
</svg>`;

// Fonction pour convertir SVG en base64 PNG (simulation)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createPNGFromSVG(svgContent, size) {
  // En production, vous utiliseriez une bibliothèque comme 'sharp' ou 'canvas'
  // Pour cette démo, nous créons un placeholder PNG en base64
  const canvas = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    ${svgContent.replace(/<svg[^>]*>/, '').replace('</svg>', '')}
  </svg>`;
  
  return canvas;
}

// Générer les icônes
console.log('🎨 Génération des icônes PWA pour Plan-Eat...');

iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}x${size}.png`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filepath = join(iconDir, filename);
  
  // Pour cette démo, nous sauvegardons en SVG
  // En production, vous convertiriez en PNG
  const svgFilename = `icon-${size}x${size}.svg`;
  const svgFilepath = join(iconDir, svgFilename);
  
  writeFileSync(svgFilepath, svgContent);
  console.log(`✅ Icône générée: ${svgFilename}`);
});

// Créer aussi un favicon.ico basique
const faviconSVG = createSVGIcon(32);
writeFileSync(join(__dirname, '..', 'public', 'favicon.svg'), faviconSVG);

// Créer un apple-touch-icon
const appleTouchIcon = createSVGIcon(180);
writeFileSync(join(iconDir, 'apple-touch-icon.svg'), appleTouchIcon);

console.log('🎉 Toutes les icônes PWA ont été générées avec succès !');
console.log('📝 Note: Les fichiers sont en format SVG. Pour la production, convertissez-les en PNG.');
console.log('🛠️  Vous pouvez utiliser des outils comme "sharp" ou des services en ligne pour la conversion.');

// Créer un README pour les icônes
const readmeContent = `# Icônes PWA - Plan-Eat

## Fichiers générés

Les icônes suivantes ont été générées pour votre PWA :

${iconSizes.map(size => `- icon-${size}x${size}.svg (${size}x${size}px)`).join('\n')}
- apple-touch-icon.svg (180x180px)
- favicon.svg (32x32px)

## Conversion en PNG

Pour une meilleure compatibilité, convertissez ces fichiers SVG en PNG :

### Avec Sharp (Node.js)
\`\`\`bash
npm install sharp
\`\`\`

### Avec des outils en ligne
- https://convertio.co/svg-png/
- https://cloudconvert.com/svg-to-png

### Avec Inkscape (ligne de commande)
\`\`\`bash
inkscape --export-type=png --export-dpi=96 icon-192x192.svg
\`\`\`

## Configuration

Les icônes sont automatiquement référencées dans :
- \`public/manifest.json\`
- \`app/layout.tsx\` (métadonnées)

## Personnalisation

Pour personnaliser les icônes :
1. Modifiez le script \`scripts/generate-pwa-icons.js\`
2. Relancez la génération : \`node scripts/generate-pwa-icons.js\`
3. Convertissez les nouveaux SVG en PNG
`;

writeFileSync(join(iconDir, 'README.md'), readmeContent);
console.log('📖 README créé dans le dossier icons/');
