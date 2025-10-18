<template>
  <main class="perfil-admin">
    <!-- ===== IMAGEN RESTAURANTE (IZQUIERDA) ===== -->
    <aside class="restaurante-logo">
      <img
        :src="restaurante.logo_restaurante"
        :alt="restaurante.nombre_restaurante"
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
        <h2><strong>Restaurante:</strong> {{ restaurante.nombre_restaurante }}</h2>
        <p><strong>NIT:</strong> {{ restaurante.nit_restaurante }}</p>
        <p><strong>Dirección:</strong> {{ restaurante.direccion_restaurante }}</p>
        <p><strong>Teléfono:</strong> {{ restaurante.telefono_restaurante }}</p>

        <div class="stripe-section">
          <p><strong>Pagos en línea:</strong></p>

          <!-- Botón: Crear cuenta Stripe -->
          <button
            v-if="!restaurante.tieneCuentaStripe"
            class="stripe-btn crear"
            @click="crearCuentaStripe"
          >
            Crear cuenta Stripe
          </button>

          <!-- Botón: Editar / Gestionar cuenta Stripe -->
          <button
            v-if="restaurante.tieneCuentaStripe"
            class="stripe-btn editar"
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
      // Aquí puedes llamar a un endpoint específico para crear la cuenta
      // por ejemplo: POST /api/stripe/crear-cuenta
      window.location.reload(); // provisional: recargar para que backend genere el enlace
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

.restaurante-logo {
  width: 200px;
  height: 200px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.restaurante-logo img {
  width: 200px;
  height: 200px;
  border-radius: 20px;
  object-fit: contain;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
}

.perfil-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-info,
.restaurante-info {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
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

.stripe-section {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stripe-section p {
  margin: 0;
}

.stripe-btn {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stripe-btn.crear {
  background-color: #28a745;
}

.stripe-btn.crear:hover {
  background-color: #218838;
}

.stripe-btn.editar {
  background-color: #635bff;
}

.stripe-btn.editar:hover {
  background-color: #4b44cc;
}

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

  .stripe-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
