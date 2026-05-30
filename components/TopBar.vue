<template>
  <header class="top">
    <NuxtLink class="brand" to="/">Finanzas</NuxtLink>
    <div class="links">
      <NuxtLink class="link" to="/movimientos">Movimientos</NuxtLink>
      <NuxtLink class="link" to="/cuentas">Cuentas</NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
}
.brand {
  color: white;
  font-weight: 900;
  text-decoration: none;
  font-size: 18px;
}
.links {
  display: flex;
  gap: 10px;
}
.link {
  color: white;
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
}
</style>

