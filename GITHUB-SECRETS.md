# Configuration des Secrets GitHub

Pour que les tests d'intégration fonctionnent sur GitHub Actions, vous devez ajouter les secrets suivants dans votre dépôt GitHub :

## Étapes

1. Allez dans votre dépôt GitHub
2. Cliquez sur **Settings**
3. Allez dans **Secrets and variables** > **Actions**
4. Cliquez sur **New repository secret**

## Secrets à ajouter

### 1. MONGODB_URI
```
mongodb+srv://gadnadjar:ALkHKG4vbsf9kbwm@planeat.qxfo1cb.mongodb.net/?retryWrites=true&w=majority&appName=PlanEat
```

### 2. JWT_SECRET
```
your-test-jwt-secret-here
```

## Après l'ajout
test tests s'exécuteront automatiquement à chaque push sur les branches `main` et `develop`.
