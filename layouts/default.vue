<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
    <!-- Navigation -->
    <nav class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-blue-100 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <span class="text-2xl text-blue-600 dark:text-blue-300">🌤️</span>
              <span class="text-xl font-bold text-blue-700 dark:text-blue-300">Quel temps fait-il ?</span>
            </NuxtLink>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink 
              to="/" 
              class="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100': $route.path === '/' }"
            >
              Accueil
            </NuxtLink>
            <NuxtLink 
              to="/carte" 
              class="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100': $route.path === '/carte' }"
            >
              Carte
            </NuxtLink>
            <NuxtLink 
              to="/favoris" 
              class="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100': $route.path === '/favoris' }"
            >
              Favoris
            </NuxtLink>
            <NuxtLink 
              to="/parametres" 
              class="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100': $route.path === '/parametres' }"
            >
              Paramètres
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 dark:bg-gray-800/90 rounded-lg mt-2">
            <NuxtLink 
              to="/" 
              class="block px-3 py-2 rounded-md text-base font-medium text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 hover:bg-blue-50 dark:hover:bg-blue-900/50"
              @click="mobileMenuOpen = false"
            >
              Accueil
            </NuxtLink>
            <NuxtLink 
              to="/carte" 
              class="block px-3 py-2 rounded-md text-base font-medium text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 hover:bg-blue-50 dark:hover:bg-blue-900/50"
              @click="mobileMenuOpen = false"
            >
              Carte
            </NuxtLink>
            <NuxtLink 
              to="/favoris" 
              class="block px-3 py-2 rounded-md text-base font-medium text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 hover:bg-blue-50 dark:hover:bg-blue-900/50"
              @click="mobileMenuOpen = false"
            >
              Favoris
            </NuxtLink>
            <NuxtLink 
              to="/parametres" 
              class="block px-3 py-2 rounded-md text-base font-medium text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 hover:bg-blue-50 dark:hover:bg-blue-900/50"
              @click="mobileMenuOpen = false"
            >
              Paramètres
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <Footer v-if="isHomePage" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Footer from '@/components/Footer.vue'

const mobileMenuOpen = ref(false)
const route = useRoute()
const isHomePage = computed(() => route.path === '/')

// Initialiser le thème au chargement
onMounted(() => {
  const { initTheme } = useTheme()
  initTheme()
})
</script> 