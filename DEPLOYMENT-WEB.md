# 🌐 Déploiement Plan-Eat via le site web Vercel

## 🚀 Étapes pour déployer via vercel.com

### 1. Préparation du code
Votre code est déjà prêt ! Assurez-vous que vos changements sont committés :

```bash
git add .
git commit -m "Préparation pour le déploiement"
git push origin main
```

### 2. Connexion à Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Connectez-vous avec votre compte GitHub, GitLab ou Bitbucket

### 3. Import du projet
1. Cliquez sur **"New Project"** ou **"Add New..."** → **"Project"**
2. Connectez votre compte Git si ce n'est pas fait
3. Cherchez votre repository **"plan-eat"**
4. Cliquez sur **"Import"**

### 4. Configuration du projet
Vercel détectera automatiquement que c'est un projet Next.js.

**Paramètres détectés automatiquement :**
- Framework Preset: `Next.js`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**➡️ Cliquez sur "Deploy" sans rien changer !**

### 5. Configuration des variables d'environnement
Pendant que le premier déploiement se lance, configurez vos variables :

1. Dans le dashboard Vercel, allez dans votre projet
2. Cliquez sur **"Settings"** 
3. Cliquez sur **"Environment Variables"**
4. Ajoutez ces variables une par une :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/plan-eat` | Production, Preview, Development |
| `JWT_SECRET` | `votre-secret-jwt-super-securise` | Production, Preview, Development |
| `OPENAI_API_KEY` | `sk-votre-cle-openai` (optionnel) | Production, Preview, Development |

### 6. Redéploiement avec les variables
1. Retournez dans l'onglet **"Deployments"**
2. Cliquez sur **"Redeploy"** pour le dernier déploiement
3. Cochez **"Use existing Build Cache"**
4. Cliquez sur **"Redeploy"**

## 🎯 Avantages du déploiement web

✅ **Interface graphique intuitive**
✅ **Pas besoin d'installer d'outils**
✅ **Déploiement automatique** à chaque push sur la branche main
✅ **Preview deployments** pour chaque Pull Request
✅ **Analytics et monitoring** intégrés
✅ **Domaines personnalisés** faciles à configurer

## 🔗 Fonctionnalités automatiques

- **Auto-déploiement** : Chaque push sur `main` redéploie automatiquement
- **Preview URLs** : Chaque branche/PR a sa propre URL de test
- **Analytics** : Statistiques de performance et d'usage
- **Monitoring** : Surveillance des erreurs et performances

## 🛠️ Configuration MongoDB

Si vous n'avez pas encore de base de données MongoDB :

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un compte gratuit
3. Créez un nouveau cluster (gratuit)
4. Configurez l'accès réseau : **0.0.0.0/0** (pour Vercel)
5. Créez un utilisateur de base de données
6. Récupérez l'URI de connexion

## 🎉 Après le déploiement

1. **Votre URL** sera du type : `https://plan-eat-xyz.vercel.app`
2. **Testez votre application** avec toutes les fonctionnalités
3. **Configurez un domaine personnalisé** si souhaité
4. **Surveillez les logs** pour détecter d'éventuels problèmes

## 🆘 Résolution de problèmes

### Si le build échoue :
- Vérifiez les logs dans l'onglet "Functions"
- Les erreurs TypeScript sont affichées clairement

### Si l'app ne fonctionne pas :
- Vérifiez les variables d'environnement
- Testez la connexion MongoDB dans les logs
- Vérifiez que l'URI MongoDB autorise les connexions depuis 0.0.0.0/0

### Pour voir les logs en temps réel :
- Allez dans "Functions" → Cliquez sur une fonction API
- Les logs s'affichent en temps réel

---

**🎯 Votre application sera en ligne en 5-10 minutes maximum !**
