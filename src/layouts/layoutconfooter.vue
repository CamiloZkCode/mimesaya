<template>
  <div class="layout">
    <!-- Navbar siempre arriba -->
    <header>
      <Navbar />
    </header>

    <!-- Contenido dinámico -->
    <main class="contenido">
      <RouterView />
    </main>

    <!-- Footer fijo abajo -->
    <footer>
      <Footers />
    </footer>
  </div>
</template>

<script setup>
import Navbar from "../components/navbar.vue";
import Footers from "../components/footer.vue";
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

footer {
  width: 100%;
}
</style>
