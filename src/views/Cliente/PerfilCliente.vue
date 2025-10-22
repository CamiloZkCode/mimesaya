<template>
  <main class="perfil-cliente">
    <!-- ===== INFO DEL CLIENTE ===== -->
    <section class="cliente-info">
      <div class="cliente-detalles">
        <h2>Perfil del Cliente</h2>
        <p><strong>Nombre:</strong> {{ cliente.nombre }}</p>
        <p><strong>Correo:</strong> {{ cliente.correo }}</p>
        <p><strong>Teléfono:</strong> {{ cliente.telefono }}</p>
      </div>
    </section>

    <!-- ===== TABLA DE RESERVAS ===== -->
    <section class="reservas">
      <h2>Mis Reservas</h2>

      <div v-if="loading" class="estado-cargando">
        <p>Cargando reservas...</p>
      </div>

      <div v-else class="tabla-scroll">
        <table v-if="reservas.length > 0">
          <thead>
            <tr>
              <th>ID Reserva</th>
              <th>Restaurante</th>
              <th>Mesa</th>
              <th>Ocasión</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="reserva in reservas" :key="reserva.id">
              <td>#{{ reserva.id }}</td>
              <td>{{ reserva.restaurante }}</td>
              <td>{{ reserva.mesa }}</td>
              <td>{{ reserva.ocasion }}</td>
              <td>{{ formatearFecha(reserva.fecha_inicio) }}</td>
              <td>{{ formatearFecha(reserva.fecha_fin) }}</td>
              <td>
                <span
                  class="estado"
                  :class="{
                    pendiente: reserva.estado === 'pendiente_pago',
                    activa: reserva.estado === 'activa',
                    cancelada: reserva.estado === 'cancelada',
                    finalizada: reserva.estado === 'finalizada'
                  }"
                >
                  {{ formatearEstado(reserva.estado) }}
                </span>
              </td>
              <td>
                <!-- Si está pendiente, botón de continuar pago -->
                <button
                  v-if="reserva.estado === 'pendiente_pago'"
                  class="btn-pagar"
                  @click="continuarPago(reserva.link_pago)"
                >
                  Continuar pago
                </button>

                <!-- Si está activa, botón de cancelar -->
                <button
                  v-else
                  class="btn-cancelar"
                  :disabled="reserva.estado !== 'activa'"
                  @click="cancelar(reserva.id)"
                >
                  Cancelar
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-else class="sin-reservas">No tienes reservas registradas.</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { obtenerPerfilCliente } from "@/services/perfil";
import { obtenerReservasCliente, CancelarReserva } from "@/services/reservas";

const cliente = ref({
  nombre: "",
  telefono: "",
  correo: "",
});
const reservas = ref([]);
const loading = ref(true);

function formatearFecha(fechaString) {
  const fecha = new Date(fechaString);
  const opcionesFecha = { day: "2-digit", month: "2-digit", year: "numeric" };
  const opcionesHora = { hour: "2-digit", minute: "2-digit", hour12: true };
  return `${fecha.toLocaleDateString("es-ES", opcionesFecha)} - ${fecha.toLocaleTimeString("es-ES", opcionesHora)}`;
}

function formatearEstado(estado) {
  switch (estado) {
    case "pendiente_pago":
      return "Pendiente";
    case "activa":
      return "Activa";
    case "cancelada":
      return "Cancelada";
    case "finalizada":
      return "Finalizada";
    default:
      return estado;
  }
}

async function cargarReservas() {
  try {
    const data = await obtenerReservasCliente();
    reservas.value = data.map((r) => ({
      id: r.id_reserva,
      restaurante: r.nombre_restaurante,
      mesa: r.nombre_mesa,
      ocasion: r.nombre_ocasion,
      fecha_inicio: r.fecha_inicio,
      fecha_fin: r.fecha_fin,
      estado: r.estado_reserva.toLowerCase(),
      link_pago: r.link_pago, // 👈 enlace para continuar el pago
    }));
  } catch (error) {
    console.error("Error al cargar reservas:", error);
  } finally {
    loading.value = false;
  }
}

async function cancelar(id) {
  const result = await Swal.fire({
    title: "¿Cancelar reserva?",
    text: "Se reembolsará el pago si aplica.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, cancelar",
    cancelButtonText: "No, mantener",
  });

  if (result.isConfirmed) {
    try {
      await CancelarReserva(id);
      await Swal.fire({
        icon: "success",
        title: "Reserva cancelada",
        text: "La reserva fue cancelada y el reembolso se procesó correctamente.",
        confirmButtonColor: "#3085d6",
      });
      await cargarReservas();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error al cancelar",
        text: error.message || "No se pudo cancelar la reserva.",
        confirmButtonColor: "#d33",
      });
    }
  }
}

// 🔗 función para continuar pago
function continuarPago(link) {
  if (!link) {
    Swal.fire({
      icon: "warning",
      title: "Link no disponible",
      text: "Esta reserva no tiene un enlace de pago activo.",
      confirmButtonColor: "#3085d6",
    });
    return;
  }
  window.open(link, "_blank");
}

onMounted(async () => {
  try {
    const data = await obtenerPerfilCliente();
    if (data?.cliente) cliente.value = data.cliente;
  } catch (error) {
    console.error("Error al cargar perfil:", error);
  }

  await cargarReservas();
});
</script>

<style scoped>
.perfil-cliente {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 4rem;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* ===== SECCIÓN CLIENTE ===== */
.cliente-info {
  background: var(--color-blanco);
  padding: 2rem 4rem;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  width: 100%;
}

.cliente-detalles h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--color-oscuro);
}

.cliente-detalles p {
  font-size: 1.1rem;
  margin-bottom: 0.6rem;
}

/* ===== TABLA ===== */
.reservas {
  background: var(--color-blanco);
  border-radius: 16px;
  padding: var(--padding-1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  width: 100%;
}

.reservas h2 {
  font-size: 1.8rem;
  margin-bottom: 1.2rem;
  color: var(--color-oscuro);
}

.tabla-scroll {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  min-width: 800px;
}

th {
  background: var(--color-info-luz);
  color: var(--color-oscuro);
  font-size: 1.05rem;
}

th,
td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid var(--color-info-luz);
}

.estado {
  display: inline-block;
  width: 100px;
  text-align: center;
  padding: 0.4rem 0;
  border-radius: 6px;
  font-weight: 600;
  color: var(--color-blanco);
}

.estado.pendiente {
  background-color: var(--color-naranja-3);
}

.estado.activa {
  background-color: var(--color-aprobado-1);
}

.estado.cancelada {
  background-color: var(--color-rojo-5);
}

.estado.finalizada {
  background-color: var(--color-azul-1);
}

.btn-cancelar {
  background-color: var(--color-rojo-5);
  color: var(--color-blanco);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 0.9rem;
  padding: 0.5rem 0.7rem;
  font-weight: 600;
}

.btn-cancelar:hover:not(:disabled) {
  background-color: var(--color-rojo-5);
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(183, 28, 28, 0.4);
}

.btn-cancelar:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* ===== BOTÓN PAGAR ===== */
.btn-pagar {
  background-color: var(--color-azul-1);
  color: var(--color-blanco);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 0.9rem;
  padding: 0.5rem 0.7rem;
  font-weight: 600;
}

.btn-pagar:hover {
  background-color: var(--color-azul-1);
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 91, 187, 0.4);
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .perfil-cliente {
    padding: 2rem;
  }

  .cliente-info,
  .reservas {
    padding: 1.8rem 2rem;
  }
}

@media (max-width: 768px) {
  .perfil-cliente {
    padding: 1rem;
  }

  .cliente-info {
    text-align: center;
    padding: 1.5rem;
  }

  .reservas {
    padding: 1.5rem;
  }

  .tabla-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  table {
    font-size: 0.85rem;
    min-width: 700px;
  }

  th,
  td {
    padding: 0.6rem;
  }
}
</style>
