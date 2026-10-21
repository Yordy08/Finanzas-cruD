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
    { name: 'theme-color', content: '#101a33' },
    { name: 'application-name', content: 'FinanzaN&Y' }
  ]
})
</script>

<style>
:root {
  --brand-cyan: #22d3ee;
  --brand-purple: #8b5cf6;
  --brand-pink: #ec4899;
  --ink-950: #0b1220;
  --ink-900: #101a33;
  --surface: rgba(20, 30, 58, 0.88);
  --surface-solid: #141e3a;
  --surface-input: #101a33;
  --border: rgba(139, 92, 246, 0.24);
  --text-soft: #b7c4e3;
}

html,
body {
  margin: 0;
  min-width: 320px;
  background: var(--ink-950);
  color: #f8fbff;
}

button,
input,
select,
textarea {
  font: inherit;
}
</style>

