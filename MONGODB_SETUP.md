# Configuration MongoDB pour PlanEat

## 🚀 Installation et Configuration

### 1. Installer MongoDB

#### Sur macOS (avec Homebrew) :
```bash
brew tap mongodb/brew
brew install mongodb-community
```

#### Sur Ubuntu/Debian :
```bash
sudo apt-get install -y mongodb
```

#### Sur Windows :
Téléchargez MongoDB Community Server depuis [mongodb.com](https://www.mongodb.com/try/download/community)

### 2. Démarrer MongoDB

#### Sur macOS :
```bash
brew services start mongodb/brew/mongodb-community
```

#### Sur Ubuntu/Debian :
```bash
sudo systemctl start mongodb
```

#### Sur Windows :
Démarrez le service MongoDB depuis les Services Windows

### 3. Vérifier l'installation

Connectez-vous à MongoDB :
```bash
mongosh
```

### 4. Configuration des variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/plan-eat

# JWT Secret (changez ceci en production)
JWT_SECRET=votre-secret-jwt-tres-securise-changez-en-production

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-nextauth-tres-securise
```

### 5. Démarrer l'application

```bash
npm run dev
```

## 🎯 Utilisation

### Inscription
- Allez sur `http://localhost:3000/login?mode=signup`
- Remplissez le formulaire d'inscription
- Votre compte sera créé dans MongoDB

### Connexion
- Allez sur `http://localhost:3000/login`
- Connectez-vous avec vos identifiants

### Base de données
- Les utilisateurs sont stockés dans la collection `users`
- Les mots de passe sont hachés avec bcrypt
- Les sessions utilisent JWT

## 🔧 Structure de la base de données

```javascript
// Collection: users
{
  _id: ObjectId,
  email: String (unique),
  password: String (haché),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🛡️ Sécurité

- Mots de passe hachés avec bcrypt (12 rounds)
- Validation des emails et mots de passe
- Tokens JWT avec expiration (7 jours)
- Protection contre les injections

## 🚨 Dépannage

### Erreur de connexion MongoDB
```bash
# Vérifiez que MongoDB est démarré
brew services list | grep mongodb
# ou
sudo systemctl status mongodb
```

### Port déjà utilisé
Si le port 27017 est occupé :
```bash
# Trouvez le processus
lsof -i :27017
# Arrêtez-le
kill -9 <PID>
```

### Base de données corrompue
```bash
# Supprimez et recréez la base
mongosh
use plan-eat
db.dropDatabase()
```
