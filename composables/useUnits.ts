export const useUnits = () => {
  const units = ref('metric')

  // Fonction pour charger les unités depuis localStorage
  const loadUnits = () => {
    if (process.client) {
      try {
        const saved = localStorage.getItem('weather-settings')
        if (saved) {
          const settings = JSON.parse(saved)
          units.value = settings.units || 'metric'
        }
      } catch (error) {
        console.error('Erreur lors du chargement des unités:', error)
        units.value = 'metric'
      }
    }
  }

  // Fonction pour changer les unités et notifier les autres composants
  const changeUnits = (newUnits: string) => {
    units.value = newUnits
    if (process.client) {
      // Sauvegarder dans localStorage
      const saved = localStorage.getItem('weather-settings')
      const settings = saved ? JSON.parse(saved) : {}
      settings.units = newUnits
      localStorage.setItem('weather-settings', JSON.stringify(settings))
      
      // Émettre un événement personnalisé pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('units-changed', { detail: newUnits }))
    }
  }

  // Fonction pour obtenir le paramètre d'unité pour l'API
  const getApiUnits = () => {
    return units.value === 'imperial' ? 'imperial' : 'metric'
  }

  // Fonction pour formater la température avec la bonne unité
  const formatTemperature = (temp: number) => {
    const unit = units.value === 'imperial' ? '°F' : '°C'
    return `${Math.round(temp)}${unit}`
  }

  // Fonction pour formater la vitesse du vent
  const formatWindSpeed = (speed: number) => {
    const unit = units.value === 'imperial' ? 'mph' : 'km/h'
    return `${Math.round(speed)} ${unit}`
  }

  // Initialiser les unités au chargement
  if (process.client) {
    loadUnits()
  }

  return {
    units: readonly(units),
    loadUnits,
    changeUnits,
    getApiUnits,
    formatTemperature,
    formatWindSpeed
  }
} 