<template>
  <div class="flex flex-col items-center py-10 px-4">
    <div class="w-full max-w-2xl">
      <h1 class="text-3xl font-bold text-blue-700 mb-8 text-center">Paramètres</h1>
      
      <div class="space-y-6">
        <!-- Unités de température -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/40">
          <h2 class="text-xl font-semibold text-blue-800 mb-4">Unités de température</h2>
          <div class="space-y-3">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                v-model="settings.units" 
                value="metric" 
                class="text-blue-600 focus:ring-blue-500"
              />
              <span class="text-blue-700">Celsius (°C)</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                v-model="settings.units" 
                value="imperial" 
                class="text-blue-600 focus:ring-blue-500"
              />
              <span class="text-blue-700">Fahrenheit (°F)</span>
            </label>
          </div>
        </div>

        <!-- Thème -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/40">
          <h2 class="text-xl font-semibold text-blue-800 mb-4">Thème</h2>
          <div class="space-y-3">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                v-model="settings.theme" 
                value="light" 
                class="text-blue-600 focus:ring-blue-500"
              />
              <span class="text-blue-700">Clair ☀️</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                v-model="settings.theme" 
                value="dark" 
                class="text-blue-600 focus:ring-blue-500"
              />
              <span class="text-blue-700">Sombre 🌙</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input 
                type="radio" 
                v-model="settings.theme" 
                value="auto" 
                class="text-blue-600 focus:ring-blue-500"
              />
              <span class="text-blue-700">Automatique (selon l'heure) ⏰</span>
            </label>
          </div>
        </div>

        <!-- Notifications -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/40">
          <h2 class="text-xl font-semibold text-blue-800 mb-4">Notifications</h2>
          <div class="space-y-3">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.notifications" 
                class="text-blue-600 focus:ring-blue-500 rounded"
              />
              <span class="text-blue-700">Activer les notifications météo</span>
            </label>
            <label class="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.rainAlert" 
                class="text-blue-600 focus:ring-blue-500 rounded"
                :disabled="!settings.notifications"
              />
              <span class="text-blue-700" :class="{ 'opacity-50': !settings.notifications }">Alerte pluie</span>
            </label>
          </div>
        </div>

        <!-- Données -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/40">
          <h2 class="text-xl font-semibold text-blue-800 mb-4">Données</h2>
          <div class="space-y-4">
            <button 
              @click="clearHistory" 
              class="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Effacer l'historique des recherches
            </button>
            <button 
              @click="clearFavorites" 
              class="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Effacer tous les favoris
            </button>
            <button 
              @click="exportData" 
              class="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Exporter mes données
            </button>
          </div>
        </div>

        <!-- Informations -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/40">
          <h2 class="text-xl font-semibold text-blue-800 mb-4">Informations</h2>
          <div class="space-y-2 text-sm text-blue-600">
            <p>🌤️ <strong>Quel temps fait-il ?</strong> v1.0</p>
            <p>Données météo fournies par OpenWeatherMap</p>
            <p>Développé avec Nuxt 3 et Tailwind CSS</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const settings = ref({
  units: 'metric',
  theme: 'auto',
  notifications: false,
  rainAlert: false
})

onMounted(() => {
  loadSettings()
})

function loadSettings() {
  const saved = localStorage.getItem('weather-settings')
  if (saved) {
    settings.value = { ...settings.value, ...JSON.parse(saved) }
  }
}

function saveSettings() {
  localStorage.setItem('weather-settings', JSON.stringify(settings.value))
}

// Sauvegarder automatiquement quand les paramètres changent
watch(settings, saveSettings, { deep: true })

function clearHistory() {
  if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique des recherches ?')) {
    localStorage.removeItem('weather-history')
    alert('Historique effacé !')
  }
}

function clearFavorites() {
  if (confirm('Êtes-vous sûr de vouloir effacer tous vos favoris ?')) {
    localStorage.removeItem('weather-favorites')
    alert('Favoris effacés !')
  }
}

function exportData() {
  const data = {
    history: localStorage.getItem('weather-history'),
    favorites: localStorage.getItem('weather-favorites'),
    settings: localStorage.getItem('weather-settings'),
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'meteo-data.json'
  a.click()
  URL.revokeObjectURL(url)
  
  alert('Données exportées !')
}
</script> 