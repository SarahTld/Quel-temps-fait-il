<template>
  <div class="flex flex-col items-center py-10 px-4">
    <div class="w-full max-w-4xl">
      <h1 class="text-3xl font-bold text-blue-700 mb-8 text-center">Mes villes favorites</h1>
      
      <!-- Ajouter une ville -->
      <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-lg border border-white/40">
        <form class="flex gap-3" @submit.prevent="addFavorite">
          <input 
            v-model="newCity" 
            type="text" 
            placeholder="Ajouter une ville favorite..." 
            class="flex-1 px-4 py-3 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/70 placeholder:text-blue-300 text-blue-900 font-medium"
          />
          <button 
            type="submit" 
            class="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-full font-semibold shadow hover:scale-105 transition-all duration-200"
          >
            Ajouter
          </button>
        </form>
      </div>

      <!-- Erreur -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
        {{ error }}
      </div>

      <!-- Liste des favoris -->
      <div v-if="favorites.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(favorite, index) in favorites" 
          :key="index" 
          class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold text-blue-800">{{ favorite.name }}</h3>
            <button 
              @click="removeFavorite(index)" 
              class="text-red-500 hover:text-red-700 transition-colors"
              title="Supprimer des favoris"
            >
              ❌
            </button>
          </div>
          
          <div v-if="favorite.weather" class="text-center">
            <img :src="favorite.weather.icon" :alt="favorite.weather.description" class="w-16 h-16 mx-auto mb-2" />
            <div class="text-2xl font-bold text-blue-800 mb-1">{{ favorite.weather.temp }}°C</div>
            <div class="text-blue-600 capitalize mb-2">{{ favorite.weather.description }}</div>
            <div class="text-sm text-blue-500">
              Humidité: {{ favorite.weather.humidity }}% | Vent: {{ favorite.weather.wind }} km/h
            </div>
          </div>
          
          <div v-else class="text-center text-blue-500">
            <div class="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            Chargement...
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="text-center text-blue-600">
        <div class="text-6xl mb-4">⭐</div>
        <p class="text-xl mb-4">Aucune ville favorite</p>
        <p class="text-blue-500">Ajoutez des villes pour voir leur météo rapidement</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const newCity = ref('')
const favorites = ref([])
const error = ref('')

const config = useRuntimeConfig()
const API_KEY = config.public.openweatherKey
const API_URL = 'https://api.openweathermap.org/data/2.5/weather'

onMounted(() => {
  loadFavorites()
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

async function addFavorite() {
  if (!newCity.value.trim()) return
  
  error.value = ''
  
  try {
    // Vérifier que la ville existe
    const url = `${API_URL}?q=${encodeURIComponent(newCity.value)}&appid=${API_KEY}&units=metric&lang=fr`
    const res = await fetch(url)
    
    if (!res.ok) {
      throw new Error('Ville non trouvée')
    }
    
    const data = await res.json()
    const cityName = data.name
    
    // Vérifier si déjà dans les favoris
    if (favorites.value.some(f => f.name.toLowerCase() === cityName.toLowerCase())) {
      error.value = 'Cette ville est déjà dans vos favoris'
      return
    }
    
    // Ajouter aux favoris
    const newFavorite = {
      name: cityName,
      weather: null
    }
    
    favorites.value.push(newFavorite)
    saveFavorites()
    
    // Charger la météo
    await fetchWeatherForFavorite(newFavorite)
    
    newCity.value = ''
  } catch (e) {
    error.value = e.message || 'Erreur lors de l\'ajout de la ville'
  }
}

async function fetchWeatherForFavorite(favorite) {
  try {
    const url = `${API_URL}?q=${encodeURIComponent(favorite.name)}&appid=${API_KEY}&units=metric&lang=fr`
    const res = await fetch(url)
    
    if (res.ok) {
      const data = await res.json()
      favorite.weather = {
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
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
</script> 