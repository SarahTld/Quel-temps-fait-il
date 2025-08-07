<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="container mx-auto px-4 py-8">
              <h1 class="text-4xl font-bold text-blue-700 dark:text-blue-200 mb-8 text-center">
          Mes Villes Favorites
        </h1>
      


      <!-- Erreur -->
      <div v-if="error" class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-center">
        {{ error }}
      </div>

      <!-- Liste des favoris -->
      <div v-if="favorites.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(favorite, index) in favorites" 
          :key="index" 
          class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 group"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-semibold text-blue-800 dark:text-blue-100">{{ favorite.name }}</h3>
              <p v-if="favorite.country" class="text-sm text-blue-600 dark:text-blue-300">{{ favorite.country }}</p>
            </div>
            <div class="flex gap-2">
              <button 
                @click="viewOnMap(favorite)"
                class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1"
                title="Voir sur la carte"
              >
                🗺️
              </button>
              <button 
                @click="removeFavorite(index)" 
                class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
                title="Supprimer des favoris"
              >
                ❌
              </button>
            </div>
          </div>
          
          <div v-if="favorite.weather" class="text-center">
            <div class="text-4xl mb-3">{{ getWeatherEmoji(favorite.weather.icon) }}</div>
            <div class="text-3xl font-bold text-blue-800 dark:text-blue-100 mb-2">{{ favorite.weather.temp }}</div>
            <div class="text-blue-600 dark:text-blue-300 capitalize mb-3 text-lg">{{ favorite.weather.description }}</div>
            <div class="text-xs text-blue-500 dark:text-blue-400 mb-3">
              {{ favorite.weather.date }}<br>{{ favorite.weather.time }}
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2">
                <div class="text-blue-700 dark:text-blue-200">Humidité</div>
                <div class="font-semibold text-blue-800 dark:text-blue-100">{{ favorite.weather.humidity }}%</div>
              </div>
              <div class="bg-green-50 dark:bg-green-900/30 rounded-lg p-2">
                <div class="text-green-700 dark:text-green-200">Vent</div>
                <div class="font-semibold text-green-800 dark:text-green-100">{{ favorite.weather.wind }} km/h</div>
              </div>
            </div>
            <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Ajouté le {{ formatDate(favorite.addedAt) }}
            </div>
          </div>
          
          <div v-else class="text-center text-blue-600 dark:text-blue-300 py-8">
            <div class="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            Chargement...
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="text-center text-blue-600 dark:text-blue-300 py-16">
        <h2 class="text-2xl font-bold mb-4">Aucune ville favorite</h2>
        <p class="text-lg mb-6">Commencez par ajouter des villes depuis la carte météo</p>
        <NuxtLink 
          to="/carte" 
          class="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
        >
          Aller à la carte
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const favorites = ref([])
const error = ref('')

const config = useRuntimeConfig()
const API_KEY = config.public.openweatherKey
const API_URL = 'https://api.openweathermap.org/data/2.5/weather'

const { getApiUnits, formatTemperature, formatWindSpeed } = useUnits()

onMounted(() => {
  loadFavorites()
  
  // Écouter les changements d'unités
  window.addEventListener('units-changed', () => {
    if (favorites.value.length > 0) {
      favorites.value.forEach(favorite => {
        fetchWeatherForFavorite(favorite)
      })
    }
  })
})

function loadFavorites() {
  const saved = localStorage.getItem('weather-favorites')
  if (saved) {
    favorites.value = JSON.parse(saved)
    // Charger la météo pour chaque ville
    favorites.value.forEach(favorite => {
      fetchWeatherForFavorite(favorite)
    })
  }
}

function saveFavorites() {
  localStorage.setItem('weather-favorites', JSON.stringify(favorites.value))
}

async function fetchWeatherForFavorite(favorite) {
  try {
    const url = `${API_URL}?q=${encodeURIComponent(favorite.name)}&appid=${API_KEY}&units=${getApiUnits()}&lang=fr`
    const res = await fetch(url)
    
    if (res.ok) {
      const data = await res.json()
      const now = new Date()
      favorite.weather = {
        temp: formatTemperature(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind: formatWindSpeed(data.wind.speed),
        icon: data.weather[0].icon,
        date: now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
        time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }
    }
  } catch (e) {
    console.error('Erreur lors du chargement de la météo pour', favorite.name, e)
  }
}

function removeFavorite(index) {
  favorites.value.splice(index, 1)
  saveFavorites()
}

function viewOnMap(favorite) {
  // Naviguer vers la carte avec la ville sélectionnée
  navigateTo(`/carte?city=${encodeURIComponent(favorite.name)}`)
}

function getWeatherEmoji(icon) {
  const emojiMap = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  }
  return emojiMap[icon] || '🌤️'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}
</script> 