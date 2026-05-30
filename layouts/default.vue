<template>
  <div class="appRoot">
    <AppNavbar />

    <div class="appBody">
      <AppSidebar />

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
  overflow-x: hidden;
  background: radial-gradient(1200px 700px at 20% -10%, rgba(34, 211, 238, 0.18), transparent 55%),
    radial-gradient(1000px 600px at 90% 0%, rgba(99, 102, 241, 0.18), transparent 50%),
    #0b1220;
  color: white;
}

.appBody {
  flex: 1;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 0;
  min-width: 0;
  overflow: visible;
}

.appMain {
  width: 100%;
  min-width: 0;
  overflow: visible;
}

@media (max-width: 768px) {
  .appBody {
    grid-template-columns: minmax(0, 1fr);
  }

  .appMain {
    padding-top: 12px;
    padding-left: 12px;
    padding-right: 12px;
  }
}

@media (max-width: 420px) {
  .appMain {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>


