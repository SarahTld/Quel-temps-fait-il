<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white">
    <!-- Navigation -->
    <nav class="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-2">
              <span class="text-2xl">🌤️</span>
              <span class="text-xl font-bold text-blue-700">Quel temps fait-il ?</span>
            </NuxtLink>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink 
              to="/" 
              class="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'bg-blue-100 text-blue-800': $route.path === '/' }"
            >
              Accueil
            </NuxtLink>
            <NuxtLink 
              to="/previsions" 
              class="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'bg-blue-100 text-blue-800': $route.path === '/previsions' }"
            >
              Prévisions
            </NuxtLink>
            <NuxtLink 
              to="/favoris" 
              class="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'bg-blue-100 text-blue-800': $route.path === '/favoris' }"
            >
              Favoris
            </NuxtLink>
            <NuxtLink 
              to="/parametres" 
              class="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'bg-blue-100 text-blue-800': $route.path === '/parametres' }"
            >
              ⚙️
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-blue-600 hover:text-blue-800">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 rounded-lg mt-2">
            <NuxtLink 
              to="/" 
              class="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              @click="mobileMenuOpen = false"
            >
              Accueil
            </NuxtLink>
            <NuxtLink 
              to="/previsions" 
              class="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              @click="mobileMenuOpen = false"
            >
              Prévisions
            </NuxtLink>
            <NuxtLink 
              to="/favoris" 
              class="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              @click="mobileMenuOpen = false"
            >
              Favoris
            </NuxtLink>
            <NuxtLink 
              to="/parametres" 
              class="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50"
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

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Footer from '@/components/Footer.vue'

const mobileMenuOpen = ref(false)
</script> 