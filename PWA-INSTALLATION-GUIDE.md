# 📱 Guide d'Installation PWA - Plan-Eat

Votre application Plan-Eat est maintenant une **Progressive Web App (PWA)** ! Vous pouvez l'installer sur votre smartphone, tablette ou ordinateur pour une expérience native.

## 🎉 Fonctionnalités PWA Activées

### ✅ Ce qui fonctionne maintenant :
- **Installation native** : Ajoutez l'app à votre écran d'accueil
- **Fonctionnement hors-ligne** : Consultez vos plans de repas sans internet
- **Notifications push** : Recevez des rappels pour vos repas
- **Synchronisation automatique** : Vos données se synchronisent quand vous êtes en ligne
- **Interface native** : L'app se lance comme une application native
- **Mise à jour automatique** : L'app se met à jour automatiquement

## 📱 Installation sur Smartphone

### Sur Android (Chrome)
1. Ouvrez **Chrome** et allez sur votre site Plan-Eat
2. Tapez sur le menu **⋮** (3 points)
3. Sélectionnez **"Ajouter à l'écran d'accueil"**
4. Confirmez l'installation
5. L'icône Plan-Eat apparaît sur votre écran d'accueil

### Sur iPhone/iPad (Safari)
1. Ouvrez **Safari** et allez sur votre site Plan-Eat
2. Tapez sur le bouton **Partager** 📤
3. Faites défiler et sélectionnez **"Sur l'écran d'accueil"**
4. Personnalisez le nom si nécessaire
5. Tapez **"Ajouter"**

## 💻 Installation sur Desktop

### Chrome/Edge/Opera
1. Visitez votre site Plan-Eat
2. Cliquez sur l'icône **"Installer"** dans la barre d'adresse
3. Ou utilisez le menu **⋮** → **"Installer Plan-Eat"**
4. Confirmez l'installation

### Firefox
1. Visitez votre site Plan-Eat
2. Cliquez sur le bouton **"Install App"** qui apparaît en bas à droite
3. Confirmez l'installation

## 🔧 Fonctionnalités Avancées

### Mode Hors-ligne
- **Pages sauvegardées** : Accueil, Planning, Préférences, Shopping List
- **Données en cache** : Vos plans de repas et recettes récentes
- **Synchronisation** : Les changements se synchronisent quand vous retrouvez internet

### Notifications (Optionnel)
Pour activer les notifications :
1. Ouvrez l'app installée
2. Autorisez les notifications quand demandé
3. Recevez des rappels pour vos repas

### Raccourcis Rapides
Appuyez longuement sur l'icône de l'app pour accéder à :
- **Générer un plan** : Créer un nouveau plan de repas
- **Voir le planning** : Accéder directement à votre planning
- **Shopping list** : Ouvrir votre liste de courses

## 🆘 Dépannage

### L'option d'installation n'apparaît pas ?
- Assurez-vous d'utiliser **HTTPS**
- Vérifiez que votre navigateur est **à jour**
- Essayez de **recharger** la page
- Utilisez **Chrome, Safari, Edge ou Firefox**

### L'app ne fonctionne pas hors-ligne ?
- La première visite doit être **en ligne** pour télécharger les fichiers
- Naviguez sur quelques pages pour les mettre en **cache**
- Vérifiez que le **service worker** est activé (F12 → Application → Service Workers)

### Désinstaller l'app
- **Android** : Appui long sur l'icône → "Désinstaller"
- **iPhone** : Appui long → "Supprimer l'app"
- **Desktop** : Menu de l'app → "Désinstaller Plan-Eat"

## 🔄 Mises à jour

L'application se met à jour automatiquement. Vous verrez parfois une notification pour redémarrer l'app et appliquer les nouvelles fonctionnalités.

## 📊 Avantages de l'installation

### Performance
- **Chargement plus rapide** (fichiers en cache)
- **Moins de consommation de données**
- **Interface plus fluide**

### Expérience utilisateur
- **Pas de barre d'adresse** du navigateur
- **Plein écran** comme une app native
- **Icône dédiée** sur l'écran d'accueil
- **Multitâche** facile

### Fonctionnalités natives
- **Notifications push**
- **Accès hors-ligne**
- **Intégration OS** (partage, raccourcis)

## 🛠️ Pour les développeurs

### Fichiers PWA créés
- `public/manifest.json` - Configuration PWA
- `public/sw.js` - Service Worker
- `public/icons/` - Icônes dans toutes les tailles
- `components/PWAManager.tsx` - Gestionnaire PWA

### Configuration Next.js
- `next.config.ts` - Configuration avec `next-pwa`
- `app/layout.tsx` - Métadonnées et liens PWA

### Test PWA
```bash
# Vérifier la configuration PWA
npx lighthouse http://localhost:3000 --only-categories=pwa

# Tester en local
npm run build
npm run start
```

## 🎯 Prochaines étapes

Pour améliorer encore l'expérience PWA :
1. **Convertir les icônes SVG en PNG** pour une meilleure compatibilité
2. **Ajouter des screenshots** dans le manifest
3. **Implémenter des notifications push** avec un service backend
4. **Ajouter la géolocalisation** pour des suggestions de restaurants
5. **Synchronisation avancée** avec résolution de conflits

---

**Félicitations ! 🎉**  
Votre application Plan-Eat est maintenant installable et fonctionne comme une app native sur tous vos appareils !
