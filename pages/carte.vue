<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- En-tête avec titre -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">
          Carte Météo Interactive
        </h1>
      </div>

      <!-- Section principale avec carte et détails -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Carte météo (2/3 de l'écran) -->
        <div class="lg:col-span-2">
          <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 dark:border-gray-700/50">
            <WeatherMap @city-selected="handleCitySelected" ref="weatherMap" />
          </div>
        </div>

        <!-- Panneau latéral avec informations et détails -->
        <div class="lg:col-span-1">
          <!-- Guide d'utilisation -->
          <div class="bg-blue-50 dark:bg-blue-900/20 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-blue-700/40 mb-6">
            <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
              <span>💡</span> Comment utiliser
            </h3>
            <div class="space-y-3 text-sm text-blue-700 dark:text-blue-300">
              <div class="flex items-start gap-3">
                <span class="text-lg">📍</span>
                <div>
                  <strong>Ma position :</strong> Bouton 📍 pour centrer sur votre position
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-lg">🌡️</span>
                <div>
                  <strong>Marqueurs :</strong> Cliquez pour voir les détails météo
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-lg">👆</span>
                <div>
                  <strong>Cliquez partout :</strong> Obtenir la météo à n'importe quel endroit
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-lg">🔍</span>
                <div>
                  <strong>Recherche :</strong> Tapez le nom d'une ville ci-dessous
                </div>
              </div>
            </div>
          </div>

          <!-- Barre de recherche -->
          <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 dark:border-gray-700/50 mb-6">
            <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
              <span>🔍</span> Rechercher une ville
            </h3>
            <div class="flex gap-2">
              <div class="flex-1 relative">
                <input 
                  v-model="searchCity" 
                  type="text" 
                  placeholder="Paris, Londres, Tokyo..." 
                  class="w-full px-3 py-2 pl-8 rounded-lg border border-blue-200 dark:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 dark:bg-gray-700/80 placeholder:text-blue-400 dark:placeholder:text-blue-500 text-blue-900 dark:text-blue-100 font-medium transition-all duration-200 text-sm"
                  @keyup.enter="searchCityWeather"
                />
                <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-500 text-sm">🔍</span>
              </div>
              <button 
                @click="searchCityWeather" 
                class="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold shadow hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-1 text-sm"
                :disabled="!searchCity.trim()"
                :class="{ 'opacity-50 cursor-not-allowed': !searchCity.trim() }"
              >
                <span>→</span>
              </button>
            </div>
          </div>

          <!-- Ville sélectionnée -->
          <div v-if="selectedCity" class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 dark:border-gray-700/50">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-200">
                📍 {{ selectedCity }}
              </h3>
              <div class="flex gap-2">
                <button 
                  @click="toggleFavorite"
                  :class="isFavorite ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 dark:from-yellow-500 dark:to-yellow-600 dark:hover:from-yellow-600 dark:hover:to-yellow-700 text-yellow-900 dark:text-yellow-100 shadow-lg' : 'bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white'"
                  class="px-3 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200 text-sm flex items-center gap-1"
                  :title="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                >
                  <span class="text-lg">{{ isFavorite ? '★' : '☆' }}</span>
                  <span class="hidden sm:inline">{{ isFavorite ? 'Favori' : 'Ajouter' }}</span>
                </button>
                <button 
                  @click="showDetails = !showDetails" 
                  class="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200 text-sm"
                >
                  {{ showDetails ? 'Masquer' : 'Voir' }} détails
                </button>
              </div>
            </div>
            
            <!-- Aperçu rapide -->
            <div v-if="weatherData && !showDetails" class="text-center py-4">
              <div class="text-4xl mb-2">{{ getWeatherEmoji(weatherData.weather[0].icon) }}</div>
              <div class="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-1">
                {{ formatTemperature(weatherData.main.temp) }}
              </div>
              <div class="text-blue-600 dark:text-blue-400 capitalize text-sm">
                {{ weatherData.weather[0].description }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Détails météo complets (affichage en plein écran) -->
      <div v-if="showDetails && weatherData" class="mt-8">
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 dark:border-gray-700/50">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-200">
              📍 Détails météo pour {{ selectedCity }}
            </h2>
            <button 
              @click="showDetails = false" 
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200"
            >
              ✕ Fermer
            </button>
          </div>
          
          <!-- Cartes de détails -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <!-- Conditions actuelles -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
              <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
                <span>🌤️</span> Conditions actuelles
              </h3>
              <div class="flex items-center space-x-4">
                <div class="text-5xl">{{ getWeatherEmoji(weatherData.weather[0].icon) }}</div>
                <div>
                  <div class="text-3xl font-bold text-blue-800 dark:text-blue-200">{{ formatTemperature(weatherData.main.temp) }}</div>
                  <div class="text-blue-600 dark:text-blue-300 capitalize text-lg">{{ weatherData.weather[0].description }}</div>
                </div>
              </div>
            </div>

            <!-- Températures -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 border border-green-200 dark:border-green-700">
              <h3 class="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                <span>🌡️</span> Températures
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-green-700 dark:text-green-300">Minimale</span>
                  <span class="font-bold text-green-800 dark:text-green-200 text-lg">{{ formatTemperature(weatherData.main.temp_min) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-green-700 dark:text-green-300">Maximale</span>
                  <span class="font-bold text-green-800 dark:text-green-200 text-lg">{{ formatTemperature(weatherData.main.temp_max) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-green-700 dark:text-green-300">Ressentie</span>
                  <span class="font-bold text-green-800 dark:text-green-200 text-lg">{{ formatTemperature(weatherData.main.feels_like) }}</span>
                </div>
              </div>
            </div>

            <!-- Détails -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
              <h3 class="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4 flex items-center gap-2">
                <span>📊</span> Détails
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-purple-700 dark:text-purple-300">Humidité</span>
                  <span class="font-bold text-purple-800 dark:text-purple-200 text-lg">{{ weatherData.main.humidity }}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-purple-700 dark:text-purple-300">Pression</span>
                  <span class="font-bold text-purple-800 dark:text-purple-200 text-lg">{{ weatherData.main.pressure }} hPa</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-purple-700 dark:text-purple-300">Vent</span>
                  <span class="font-bold text-purple-800 dark:text-purple-200 text-lg">{{ formatWindSpeed(weatherData.wind.speed) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Prévisions sur 5 jours -->
          <div>
            <h3 class="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-6 flex items-center gap-2">
              <span>📅</span> Prévisions sur 5 jours
            </h3>
            <div v-if="forecastData" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <div v-for="(day, index) in forecastData" :key="index" class="bg-white/80 dark:bg-gray-700/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/50 dark:border-gray-600/50 hover:shadow-xl transition-all duration-200">
                <div class="text-center">
                  <div class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">{{ day.date }}</div>
                  <div class="text-3xl mb-3">{{ getWeatherEmoji(day.icon) }}</div>
                  <div class="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">{{ day.temp }}</div>
                  <div class="text-xs text-blue-600 dark:text-blue-400 mb-3 capitalize">{{ day.description }}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                      <div>Min: {{ day.tempMin }}</div>
                  <div>Max: {{ day.tempMax }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-blue-600 dark:text-blue-400 py-8">
              <div class="text-2xl mb-2">⏳</div>
              Chargement des prévisions...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import WeatherMap from '@/components/WeatherMap.vue'

const selectedCity = ref('')
const searchCity = ref('')
const showDetails = ref(false)
const weatherData = ref(null)
const forecastData = ref(null)
const weatherMap = ref(null)
const isFavorite = ref(false)

const config = useRuntimeConfig()
const API_KEY = config.public.openweatherKey

const { getApiUnits, formatTemperature, formatWindSpeed } = useUnits()

onMounted(() => {
  // Écouter les changements d'unités
  window.addEventListener('units-changed', () => {
    if (weatherData.value) {
      fetchWeatherForCity(selectedCity.value)
    }
  })
})

function handleCitySelected(cityName) {
  selectedCity.value = cityName
  showDetails.value = false
  weatherData.value = null
  forecastData.value = null
  
  // Vérifier si la ville est dans les favoris
  checkIfFavorite(cityName)
  
  // Récupérer les données météo pour la ville sélectionnée
  fetchWeatherForCity(cityName)
}

// Vérifier les paramètres d'URL au chargement
onMounted(() => {
  const route = useRoute()
  if (route.query.city) {
    const cityFromUrl = String(route.query.city)
    searchCity.value = cityFromUrl
    searchCityWeather()
  }
})

async function searchCityWeather() {
  if (!searchCity.value.trim()) return
  
  try {
    // Rechercher les coordonnées de la ville
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchCity.value)}&limit=1&appid=${API_KEY}`
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()
    
    if (geocodeData.length > 0) {
      const city = geocodeData[0]
      selectedCity.value = city.name
      showDetails.value = false
      weatherData.value = null
      forecastData.value = null
      
      // Vérifier si la ville est dans les favoris
      checkIfFavorite(city.name)
      
      // Centrer la carte sur la ville recherchée
      if (weatherMap.value && weatherMap.value.map) {
        weatherMap.value.map.setView([city.lat, city.lon], 10)
      }
      
      // Récupérer les données météo
      await fetchWeatherForCity(city.name, city.lat, city.lon)
    } else {
      alert('Ville non trouvée. Veuillez vérifier l\'orthographe.')
    }
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
    alert('Erreur lors de la recherche de la ville.')
  }
}

async function fetchWeatherForCity(cityName, lat = null, lon = null) {
  try {
    let weatherUrl
    let forecastUrl
    
    if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${getApiUnits()}&lang=fr`
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${getApiUnits()}&lang=fr`
    } else {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=${getApiUnits()}&lang=fr`
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=${getApiUnits()}&lang=fr`
    }
    
    // Récupérer les données météo actuelles
    const weatherResponse = await fetch(weatherUrl)
    if (weatherResponse.ok) {
      weatherData.value = await weatherResponse.json()
      // Vérifier les favoris avec le nom exact de la ville retourné par l'API
      checkIfFavorite(weatherData.value.name)
    }
    
    // Récupérer les prévisions
    const forecastResponse = await fetch(forecastUrl)
    if (forecastResponse.ok) {
      const forecastRaw = await forecastResponse.json()
      forecastData.value = processForecastData(forecastRaw)
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données météo:', error)
  }
}

function processForecastData(data) {
  const dailyData = {}
  
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000)
    const dayKey = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = {
        date: dayKey,
        temp: formatTemperature(item.main.temp),
        tempMin: formatTemperature(item.main.temp_min),
        tempMax: formatTemperature(item.main.temp_max),
        humidity: item.main.humidity,
        wind: formatWindSpeed(item.wind.speed),
        description: item.weather[0].description,
        icon: item.weather[0].icon
      }
    }
  })
  
  return Object.values(dailyData).slice(0, 5)
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

// Fonctions pour gérer les favoris
function loadFavorites() {
  const saved = localStorage.getItem('weather-favorites')
  return saved ? JSON.parse(saved) : []
}

function saveFavorites(favorites) {
  localStorage.setItem('weather-favorites', JSON.stringify(favorites))
}

function checkIfFavorite(cityName) {
  const favorites = loadFavorites()
  isFavorite.value = favorites.some(fav => fav.name === cityName)
}

function toggleFavorite() {
  if (!selectedCity.value || !weatherData.value) return
  
  const favorites = loadFavorites()
  const cityData = {
    name: selectedCity.value,
    lat: weatherData.value.coord.lat,
    lon: weatherData.value.coord.lon,
    country: weatherData.value.sys.country,
    addedAt: new Date().toISOString()
  }
  
  if (isFavorite.value) {
    // Retirer des favoris
    const updatedFavorites = favorites.filter(fav => fav.name !== selectedCity.value)
    saveFavorites(updatedFavorites)
    isFavorite.value = false
  } else {
    // Ajouter aux favoris
    favorites.push(cityData)
    saveFavorites(favorites)
    isFavorite.value = true
  }
}
</script> 