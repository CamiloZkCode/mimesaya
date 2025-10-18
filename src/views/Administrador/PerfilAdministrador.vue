<template>
  <main class="perfil-admin">
    <!-- ===== IMAGEN RESTAURANTE (IZQUIERDA) ===== -->
    <aside class="restaurante-logo">
      <img
        :src="restaurante.logo_restaurante"
        :alt="restaurante.nombre_restaurante"
      />
    </aside>

    <!-- ===== INFO (ADMIN Y RESTAURANTE A LA DERECHA) ===== -->
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
        <h2><strong>Restaurante:</strong> {{ restaurante.nombre_restaurante }}</h2>
        <p><strong>NIT:</strong> {{ restaurante.nit_restaurante }}</p>
        <p><strong>Dirección:</strong> {{ restaurante.direccion_restaurante }}</p>
        <p><strong>Teléfono:</strong> {{ restaurante.telefono_restaurante }}</p>

        <div class="stripe-section">
          <p><strong>Pagos en línea:</strong></p>

          <!-- Botón: Crear cuenta Stripe -->
          <button
            v-if="!restaurante.tieneCuentaStripe"
            class="btn btn--primary"
            @click="crearCuentaStripe"
          >
            Crear cuenta Stripe
          </button>

          <!-- Botón: Editar / Gestionar cuenta Stripe -->
          <button
            v-if="restaurante.tieneCuentaStripe"
            class="btn btn--ghost"
            @click="abrirStripe(restaurante.enlaceStripe)"
          >
            Gestionar cuenta Stripe
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { obtenerPerfil } from "@/services/perfil";
import Swal from "sweetalert2";

const admin = ref({});
const restaurante = ref({});

const abrirStripe = (url) => {
  if (!url) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo abrir la cuenta de Stripe.",
    });
  } else {
    window.open(url, "_blank");
  }
};

const crearCuentaStripe = async () => {
  const confirm = await Swal.fire({
    title: "¿Deseas crear una cuenta Stripe?",
    text: "Esto te permitirá recibir pagos en línea en tu restaurante.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, crear cuenta",
    cancelButtonText: "Cancelar",
  });

  if (confirm.isConfirmed) {
    try {
      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al crear tu cuenta Stripe.",
      });
    }
  }
};

onMounted(async () => {
  try {
    const data = await obtenerPerfil();
    admin.value = data.admin;
    restaurante.value = data.restaurante;
  } catch (error) {
    console.error("Error cargando perfil:", error);
    Swal.fire({
      icon: "error",
      title: "Error al cargar perfil",
      text: "No se pudo cargar la información del perfil.",
    });
  }
});
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

/* ===== LOGO ===== */
.restaurante-logo {
  width: 200px;
  height: 200px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-azul-1), var(--color-primary-variant));
  box-shadow: var(--box-shadow);
}

.restaurante-logo img {
  width: 180px;
  height: 180px;
  border-radius: 20px;
  object-fit: contain;
}

/* ===== INFO ===== */
.perfil-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-info,
.restaurante-info {
  background: var(--color-blanco);
  border-radius: 16px;
  box-shadow: var(--box-shadow);
  padding: 2rem 3rem;
  width: 100%;
}

.admin-info h2,
.restaurante-info h2 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: #222;
}

.admin-info p,
.restaurante-info p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  color: #333;
}

/* ===== Stripe section ===== */
.stripe-section {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* ===== Botones globales iguales a gestion-mesas ===== */
.btn {
  --_pad: 0.6rem 1rem;
  padding: var(--_pad);
  border-radius: 0.4rem;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.2px;
  transition: transform 120ms ease, filter 120ms ease;
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

.btn--ghost {
  background: linear-gradient(135deg, var(--color-azul-1), var(--color-primary-variant));
  border-color: var(--color-info-luz);
  color: var(--color-blanco);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .perfil-admin {
    flex-direction: column;
    align-items: center;
  }

  .restaurante-logo img {
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
  font-size: 1.1rem;
}

.admin-info p,
.restaurante-info p {
  font-size: 1rem;
}

  .stripe-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>
