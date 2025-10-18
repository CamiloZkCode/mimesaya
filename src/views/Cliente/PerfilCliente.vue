<template>
  <main class="perfil-cliente">
    <!-- ===== INFO DEL CLIENTE ===== -->
    <section class="cliente-info">
      <div class="cliente-detalles">
        <h2>Perfil del Cliente</h2>
        <p><strong>Nombre:</strong> Laura Martínez</p>
        <p><strong>Correo:</strong> laura.martinez@example.com</p>
        <p><strong>Teléfono:</strong> +57 312 987 6543</p>
      </div>
    </section>

    <!-- ===== TABLA DE RESERVAS ===== -->
    <section class="reservas">
      <h2>Mis Reservas</h2>

      <div class="tabla-scroll">
        <table>
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
                    pendiente: reserva.estado === 'Pendiente',
                    confirmada: reserva.estado === 'Confirmada',
                    cancelada: reserva.estado === 'Cancelada'
                  }"
                >
                  {{ reserva.estado }}
                </span>
              </td>
              <td>
                <button class="btn-cancelar" :disabled="reserva.estado === 'Cancelada'">
                  Cancelar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";

const reservas = ref([
  {
    id: "0012",
    restaurante: "La Parrilla Gourmet",
    mesa: "Mesa 4",
    ocasion: "Cumpleaños",
    fecha_inicio: "2025-10-20 18:00",
    fecha_fin: "2025-10-20 20:00",
    estado: "Pendiente",
  },
  {
    id: "0013",
    restaurante: "El Sabor del Mar",
    mesa: "Mesa 2",
    ocasion: "Cena Romántica",
    fecha_inicio: "2025-09-28 19:00",
    fecha_fin: "2025-09-28 21:00",
    estado: "Confirmada",
  },
  {
    id: "0014",
    restaurante: "Café Central",
    mesa: "Mesa 1",
    ocasion: "Reunión",
    fecha_inicio: "2025-09-10 10:00",
    fecha_fin: "2025-09-10 11:30",
    estado: "Cancelada",
  },
]);

function formatearFecha(fechaString) {
  const fecha = new Date(fechaString);
  const opcionesFecha = { day: "2-digit", month: "2-digit", year: "numeric" };
  const opcionesHora = { hour: "2-digit", minute: "2-digit", hour12: false };
  const fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha);
  const horaFormateada = fecha.toLocaleTimeString("es-ES", opcionesHora);
  return `${fechaFormateada} - ${horaFormateada}`;
}
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

.estado.confirmada {
  background-color: var(--color-aprobado-1);
}

.estado.cancelada {
  background-color: var(--color-rojo-5);
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
  background-color: var(--color-rojo-6);
}

.btn-cancelar:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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
