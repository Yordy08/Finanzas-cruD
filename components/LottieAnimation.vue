<template>
  <div ref="container" class="lottie" :style="{ width: `${size}px`, height: `${size}px` }" role="status" aria-label="Cargando" />
</template>

<script setup lang="ts">
import lottie, { type AnimationItem } from 'lottie-web'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{ path: string; size?: number }>(), { size: 72 })
const container = ref<HTMLElement | null>(null)
let animation: AnimationItem | undefined

onMounted(async () => {
  if (!container.value) return
  const response = await fetch(props.path)
  if (!response.ok) return
  animation = lottie.loadAnimation({ container: container.value, renderer: 'svg', loop: true, autoplay: true, animationData: await response.json() })
})

onBeforeUnmount(() => animation?.destroy())
</script>

<style scoped>
.lottie{display:inline-block;flex:0 0 auto}
</style>
