# 🚀 Guide de déploiement - GitHub Pages

Ce guide vous explique comment déployer l'application "Quel temps fait-il ?" sur GitHub Pages.

## 📋 Prérequis

1. **Repository GitHub** : Votre code doit être sur GitHub
2. **Clé API OpenWeatherMap** : Obtenez une clé gratuite sur [OpenWeatherMap](https://openweathermap.org/api)

## ⚙️ Configuration

### 1. Ajouter la clé API comme secret GitHub

1. Allez dans votre repository GitHub
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Secrets and variables** → **Actions**
4. Cliquez sur **New repository secret**
5. Nom : `OPENWEATHER_API_KEY`
6. Valeur : Votre clé API OpenWeatherMap
7. Cliquez sur **Add secret**

### 2. Activer GitHub Pages

1. Dans **Settings** → **Pages**
2. **Source** : Sélectionnez **Deploy from a branch**
3. **Branch** : Sélectionnez `gh-pages` et `/ (root)`
4. Cliquez sur **Save**

### 3. Configurer les permissions GitHub Actions

1. Dans **Settings** → **Actions** → **General**
2. **Workflow permissions** : Sélectionnez **Read and write permissions**
3. Cliquez sur **Save**

## 🔄 Déploiement automatique

Le workflow GitHub Actions se déclenche automatiquement à chaque push sur la branche `main` ou `master`.

### Étapes du workflow :

1. **Checkout** : Récupération du code
2. **Setup Node.js** : Installation de Node.js 18
3. **Install dependencies** : Installation des dépendances npm
4. **Build application** : Génération de l'application statique
5. **Deploy** : Déploiement sur GitHub Pages

## 🌐 URL de l'application

Une fois déployée, votre application sera accessible à :
```
https://[votre-username].github.io/Quel-temps-fait-il/
```

## 🔧 Configuration personnalisée

### Changer le nom du repository

Si votre repository a un nom différent, modifiez dans `nuxt.config.ts` :

```typescript
app: {
  baseURL: process.env.NODE_ENV === 'production' ? '/[votre-nom-repo]/' : '/',
  buildAssetsDir: '/assets/'
}
```

### Variables d'environnement

Le workflow utilise automatiquement la clé API stockée dans les secrets GitHub.

## 🐛 Dépannage

### Erreur de build
- Vérifiez que la clé API est correctement configurée
- Consultez les logs dans **Actions** → **Deploy to GitHub Pages**

### Erreur 404
- Vérifiez que GitHub Pages est activé
- Attendez quelques minutes après le déploiement

### Problèmes de CORS
- L'application est configurée pour fonctionner en mode statique
- Toutes les requêtes API passent directement depuis le navigateur

## 📝 Notes importantes

- **Mode statique** : L'application est générée en mode statique (SSR désactivé)
- **Base URL** : Configurée automatiquement pour GitHub Pages
- **Assets** : Optimisés pour le déploiement statique
- **API** : Utilise directement l'API OpenWeatherMap depuis le navigateur

---

**Votre application sera automatiquement déployée à chaque push ! 🎉** 