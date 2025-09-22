# Configuration OpenAI API

## 1. Obtenir une clé API OpenAI

1. Allez sur [OpenAI Platform](https://platform.openai.com/)
2. Créez un compte ou connectez-vous
3. Allez dans "API Keys" dans le menu
4. Cliquez sur "Create new secret key"
5. Copiez la clé générée

## 2. Ajouter la clé à votre fichier .env.local

Ajoutez cette ligne à votre fichier `.env.local` :

```env
# OpenAI API Key
OPENAI_API_KEY=sk-votre-cle-api-ici
```

## 3. Crédits OpenAI

- L'API OpenAI utilise un système de paiement basé sur l'utilisation
- Pour les tests, vous pouvez commencer avec quelques dollars de crédit
- Le modèle GPT-3.5-turbo est relativement économique

## 4. Modèles disponibles

- `gpt-3.5-turbo` : Rapide et économique (recommandé)
- `gpt-4` : Plus intelligent mais plus cher
- `gpt-4-turbo` : Équilibre entre performance et coût

## 5. Sécurité

⚠️ **Important** : Ne jamais commiter votre clé API dans le code source !
- Utilisez toujours les variables d'environnement
- La clé API est déjà configurée dans `.env.local` qui est ignoré par Git
