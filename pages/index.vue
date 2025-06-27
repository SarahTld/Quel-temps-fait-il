<template>
  <div class="flex flex-col items-center py-8 px-2">
    <div class="w-full max-w-7xl flex flex-col md:flex-row gap-2" style="height: 80vh; min-height: 500px;">
      <!-- Colonne gauche : météo actuelle -->
      <div class="flex-[1.5] flex flex-col justify-center items-center">
        <div v-if="currentWeather" class="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-lg border border-white/40 h-full flex flex-col justify-between max-w-md w-full">
          <div>
            <div class="flex flex-col items-center mb-4">
              <img :src="currentWeather.icon" :alt="currentWeather.description" class="w-20 h-20 mx-auto mb-2" />
              <div class="text-4xl font-bold text-blue-800">{{ currentWeather.temp }}°C</div>
              <div class="text-lg text-blue-600 capitalize">{{ currentWeather.description }}</div>
            </div>
            <div class="flex flex-col items-center mb-6">
              <h1 class="text-2xl font-bold text-blue-700">{{ currentWeather.city }}</h1>
              <div class="flex flex-col items-center mt-1">
                <span class="text-blue-500 text-sm">{{ currentWeather.date }}</span>
                <span class="text-blue-400 text-xs mt-1 mb-6">{{ currentWeather.time }}</span>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-center mb-2">
              <div class="bg-blue-50 rounded-lg p-2">
                <div class="text-xs text-blue-600">Min</div>
                <div class="text-lg font-bold text-blue-800">{{ currentWeather.tempMin }}°C</div>
              </div>
              <div class="bg-red-50 rounded-lg p-2">
                <div class="text-xs text-red-600">Max</div>
                <div class="text-lg font-bold text-red-800">{{ currentWeather.tempMax }}°C</div>
              </div>
              <div class="bg-green-50 rounded-lg p-2 col-span-2">
                <div class="text-xs text-green-600">Ressenti</div>
                <div class="text-lg font-bold text-green-800">{{ currentWeather.feelsLike }}°C</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-center">
              <div class="bg-white/50 rounded-lg p-2">
                <div class="text-xs text-blue-600">Humidité</div>
                <div class="text-base font-semibold text-blue-800">{{ currentWeather.humidity }}%</div>
              </div>
              <div class="bg-white/50 rounded-lg p-2">
                <div class="text-xs text-blue-600">Vent</div>
                <div class="text-base font-semibold text-blue-800">{{ currentWeather.wind }} km/h</div>
              </div>
              <div class="bg-white/50 rounded-lg p-2">
                <div class="text-xs text-blue-600">Pression</div>
                <div class="text-base font-semibold text-blue-800">{{ currentWeather.pressure }} hPa</div>
              </div>
              <div class="bg-white/50 rounded-lg p-2">
                <div class="text-xs text-blue-600">Visibilité</div>
                <div class="text-base font-semibold text-blue-800">{{ currentWeather.visibility }} km</div>
              </div>
              <div class="bg-purple-50 rounded-lg p-2 col-span-2">
                <div class="text-xs text-purple-600">Indice UV</div>
                <div class="text-lg font-bold text-purple-800">{{ currentWeather.uv }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Colonne droite : prévisions -->
      <div class="flex-[2] flex flex-col max-h-full">
        <div v-if="hourlyForecast" class="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/40 min-h-0 overflow-hidden flex flex-col justify-start max-h-[220px] ml-0">
          <h2 class="text-lg font-bold text-blue-700 mb-2 text-center">Prévisions heure par heure</h2>
          <div class="flex overflow-x-auto space-x-2 pb-2 items-end h-full justify-center">
            <div 
              v-for="(hour, index) in hourlyForecast" 
              :key="index"
              class="flex-shrink-0 bg-white/60 rounded-xl p-2 text-center min-w-[70px] flex flex-col justify-end"
            >
              <div class="text-xs text-blue-600 mb-1">{{ hour.time }}</div>
              <img :src="hour.icon" :alt="hour.description" class="w-8 h-8 mx-auto mb-1" />
              <div class="text-base font-bold text-blue-800 mb-1">{{ hour.temp }}°C</div>
              <div class="text-xs text-blue-600 capitalize">{{ hour.description }}</div>
              <div class="text-xs text-blue-500 mt-1">{{ hour.wind }} km/h</div>
            </div>
          </div>
        </div>
        <div v-if="dailyForecast" class="bg-white/80 backdrop-blur-md rounded-2xl p-4 mt-10 shadow-lg border border-white/40 min-h-0 overflow-hidden max-h-[280px] flex flex-col justify-start">
          <h2 class="text-lg font-bold text-blue-700 mb-2 text-center">Prévisions sur 5 jours</h2>
          <div class="flex overflow-x-auto space-x-2 pb-2 items-end h-full justify-center">
            <div 
              v-for="(day, index) in dailyForecast" 
              :key="index"
              class="flex-shrink-0 bg-white/60 rounded-xl p-2 text-center min-w-[90px] h-48 flex flex-col justify-between"
            >
              <div class="text-base font-semibold text-blue-800 mb-1">{{ day.date }}</div>
              <img :src="day.icon" :alt="day.description" class="w-10 h-10 mx-auto mb-1" />
              <div class="text-lg font-bold text-blue-800 mb-1">{{ day.temp }}°C</div>
              <div class="text-xs text-blue-600 capitalize mb-1">{{ day.description }}</div>
              <div class="flex justify-center space-x-1 text-xs">
                <span class="text-red-600">{{ day.tempMax }}°</span>
                <span class="text-blue-600">{{ day.tempMin }}°</span>
              </div>
              <div class="text-xs text-blue-500 mt-1">
                <div>Humidité: {{ day.humidity }}%</div>
                <div>Vent: {{ day.wind }} km/h</div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full max-w-7xl flex justify-center mt-10">
          <div class="w-full max-w-2xl bg-gradient-to-r from-yellow-200 via-yellow-100 to-orange-100 border-l-8 border-yellow-400 rounded-2xl p-6 flex flex-col items-center shadow-lg">
            <div class="flex items-center mb-2">
              <svg class="w-12 h-12 text-yellow-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span class="text-yellow-800 text-2xl font-bold tracking-wide">Alerte météo</span>
            </div>
            <div v-if="weatherAlerts && weatherAlerts.length" class="space-y-2 w-full">
              <div v-for="(alert, idx) in weatherAlerts" :key="idx" class="text-yellow-900 text-center text-sm font-medium border border-yellow-300 rounded-lg p-3 mb-2 bg-yellow-50">
                <div class="font-bold text-yellow-800 mb-1">{{ alert.event }}</div>
                <div class="text-xs text-yellow-700 mb-1">{{ alert.sender_name }}</div>
                <div class="text-yellow-900">{{ alert.description }}</div>
                <div class="text-xs text-yellow-600 mt-2">Du {{ new Date(alert.start * 1000).toLocaleString('fr-FR') }} au {{ new Date(alert.end * 1000).toLocaleString('fr-FR') }}</div>
              </div>
            </div>
            <div v-else class="text-yellow-900 text-center text-sm font-medium">Aucune alerte météo en cours pour votre position.</div>
          </div>
        </div>
      </div>
    </div>
    <!-- État de chargement -->
    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-xl text-blue-600">Localisation en cours...</p>
    </div>
    <!-- État d'erreur -->
    <!-- <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
      <p class="text-lg font-semibold mb-2">{{ error }}</p>
      <button 
        @click="getLocation" 
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Réessayer
      </button>
    </div> -->
    <!-- État vide -->
    <div v-if="!currentWeather && !loading && !error" class="text-center py-20">
      <div class="text-6xl mb-4">🌤️</div>
      <p class="text-xl text-blue-600 mb-4">Autorisez la géolocalisation pour voir la météo</p>
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

onMounted(() => {
  // Géolocalisation automatique au chargement
  getLocation()
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
  const url = `${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
  const res = await fetch(url)
  
  if (!res.ok) throw new Error('Erreur API météo')
  
  const data = await res.json()
  const now = new Date()
  currentWeather.value = {
    city: data.name,
    temp: Math.round(data.main.temp),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    wind: Math.round(data.wind.speed),
    visibility: Math.round(data.visibility / 1000),
    uv: Math.round(data.main.temp / 10), // Approximation UV
    description: data.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    date: now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
    time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
}

async function fetchForecast(lat, lon) {
  const url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
  const res = await fetch(url)
  
  if (!res.ok) throw new Error('Erreur API prévisions')
  
  const data = await res.json()
  
  // Prévisions heure par heure (prochaines 24h)
  const now = new Date()
  // Cherche la première tranche >= maintenant
  const firstIndex = data.list.findIndex(item => new Date(item.dt * 1000) >= now)
  const next6Hours = data.list.slice(firstIndex, firstIndex + 6) // 6 tranches de 3h = 18h
  
  hourlyForecast.value = next6Hours.map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    temp: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
    wind: Math.round(item.wind.speed)
  }))
  
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
        temp: Math.round(item.main.temp),
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        humidity: item.main.humidity,
        wind: Math.round(item.wind.speed),
        description: item.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
      }
    } else {
      // Mettre à jour min/max
      dailyData[dayKey + fullDate].tempMin = Math.min(dailyData[dayKey + fullDate].tempMin, Math.round(item.main.temp_min))
      dailyData[dayKey + fullDate].tempMax = Math.max(dailyData[dayKey + fullDate].tempMax, Math.round(item.main.temp_max))
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