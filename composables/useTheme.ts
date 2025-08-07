export const useTheme = () => {
  const theme = ref('auto')
  const isDark = ref(false)

  // Fonction pour détecter la préférence système
  const getSystemTheme = () => {
    if (process.client) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // Fonction pour appliquer le thème
  const applyTheme = (newTheme: string) => {
    theme.value = newTheme
    
    if (process.client) {
      const html = document.documentElement
      
      // Supprimer les classes existantes
      html.classList.remove('dark', 'light')
      
      // Déterminer le thème à appliquer
      let themeToApply = newTheme
      if (newTheme === 'auto') {
        themeToApply = getSystemTheme()
      }
      
      // Appliquer le thème
      html.classList.add(themeToApply)
      isDark.value = themeToApply === 'dark'
      
      // Sauvegarder dans localStorage
      localStorage.setItem('weather-theme', newTheme)
    }
  }

  // Fonction pour initialiser le thème
  const initTheme = () => {
    if (process.client) {
      // Charger le thème depuis localStorage
      const savedTheme = localStorage.getItem('weather-theme') || 'auto'
      applyTheme(savedTheme)
      
      // Écouter les changements de préférence système
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (theme.value === 'auto') {
          applyTheme('auto')
        }
      })
    }
  }

  // Fonction pour basculer entre clair et sombre
  const toggleTheme = () => {
    const currentTheme = theme.value
    if (currentTheme === 'light') {
      applyTheme('dark')
    } else if (currentTheme === 'dark') {
      applyTheme('light')
    } else {
      // Si auto, basculer vers le thème opposé au système
      const systemTheme = getSystemTheme()
      applyTheme(systemTheme === 'light' ? 'dark' : 'light')
    }
  }

  return {
    theme: readonly(theme),
    isDark: readonly(isDark),
    applyTheme,
    initTheme,
    toggleTheme,
    getSystemTheme
  }
} 