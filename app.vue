<template>
  <v-app>
    <NuxtLayout />
  </v-app>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title) => title ? `${title} | FinanzaN&Y` : 'FinanzaN&Y',
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  meta: [
    { name: 'theme-color', content: '#0b1220' },
    { name: 'application-name', content: 'FinanzaN&Y' }
  ]
})
</script>

