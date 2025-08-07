<template>
  <div class="weather-map-container">
    <div ref="mapContainer" class="map-container"></div>
    
    <!-- Contrôles de la carte -->
    <div class="map-controls">
      <button 
        @click="toggleMapType" 
        class="control-btn"
        :title="mapType === 'temperature' ? 'Température' : 'Précipitations'"
      >
        {{ mapType === 'temperature' ? '🌡️' : '🌧️' }}
      </button>
    </div>

    <!-- Légende -->
    <div class="map-legend">
      <h4 class="legend-title">{{ mapType === 'temperature' ? 'Température' : 'Précipitations' }}</h4>
      <div class="legend-items">
        <div v-if="mapType === 'temperature'" class="legend-item">
          <div class="legend-color hot"></div>
          <span>Chaud</span>
        </div>
        <div v-if="mapType === 'temperature'" class="legend-item">
          <div class="legend-color warm"></div>
          <span>Doux</span>
        </div>
        <div v-if="mapType === 'temperature'" class="legend-item">
          <div class="legend-color cool"></div>
          <span>Frais</span>
        </div>
        <div v-if="mapType === 'temperature'" class="legend-item">
          <div class="legend-color cold"></div>
          <span>Froid</span>
        </div>
        <div v-if="mapType === 'precipitation'" class="legend-item">
          <div class="legend-color heavy-rain"></div>
          <span>Forte pluie</span>
        </div>
        <div v-if="mapType === 'precipitation'" class="legend-item">
          <div class="legend-color light-rain"></div>
          <span>Légère pluie</span>
        </div>
        <div v-if="mapType === 'precipitation'" class="legend-item">
          <div class="legend-color no-rain"></div>
          <span>Sans pluie</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  city: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['city-selected'])

const mapContainer = ref(null)
const map = ref(null)
const mapType = ref('temperature')
const markers = ref([])

// Exposer la carte pour les composants parents
defineExpose({
  map: map
})

const config = useRuntimeConfig()
const API_KEY = config.public.openweatherKey

const { getApiUnits, formatTemperature, formatWindSpeed } = useUnits()

// Fix pour les icônes Leaflet
const fixLeafletIcons = () => {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

onMounted(() => {
  fixLeafletIcons()
  initMap()
  
  // Écouter les changements d'unités
  window.addEventListener('units-changed', () => {
    if (map.value) {
      loadWeatherData()
    }
  })
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

function initMap() {
  if (!mapContainer.value) return

  // Créer la carte
  map.value = L.map(mapContainer.value, {
    center: [46.603354, 1.888334], // Centre de la France
    zoom: 6,
    zoomControl: false
  })

  // Ajouter la couche de tuiles OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map.value)

  // Ajouter les contrôles de zoom
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map.value)

  // Écouter les clics sur la carte
  map.value.on('click', handleMapClick)

  // Charger les données météo initiales
  loadWeatherData()
}

async function loadWeatherData() {
  try {
    // Coordonnées des principales villes françaises
    const cities = [
      { name: 'Paris', lat: 48.8566, lon: 2.3522 },
      { name: 'Marseille', lat: 43.2965, lon: 5.3698 },
      { name: 'Lyon', lat: 45.7578, lon: 4.8320 },
      { name: 'Toulouse', lat: 43.6047, lon: 1.4442 },
      { name: 'Nice', lat: 43.7102, lon: 7.2620 },
      { name: 'Nantes', lat: 47.2184, lon: -1.5536 },
      { name: 'Strasbourg', lat: 48.5734, lon: 7.7521 },
      { name: 'Montpellier', lat: 43.6108, lon: 3.8767 },
      { name: 'Bordeaux', lat: 44.8378, lon: -0.5792 },
      { name: 'Lille', lat: 50.6292, lon: 3.0573 }
    ]

    // Nettoyer les marqueurs existants
    markers.value.forEach(marker => map.value.removeLayer(marker))
    markers.value = []

    // Ajouter les marqueurs pour chaque ville
    for (const city of cities) {
      try {
        const weatherData = await fetchWeatherData(city.lat, city.lon)
        addWeatherMarker(city, weatherData)
      } catch (error) {
        console.error(`Erreur pour ${city.name}:`, error)
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données météo:', error)
  }
}

async function fetchWeatherData(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${getApiUnits()}&lang=fr`
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des données météo')
  }
  
  return await response.json()
}

function addWeatherMarker(city, weatherData) {
  const temp = formatTemperature(weatherData.main.temp)
  const description = weatherData.weather[0].description
  const icon = weatherData.weather[0].icon

  // Créer l'icône personnalisée
  const customIcon = L.divIcon({
    className: 'weather-marker',
    html: `
      <div class="marker-content">
        <div class="marker-temp">${temp}</div>
        <div class="marker-icon">${getWeatherEmoji(icon)}</div>
        <div class="marker-city">${city.name}</div>
      </div>
    `,
    iconSize: [80, 60],
    iconAnchor: [40, 30]
  })

  // Créer le marqueur
  const marker = L.marker([city.lat, city.lon], { icon: customIcon })
    .addTo(map.value)
    .bindPopup(`
      <div class="weather-popup">
        <h3>${city.name}</h3>
        <div class="weather-info">
          <div class="temp">${temp}</div>
          <div class="description">${description}</div>
          <div class="details">
            <div>Humidité: ${weatherData.main.humidity}%</div>
            <div>Vent: ${formatWindSpeed(weatherData.wind.speed)}</div>
          </div>
        </div>
      </div>
    `)

  // Ajouter l'événement de clic
  marker.on('click', () => {
    emit('city-selected', city.name)
  })

  markers.value.push(marker)
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

function handleMapClick(e) {
  const { lat, lng } = e.latlng
  
  // Créer un marqueur temporaire pour montrer le clic
  const tempMarker = L.marker([lat, lng], {
    icon: L.divIcon({
      className: 'temp-marker',
      html: '📍',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    })
  }).addTo(map.value)

  // Supprimer le marqueur temporaire après 2 secondes
  setTimeout(() => {
    map.value.removeLayer(tempMarker)
  }, 2000)

  // Récupérer les données météo pour ce point
  fetchWeatherData(lat, lng)
    .then(data => {
      const cityName = `Position (${lat.toFixed(2)}, ${lng.toFixed(2)})`
      emit('city-selected', cityName)
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données:', error)
    })
}



function toggleMapType() {
  mapType.value = mapType.value === 'temperature' ? 'precipitation' : 'temperature'
  // Ici vous pourriez changer la couche de la carte selon le type
  // Pour l'instant, on garde la même carte mais on pourrait ajouter des couches météo
}
</script>

<style scoped>
.weather-map-container {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.map-container {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #f3f4f6;
  transform: scale(1.05);
}

.map-legend {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 12px;
}

.legend-title {
  margin: 0 0 8px 0;
  font-weight: 600;
  color: #374151;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.legend-color.hot { background: #ef4444; }
.legend-color.warm { background: #f97316; }
.legend-color.cool { background: #3b82f6; }
.legend-color.cold { background: #1e40af; }
.legend-color.heavy-rain { background: #1e3a8a; }
.legend-color.light-rain { background: #60a5fa; }
.legend-color.no-rain { background: #d1d5db; }

/* Styles pour les marqueurs météo */
:deep(.weather-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-content) {
  background: white;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  padding: 4px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 60px;
}

:deep(.marker-temp) {
  font-weight: bold;
  font-size: 14px;
  color: #1f2937;
}

:deep(.marker-icon) {
  font-size: 16px;
  margin: 2px 0;
}

:deep(.marker-city) {
  font-size: 10px;
  color: #6b7280;
  white-space: nowrap;
}



:deep(.temp-marker) {
  background: transparent;
  border: none;
  font-size: 20px;
}

/* Styles pour les popups */
:deep(.weather-popup) {
  text-align: center;
  min-width: 150px;
}

:deep(.weather-popup h3) {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 16px;
}

:deep(.weather-info) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

:deep(.weather-info .temp) {
  font-size: 18px;
  font-weight: bold;
  color: #3b82f6;
}

:deep(.weather-info .description) {
  font-size: 12px;
  color: #6b7280;
  text-transform: capitalize;
}

:deep(.weather-info .details) {
  font-size: 10px;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* Mode sombre */
.dark .map-legend {
  background: #374151;
  color: #f9fafb;
}

.dark .legend-title {
  color: #f9fafb;
}

.dark .control-btn {
  background: #374151;
  color: #f9fafb;
}

.dark .control-btn:hover {
  background: #4b5563;
}

:deep(.marker-content) {
  background: white;
  border: 2px solid #3b82f6;
}

.dark :deep(.marker-content) {
  background: #374151;
  border-color: #60a5fa;
  color: #f9fafb;
}

.dark :deep(.marker-temp) {
  color: #f9fafb;
}

.dark :deep(.marker-city) {
  color: #d1d5db;
}
</style> 