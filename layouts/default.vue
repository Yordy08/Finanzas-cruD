<template>
  <div class="appRoot">
    <AppNavbar />

    <div class="appBody">
      

      <main class="appMain">
        <NuxtPage />
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '~/components/AppNavbar.vue'

</script>

<style scoped>
.appRoot {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(
      1200px 700px at 20% -10%,
      rgba(34, 211, 238, 0.18),
      transparent 55%
    ),
    radial-gradient(
      1000px 600px at 90% 0%,
      rgba(99, 102, 241, 0.18),
      transparent 50%
    ),
    #0b1220;
  color: white;
  overflow-x: hidden;
}

.appBody {
  flex: 1;
  width: 100%;
  display: block;
}

.appMain {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 24px;
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .appMain {
    padding: 14px;
  }
}

@media (max-width: 480px) {
  .appMain {
    padding: 10px;
  }
}
</style>