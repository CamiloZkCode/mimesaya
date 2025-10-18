<template>
  <main class="perfil-admin">
    <!-- ===== IMAGEN RESTAURANTE (IZQUIERDA) ===== -->
    <aside class="restaurante-logo">
      <img
        v-if="restaurante.logo_restaurante"
        :src="restaurante.logo_restaurante"
        :alt="restaurante.nombre_restaurante"
      />
      <img
        v-else
        src="../../assets/Logo/LogoSinLetra.jpg"
        alt="Logo restaurante"
      />
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

        <!-- Enlace a la cuenta de Stripe -->
        <div v-if="restaurante.enlaceStripe" class="stripe-section">
          <p><strong>Pagos en línea:</strong></p>
          <a
            :href="restaurante.enlaceStripe"
            target="_blank"
            rel="noopener noreferrer"
            class="stripe-link"
          >
            Configurar cuenta Stripe
          </a>
        </div>
        <div v-else class="stripe-section">
          <p><strong>Pagos en línea:</strong> No conectado</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { ref, onMounted } from "vue";
import { obtenerPerfil } from "@/services/perfil"; // servicio conectado al backend

export default {
  name: "PerfilAdministrador",
  setup() {
    const admin = ref({});
    const restaurante = ref({});

    onMounted(async () => {
      try {
        // Puedes obtener el id_admin desde el login o localStorage
        const id_admin = localStorage.getItem("id_usuario") || 1;
        const data = await obtenerPerfil(id_admin);
        admin.value = data.admin;
        restaurante.value = data.restaurante;
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    });

    return { admin, restaurante };
  },
};
</script>

<style scoped>
.perfil-admin {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  align-items: flex-start;
}

/* ===== Imagen del restaurante ===== */
.restaurante-logo {
  flex-shrink: 0;
}
.restaurante-logo img {
  width: 200px;
  height: 200px;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  margin-left: -1rem;
}

/* ===== Info del perfil ===== */
.perfil-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-info,
.restaurante-info {
  background: var(--color-blanco, #fff);
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
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
  margin: 0.5rem 0;
  color: #333;
}

/* ===== Enlace Stripe ===== */
.stripe-section {
  margin-top: 1rem;
}

.stripe-link {
  display: inline-block;
  background-color: #635bff;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.stripe-link:hover {
  background-color: #4b44cc;
}

/* ===== Responsive ===== */
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

  .stripe-link {
    display: block;
    text-align: center;
  }
}
</style>
