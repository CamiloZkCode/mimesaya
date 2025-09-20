<template>
  <div class="layout">
    <header>
      <Navbar />
    </header>

    <!-- Contenido dinámico -->
    <main class="contenido">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from "../components/navbar.vue";
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

header {
  width: 100%; 
}

.contenido {
  flex: 1; 
  padding: 1rem;
}
</style>
