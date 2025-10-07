<template>
  <main class="cancel-page">
    <h2>❌ Pago cancelado</h2>
    <p>Tu pago no fue procesado. Puedes intentarlo nuevamente.</p>
    <RouterLink to="/reservas">Volver a Reservas</RouterLink>
  </main>
</template>

<script setup></script>

<style scoped>
.cancel-page {
  text-align: center;
  padding: 3rem 1rem;
}
</style>
