# Guide de Déploiement - Plan-Eat 🚀

## ✅ État du projet
Votre application est maintenant **prête pour le déploiement** ! Toutes les erreurs TypeScript ont été corrigées et le build fonctionne parfaitement.

## 🎯 Déploiement rapide avec Vercel (Recommandé)

### Option 1 : Déploiement automatique (Facile)
```bash
# Utilisez le script fourni
./deploy.sh
```

### Option 2 : Déploiement manuel

#### 1. Connexion à Vercel
```bash
npx vercel login
```

#### 2. Configuration et déploiement
```bash
npx vercel
# Suivez les instructions, puis :
npx vercel --prod
```

## 📋 Préparation pour le déploiement

### 1. Variables d'environnement
Créez un fichier `.env.local` avec les variables suivantes :

```env
# Base de données MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/plan-eat?retryWrites=true&w=majority

# Authentification JWT
JWT_SECRET=votre-secret-jwt-super-securise-ici

# OpenAI API (optionnel)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Next.js
NEXTAUTH_URL=https://votre-domaine.vercel.app
NODE_ENV=production
```

### 2. Configuration MongoDB

#### Option A : MongoDB Atlas (Recommandé)
1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster
3. Configurez les accès réseau (0.0.0.0/0 pour Vercel)
4. Créez un utilisateur de base de données
5. Récupérez l'URI de connexion

#### Option B : Base de données locale
- Assurez-vous que MongoDB est accessible publiquement (non recommandé pour la production)

### 3. Configuration des secrets
Générez un JWT_SECRET sécurisé :
```bash
openssl rand -base64 64
```

## Déploiement sur Vercel

### 1. Installation de Vercel CLI
```bash
npm install -g vercel
```

### 2. Connexion à Vercel
```bash
vercel login
```

### 3. Configuration du projet
```bash
vercel
```

### 4. Configuration des variables d'environnement
Dans le dashboard Vercel :
1. Allez dans Settings → Environment Variables
2. Ajoutez toutes les variables listées ci-dessus
3. Assurez-vous qu'elles sont configurées pour Production, Preview et Development

### 5. Déploiement
```bash
vercel --prod
```

## Alternatives de déploiement

### Railway
1. Connectez votre repo GitHub
2. Configurez les variables d'environnement
3. Railway détectera automatiquement Next.js

### DigitalOcean App Platform
1. Créez une nouvelle app
2. Connectez votre repo
3. Configurez les variables d'environnement
4. Définissez le build command : `npm run build`
5. Définissez le run command : `npm start`

### Docker (pour serveurs personnels)
Créez un `Dockerfile` :
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Test post-déploiement

1. Vérifiez que l'application se charge
2. Testez l'inscription/connexion
3. Testez la création de recettes
4. Vérifiez la connexion à la base de données

## Monitoring et logs

- Surveillez les logs Vercel pour les erreurs
- Configurez des alertes MongoDB Atlas
- Utilisez Vercel Analytics pour le monitoring des performances

## Optimisations recommandées

1. **Images** : Compressez les images dans `/public/images/`
2. **SEO** : Ajoutez des métadonnées appropriées
3. **Performance** : Utilisez le lazy loading pour les composants lourds
4. **Sécurité** : Configurez des CSP headers
5. **Cache** : Configurez le cache pour les ressources statiques

## Domaine personnalisé

1. Dans Vercel, allez dans Settings → Domains
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions
4. Mettez à jour NEXTAUTH_URL avec votre nouveau domaine
