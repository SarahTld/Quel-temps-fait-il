<template>
  <div class="flex flex-col items-center py-10 px-4">
    <div class="w-full max-w-4xl">
      <h1 class="text-3xl font-bold text-blue-700 dark:text-blue-200 mb-8 text-center">Prévisions sur 5 jours</h1>
      
      <!-- Recherche -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-lg border border-white/40 dark:border-gray-700/40">
        <form class="flex gap-3" @submit.prevent="fetchForecast">
          <input 
            v-model="city" 
            type="text" 
            placeholder="Entrez une ville pour les prévisions..." 
            class="flex-1 px-4 py-3 rounded-full border border-blue-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-white/70 dark:bg-gray-700/70 placeholder:text-blue-300 dark:placeholder:text-gray-400 text-blue-900 dark:text-gray-100 font-medium"
          />
          <button 
            type="submit" 
            class="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow hover:scale-105 transition-all duration-200"
          >
            Prévisions
          </button>
          <button 
            type="button" 
            @click="getLocationForecast" 
            class="bg-white/80 dark:bg-gray-700/80 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-full shadow hover:bg-blue-100 dark:hover:bg-gray-600 border border-blue-200 dark:border-gray-600 transition-all duration-200"
            title="Prévisions de ma position"
          >
            📍
          </button>
        </form>
      </div>

      <!-- Erreur -->
      <div v-if="error" class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6 text-center">
        {{ error }}
      </div>

      <!-- Prévisions -->
      <div v-if="forecast" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div v-for="(day, index) in forecast" :key="index" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/40 dark:border-gray-700/40">
                      <div class="flex flex-col items-center text-center">
              <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-100 mb-2">{{ day.date }}</h3>
              <img :src="day.icon" :alt="day.description" class="w-12 h-12 mb-2" />
              <p class="text-sm text-blue-600 dark:text-blue-300 capitalize mb-2">{{ day.description }}</p>
              <div class="text-2xl font-bold text-blue-800 dark:text-blue-100 mb-1">{{ day.temp }}°C</div>
              <div class="text-xs text-blue-500 dark:text-blue-300 mb-3">
                Min: {{ day.tempMin }}°C | Max: {{ day.tempMax }}°C
              </div>
              <div class="text-xs text-blue-600 dark:text-blue-300 space-y-1">
                <div>Humidité: {{ day.humidity }}%</div>
                <div>Vent: {{ day.wind }} km/h</div>
              </div>
            </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else-if="!error" class="text-center text-blue-600 dark:text-blue-300">
        <p class="text-xl">Entrez une ville pour voir les prévisions météo</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const city = ref('')
const forecast = ref(null)
const error = ref('')

const config = useRuntimeConfig()
const API_KEY = config.public.openweatherKey
const API_URL = 'https://api.openweathermap.org/data/2.5/forecast'

const { getApiUnits, formatTemperature, formatWindSpeed } = useUnits()

onMounted(() => {
  // Écouter les changements d'unités
  window.addEventListener('units-changed', () => {
    if (forecast.value) {
      fetchForecast()
    }
  })
})

async function fetchForecast() {
  error.value = ''
  if (!city.value) return
  
  try {
    const url = `${API_URL}?q=${encodeURIComponent(city.value)}&appid=${API_KEY}&units=${getApiUnits()}&lang=fr`
    const res = await fetch(url)
    
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Ville non trouvée')
    }
    
    const data = await res.json()
    processForecastData(data)
  } catch (e) {
    forecast.value = null
    error.value = e.message || 'Erreur lors de la récupération des prévisions.'
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
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
      }
    }
  })
  
  forecast.value = Object.values(dailyData).slice(0, 5)
}

function getLocationForecast() {
  error.value = ''
  if (!navigator.geolocation) return
  
  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const { latitude, longitude } = pos.coords
      const res = await fetch(`${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${getApiUnits()}&lang=fr`)
      
      if (!res.ok) throw new Error('Ville non trouvée')
      
      const data = await res.json()
      city.value = data.city.name
      processForecastData(data)
    } catch (e) {
      forecast.value = null
      error.value = e.message || 'Erreur lors de la récupération des prévisions.'
    }
  }, () => {
    error.value = 'Impossible d\'obtenir la position.'
  })
}
</script> 