<template>
  <main class="cancel-page">
    <h2>❌ Pago cancelado</h2>
    <p>Tu pago no fue procesado. Puedes intentarlo nuevamente.</p>
    <RouterLink to="/reservas" class="btn btn--primary">Volver a Reservas</RouterLink>
  </main>
</template>

<script setup>
</script>

<style scoped>
.cancel-page {
  text-align: center;
  padding: 3rem 1rem;
}

.btn {
  --_pad: 0.6rem 1rem;
  padding: var(--_pad);
  border-radius: var(--border-radius-2);
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.2px;
  transition: transform 120ms ease, filter 120ms ease;
  text-decoration: none; /* Remove default underline from RouterLink */
  display: inline-block; /* Ensure proper button-like behavior */
}

.btn:hover {
  transform: translateY(-1px);
  filter: brightness(0.98);
}

.btn:active {
  transform: translateY(0);
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-azul-1), var(--color-primary-variant));
  color: var(--color-blanco);
}
</style>