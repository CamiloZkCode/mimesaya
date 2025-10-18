<template>
  <router-view />
</template>

<script setup>
</script>

<style>
:root {
  --color-azul-1: #0188db;
  --color-amarillo-2: #f4b908;
  --color-naranja-3: #f0ad4e;
  --color-morado-4: #b5106b;
  --color-rojo-5: #b6212b;
  --color-aprobado-1: #28a745;
  --color-blanco: #FFF;
  --color-info-gris: #7d8da1;
  --color-info-luz: #dce1eb;
  --color-oscuro: #363949;
  --color-light: rgba(132, 139, 200, 0.18);
  --color-primary-variant: #2749aa;
  --color-dark-variant: #677483;
  --color-background: #f6f6f9;
  --card-border-radius: 2rem;
  --border-radius-1: 0.4rem;
  --border-radius-2: 0.8rem;
  --border-radius-3: 1.2rem;

  --card-padding: 1rem;
  --padding-1: 1.2rem;
  --box-shadow: 0 2rem 3rem var(--color-light);
}

* {
  margin: 0;
  padding: 0;
  outline: 0;
  appearance: none;
  border: 0;
  text-decoration: none;
  list-style: none;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
}

html {
  font-size: 14px;
}

body {
  font-family: 'Poppins', sans-serif;
  font-size: 0.88rem;
  background: var(--color-background);
  user-select: none;
  overflow-x: hidden;
}


</style>
