# Icônes PWA - Plan-Eat

## Fichiers générés

Les icônes suivantes ont été générées pour votre PWA :

- icon-72x72.svg (72x72px)
- icon-96x96.svg (96x96px)
- icon-128x128.svg (128x128px)
- icon-144x144.svg (144x144px)
- icon-152x152.svg (152x152px)
- icon-192x192.svg (192x192px)
- icon-384x384.svg (384x384px)
- icon-512x512.svg (512x512px)
- apple-touch-icon.svg (180x180px)
- favicon.svg (32x32px)

## Conversion en PNG

Pour une meilleure compatibilité, convertissez ces fichiers SVG en PNG :

### Avec Sharp (Node.js)
```bash
npm install sharp
```

### Avec des outils en ligne
- https://convertio.co/svg-png/
- https://cloudconvert.com/svg-to-png

### Avec Inkscape (ligne de commande)
```bash
inkscape --export-type=png --export-dpi=96 icon-192x192.svg
```

## Configuration

Les icônes sont automatiquement référencées dans :
- `public/manifest.json`
- `app/layout.tsx` (métadonnées)

## Personnalisation

Pour personnaliser les icônes :
1. Modifiez le script `scripts/generate-pwa-icons.js`
2. Relancez la génération : `node scripts/generate-pwa-icons.js`
3. Convertissez les nouveaux SVG en PNG
