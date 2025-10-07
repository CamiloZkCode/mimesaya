<template>
  <main class="perfil-admin">
    <!-- ===== IMAGEN RESTAURANTE (IZQUIERDA) ===== -->
    <aside class="restaurante-logo">
      <img :src="restaurante.logo_restaurante" :alt="restaurante.nombre_restaurante" />
    </aside>

    <!-- ===== INFO (ADMIN Y RESTAURANTE A LA DERECHA, EN ROWS) ===== -->
    <section class="perfil-info">
      <!-- Info del administrador -->
      <div class="admin-info">
        <h2>Administrador</h2>
        <p><strong>Nombre:</strong> {{ admin.nombre }}</p>
        <p><strong>Teléfono:</strong> {{ admin.telefono }}</p>
        <p><strong>Correo:</strong> {{ admin.correo }}</p>
      </div>

      <!-- Info del restaurante -->
      <div class="restaurante-info">
        <h2>{{ restaurante.nombre_restaurante }}</h2>
        <p><strong>NIT:</strong> {{ restaurante.nit_restaurante }}</p>
        <p><strong>Dirección:</strong> {{ restaurante.direccion_restaurante }}</p>
        <p><strong>Teléfono:</strong> {{ restaurante.telefono_restaurante }}</p>
      </div>
    </section>
  </main>
</template>

<script>
import { ref } from 'vue'
import restauranteImg from '../../assets/Logo/LogoSinLetra.jpg'

export default {
  name: 'PerfilAdministrador',
  setup() {
    const admin = ref({
      nombre: 'Juan Pérez',
      telefono: '3001234567',
      correo: 'juanperez@correo.com'
    })

    const restaurante = ref({
      nit_restaurante: '900123456-7',
      nombre_restaurante: 'Restaurante MiMesaYa',
      direccion_restaurante: 'Cra 15 #45-67 Bogotá',
      telefono_restaurante: '6011234567',
      logo_restaurante: restauranteImg
    })

    return { admin, restaurante }
  }
}
</script>

<style scoped>
.perfil-admin {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px; /* más ancho */
  margin: 0 auto;
  align-items: flex-start;
}

/* Imagen del restaurante */
.restaurante-logo {
  flex-shrink: 0; /* mantiene tamaño fijo */
}
.restaurante-logo img {
  width: 200px;   
  height: 200px;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .25);
  margin-left: -1rem; 
}

.perfil-info {
  flex: 1;
  display: flex;
  flex-direction: column; /* en filas */
  gap: 1rem;
}

.admin-info,
.restaurante-info {
  background: var(--color-blanco, #fff);
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .15);
  padding: 2rem 3rem; 
  width: 100%; 
}

.admin-info h2,
.restaurante-info h2 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: var(--color-oscuro, #222);
}

.admin-info p,
.restaurante-info p {
  font-size: 1.2rem;
  margin: .5rem 0;
  color: #333;
}

@media (max-width: 768px) {
  .perfil-admin {
    flex-direction: column;
    align-items: center;
  }

  .restaurante-logo {
    margin: 0 auto; 
  }

  .restaurante-logo img {
    margin-left: 0; 
    width: 150px; 
    height: 150px;
  }

  .perfil-info {
    width: 100%; 
    align-items: center; 
  }

  .admin-info,
  .restaurante-info {
    width: 100%; 
    max-width: 500px;
  }

  .admin-info h2,
  .restaurante-info h2 {
    text-align: center;
    font-size: 1.4rem; 
  }

  .admin-info p,
  .restaurante-info p {
    font-size: 1rem; 
  }
}
</style>