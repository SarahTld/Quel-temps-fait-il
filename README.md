# 🌤️ Quel temps fait-il ?

Une application météo moderne et intuitive développée avec Nuxt 3, offrant des prévisions météorologiques en temps réel avec une interface utilisateur élégante.

## ✨ Fonctionnalités

### 🏠 **Page d'accueil**
- **Météo actuelle** : Température, conditions, humidité, vent, pression, visibilité et indice UV
- **Prévisions heure par heure** : Prévisions détaillées pour les prochaines 18 heures
- **Prévisions sur 5 jours** : Vue d'ensemble des conditions météorologiques à venir
- **Géolocalisation automatique** : Détection automatique de votre position

### 🗺️ **Carte interactive**
- **Carte météo interactive** : Visualisez les conditions météorologiques sur une carte
- **Marqueurs de villes** : Cliquez sur les marqueurs pour voir les détails météo
- **Recherche de villes** : Recherchez n'importe quelle ville dans le monde
- **Prévisions détaillées** : Consultez les prévisions complètes pour chaque ville
- **Ajout aux favoris** : Sauvegardez vos villes préférées

### ⭐ **Favoris**
- **Gestion des villes favorites** : Ajoutez et supprimez des villes de vos favoris
- **Météo en temps réel** : Consultez la météo actuelle de vos villes favorites
- **Date et heure** : Affichage de la date et de l'heure de mise à jour
- **Navigation rapide** : Accédez directement à la carte depuis vos favoris

### ⚙️ **Paramètres**
- **Unités de température** : Celsius (°C) ou Fahrenheit (°F)
- **Thème** : Mode clair, sombre ou automatique
- **Gestion des données** : Exportez vos données ou effacez vos favoris

## 🛠️ Technologies utilisées

- **Frontend** : Nuxt 3, Vue 3, Tailwind CSS
- **API météo** : OpenWeatherMap
- **Cartes** : Leaflet.js
- **Stockage** : LocalStorage
- **Déploiement** : Compatible avec Vercel, Netlify, etc.

## 🚀 Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- npm, yarn, pnpm ou bun

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone [URL_DU_REPO]
cd Quel-temps-fait-il
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configuration de l'API**
   - Créez un compte sur [OpenWeatherMap](https://openweathermap.org/api)
   - Obtenez votre clé API gratuite
   - Créez un fichier `.env` à la racine du projet :
```env
NUXT_PUBLIC_OPENWEATHER_KEY=votre_cle_api_ici
```

4. **Lancer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

L'application sera accessible sur `http://localhost:3000`

## 📦 Build pour la production

```bash
npm run build
npm run preview
```

## 🎨 Fonctionnalités techniques

### Mode sombre/clair
- Détection automatique des préférences système
- Basculement manuel entre les thèmes
- Interface adaptative avec transitions fluides

### Responsive design
- Interface optimisée pour mobile, tablette et desktop
- Navigation adaptative
- Cartes interactives optimisées pour tous les écrans

### Performance
- Chargement optimisé des données météo
- Mise en cache intelligente
- Interface fluide et réactive

## 📱 Utilisation

### Navigation
- **Accueil** : Consultez la météo de votre position actuelle
- **Carte** : Explorez la météo mondiale avec la carte interactive
- **Favoris** : Gérez vos villes favorites
- **Paramètres** : Personnalisez l'application selon vos préférences

### Ajouter une ville aux favoris
1. Allez sur la page **Carte**
2. Cliquez sur un marqueur de ville ou recherchez une ville
3. Cliquez sur l'étoile ⭐ pour l'ajouter aux favoris
4. Retrouvez-la dans la page **Favoris**

### Changer les unités
1. Allez dans **Paramètres**
2. Sélectionnez Celsius ou Fahrenheit
3. Les changements s'appliquent instantanément

## 🔧 Configuration avancée

### Variables d'environnement
```env
# Clé API OpenWeatherMap (obligatoire)
NUXT_PUBLIC_OPENWEATHER_KEY=votre_cle_api

# URL de base (optionnel)
NUXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Personnalisation des thèmes
Les couleurs et styles peuvent être modifiés dans :
- `assets/css/tailwind.css` : Variables CSS personnalisées
- `tailwind.config.js` : Configuration Tailwind
- `composables/useTheme.ts` : Logique de gestion des thèmes

## 🙏 Remerciements

- [OpenWeatherMap](https://openweathermap.org/) pour l'API météo
- [Nuxt.js](https://nuxt.com/) pour le framework
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Leaflet](https://leafletjs.com/) pour les cartes interactives

---

## 👩‍💻 Auteur

**Développé avec ❤️ par Sarah T**

---
