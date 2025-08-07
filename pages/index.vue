<template>
  <div class="flex flex-col items-center pt-8 pb-16 px-2">
    <div class="w-full max-w-7xl flex flex-col md:flex-row gap-2" style="height: 80vh; min-height: 500px;">
      <!-- Colonne gauche : météo actuelle -->
              <div class="flex-[1.5] flex flex-col justify-start items-center">
        <div v-if="currentWeather" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-4 shadow-lg border border-white/40 dark:border-gray-700/40 flex flex-col justify-between max-w-md w-full">
          <div>
            <div class="flex flex-col items-center mb-4">
              <img :src="currentWeather.icon" :alt="currentWeather.description" class="w-20 h-20 mx-auto mb-2" />
              <div class="text-4xl font-bold text-blue-800 dark:text-blue-100">{{ currentWeather.temp }}</div>
              <div class="text-lg text-blue-600 dark:text-blue-300 capitalize">{{ currentWeather.description }}</div>
            </div>
            <div class="flex flex-col items-center mb-6">
              <h1 class="text-2xl font-bold text-blue-700 dark:text-blue-200">{{ currentWeather.city }}</h1>
              <div class="flex flex-col items-center mt-1">
                <span class="text-blue-500 dark:text-blue-300 text-sm">{{ currentWeather.date }}</span>
                <span class="text-blue-400 dark:text-blue-400 text-xs mt-1 mb-6">{{ currentWeather.time }}</span>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-center mb-2">
              <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-2">
                <div class="text-xs text-blue-600 dark:text-blue-300">Min</div>
                <div class="text-lg font-bold text-blue-800 dark:text-blue-100">{{ currentWeather.tempMin }}</div>
              </div>
              <div class="bg-red-50 dark:bg-red-900/30 rounded-lg p-2">
                <div class="text-xs text-red-600 dark:text-red-300">Max</div>
                <div class="text-lg font-bold text-red-800 dark:text-red-100">{{ currentWeather.tempMax }}</div>
              </div>
              <div class="bg-green-50 dark:bg-green-900/30 rounded-lg p-2 col-span-2">
                <div class="text-xs text-green-600 dark:text-green-300">Ressenti</div>
                <div class="text-lg font-bold text-green-800 dark:text-green-100">{{ currentWeather.feelsLike }}</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-center">
              <div class="bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                <div class="text-xs text-blue-600 dark:text-blue-300">Humidité</div>
                <div class="text-base font-semibold text-blue-800 dark:text-blue-100">{{ currentWeather.humidity }}%</div>
              </div>
              <div class="bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                <div class="text-xs text-blue-600 dark:text-blue-300">Vent</div>
                <div class="text-base font-semibold text-blue-800 dark:text-blue-100">{{ currentWeather.wind }}</div>
              </div>
              <div class="bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                <div class="text-xs text-blue-600 dark:text-blue-300">Pression</div>
                <div class="text-base font-semibold text-blue-800 dark:text-blue-100">{{ currentWeather.pressure }} hPa</div>
              </div>
              <div class="bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                <div class="text-xs text-blue-600 dark:text-blue-300">Visibilité</div>
                <div class="text-base font-semibold text-blue-800 dark:text-blue-100">{{ currentWeather.visibility }} km</div>
              </div>
              <div class="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-2 col-span-2">
                <div class="text-xs text-purple-600 dark:text-purple-300">Indice UV</div>
                <div class="text-lg font-bold text-purple-800 dark:text-purple-100">{{ currentWeather.uv }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Colonne droite : prévisions -->
      <div class="flex-[2] flex flex-col max-h-full">
        <div v-if="hourlyForecast" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/40 dark:border-gray-700/40 min-h-0 overflow-hidden flex flex-col justify-start max-h-[240px] ml-0">
          <h2 class="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2 text-center">Prévisions heure par heure</h2>
          <div class="grid grid-cols-6 gap-2 pb-2 items-end h-full">
            <div 
              v-for="(hour, index) in hourlyForecast" 
              :key="index"
              class="bg-white/60 dark:bg-gray-700/60 rounded-xl p-2 text-center flex flex-col justify-between h-full"
            >
              <div class="text-xs text-blue-600 dark:text-blue-400">{{ hour.time }}</div>
              <div class="flex flex-col items-center">
                <img :src="hour.icon" :alt="hour.description" class="w-8 h-8 mx-auto mb-1" />
                <div class="text-base font-bold text-blue-800 dark:text-blue-200 mb-1">{{ hour.temp }}</div>
                <div class="text-xs text-blue-600 dark:text-blue-400 capitalize">{{ hour.description }}</div>
                <div class="text-xs text-blue-500 dark:text-blue-300">{{ hour.wind }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="dailyForecast" class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 mt-10 shadow-lg border border-white/40 dark:border-gray-700/40 min-h-0 overflow-hidden max-h-[320px] flex flex-col justify-start">
          <h2 class="text-lg font-bold text-blue-700 dark:text-blue-300 mb-4 text-center">Prévisions sur 5 jours</h2>
          <div class="flex overflow-x-auto space-x-4 pb-2 items-end h-full justify-center">
            <div 
              v-for="(day, index) in dailyForecast" 
              :key="index"
              class="flex-shrink-0 bg-white/60 dark:bg-gray-700/60 rounded-xl p-4 text-center min-w-[100px] h-52 flex flex-col justify-between"
            >
              <div class="text-base font-semibold text-blue-800 dark:text-blue-200 mb-1">{{ day.date }}</div>
              <img :src="day.icon" :alt="day.description" class="w-10 h-10 mx-auto mb-1" />
              <div class="text-lg font-bold text-blue-800 dark:text-blue-200 mb-1">{{ day.temp }}</div>
              <div class="text-xs text-blue-600 dark:text-blue-400 capitalize mb-1">{{ day.description }}</div>
              <div class="flex justify-center space-x-1 text-xs">
                <span class="text-red-600 dark:text-red-400">{{ day.tempMax }}</span>
                <span class="text-blue-600 dark:text-blue-400">{{ day.tempMin }}</span>
              </div>
              <div class="text-xs text-blue-500 dark:text-blue-300 mt-1">
                <div>Humidité: {{ day.humidity }}%</div>
                <div>Vent: {{ day.wind }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!-- État de chargement -->
    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-xl text-blue-600 dark:text-blue-400">Localisation en cours...</p>
    </div>
    <!-- État d'erreur -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
      <p class="text-lg font-semibold mb-2">{{ error }}</p>
      <button 
        @click="getLocation" 
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Réessayer
      </button>
    </div>
    <!-- État vide -->
    <div v-if="!currentWeather && !loading && !error" class="text-center py-20">
      <p class="text-xl text-blue-600 dark:text-blue-400 mb-4">Autorisez la géolocalisation pour voir la météo</p>
      <button 
        @click="getLocation" 
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Autoriser la localisation
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentWeather = ref(null)
const hourlyForecast = ref(null)
const dailyForecast = ref(null)
const weatherAlerts = ref(null)
const loading = ref(false)
const error = ref('')

const config = useRuntimeConfig()
const API_KEY = config.public.openweatherKey
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'
const ONECALL_URL = 'https://api.openweathermap.org/data/2.5/onecall'

const { getApiUnits, formatTemperature, formatWindSpeed } = useUnits()

onMounted(() => {
  // Géolocalisation automatique au chargement
  getLocation()
  
  // Écouter les changements d'unités
  window.addEventListener('units-changed', () => {
    if (currentWeather.value) {
      getLocation()
    }
  })
})

async function getLocation() {
  loading.value = true
  error.value = ''
  
  if (!navigator.geolocation) {
    error.value = 'La géolocalisation n\'est pas supportée par votre navigateur'
    loading.value = false
    return
  }
  
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const { latitude, longitude } = pos.coords
        await Promise.all([
          fetchCurrentWeather(latitude, longitude),
          fetchForecast(latitude, longitude),
          fetchWeatherAlerts(latitude, longitude)
        ])
      } catch (e) {
        error.value = 'Erreur lors de la récupération de la météo'
        console.error(e)
      } finally {
        loading.value = false
      }
    },
    () => {
      error.value = 'Impossible d\'obtenir votre position. Vérifiez les permissions de géolocalisation.'
      loading.value = false
    }
  )
}

async function fetchCurrentWeather(lat, lon) {
  const url = `${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${getApiUnits()}&lang=fr`
  const res = await fetch(url)
  
  if (!res.ok) throw new Error('Erreur API météo')
  
  const data = await res.json()
  const now = new Date()
  currentWeather.value = {
    city: data.name,
    temp: formatTemperature(data.main.temp),
    tempMin: formatTemperature(data.main.temp_min),
    tempMax: formatTemperature(data.main.temp_max),
    feelsLike: formatTemperature(data.main.feels_like),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    wind: formatWindSpeed(data.wind.speed),
    visibility: Math.round(data.visibility / 1000),
    uv: Math.round(data.main.temp / 10), // Approximation UV
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    date: now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
    time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
}

async function fetchForecast(lat, lon) {
  const url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${getApiUnits()}&lang=fr`
  const res = await fetch(url)
  
  if (!res.ok) throw new Error('Erreur API prévisions')
  
  const data = await res.json()
  
  // Prévisions heure par heure (prochaines 24h)
  const now = new Date()
  // Cherche la première tranche >= maintenant
  const firstIndex = data.list.findIndex(item => new Date(item.dt * 1000) >= now)
  
  // Si aucune tranche future n'est trouvée, prendre les premières disponibles
  const startIndex = firstIndex >= 0 ? firstIndex : 0
  const next6Hours = data.list.slice(startIndex, startIndex + 6) // 6 tranches de 3h = 18h
  
  hourlyForecast.value = next6Hours.map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    temp: formatTemperature(item.main.temp),
    description: item.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
    wind: formatWindSpeed(item.wind.speed)
  }))
  
  console.log('Prévisions heure par heure:', hourlyForecast.value)
  
  // Prévisions sur 5 jours
  const dailyData = {}
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000)
    const dayKey = date.toLocaleDateString('fr-FR', { weekday: 'short' })
    const fullDate = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    if (!dailyData[dayKey + fullDate]) {
      dailyData[dayKey + fullDate] = {
        date: dayKey,
        fullDate,
        temp: formatTemperature(item.main.temp),
        tempMin: formatTemperature(item.main.temp_min),
        tempMax: formatTemperature(item.main.temp_max),
        humidity: item.main.humidity,
        wind: formatWindSpeed(item.wind.speed),
        description: item.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
      }
    } else {
      // Mettre à jour min/max en utilisant les valeurs numériques
      const currentMin = parseFloat(dailyData[dayKey + fullDate].tempMin.replace(/[^\d.-]/g, ''))
      const currentMax = parseFloat(dailyData[dayKey + fullDate].tempMax.replace(/[^\d.-]/g, ''))
      const newMin = Math.min(currentMin, item.main.temp_min)
      const newMax = Math.max(currentMax, item.main.temp_max)
      
      dailyData[dayKey + fullDate].tempMin = formatTemperature(newMin)
      dailyData[dayKey + fullDate].tempMax = formatTemperature(newMax)
    }
  })
  
  dailyForecast.value = Object.values(dailyData).slice(0, 5)
}

async function fetchWeatherAlerts(lat, lon) {
  const url = `${ONECALL_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=fr&units=metric`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Erreur API alertes')
    const data = await res.json()
    weatherAlerts.value = data.alerts && data.alerts.length ? data.alerts : null
  } catch (e) {
    weatherAlerts.value = null
  }
}
</script> 