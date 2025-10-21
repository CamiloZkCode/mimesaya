<template>
    <main class="gestion-reservas">
        <section class="reservas">
            <h2>Reservas del Restaurante</h2>

            <div class="tabla-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>ID Reserva</th>
                            <th>Cliente</th>
                            <th>Mesa</th>
                            <th>Ocasión</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="reserva in reservas" :key="reserva.id_reserva">
                            <td>#{{ reserva.id_reserva }}</td>
                            <td>{{ reserva.nombre_cliente }}</td>
                            <td>{{ reserva.nombre_mesa || '-' }}</td>
                            <td>{{ reserva.nombre_ocasion || '-' }}</td>
                            <td>{{ formatearFecha(reserva.fecha_inicio) }}</td>
                            <td>{{ formatearFecha(reserva.fecha_fin) }}</td>
                            <td>
                                <span class="estado" :class="{
                                    pendiente: reserva.estado_reserva === 'pendiente_pago',
                                    activa: reserva.estado_reserva === 'activa',
                                    cancelada: reserva.estado_reserva === 'cancelada',
                                    finalizada: reserva.estado_reserva === 'finalizada'
                                }">
                                    {{ reserva.estado_reserva }}
                                </span>
                            </td>
                            <td>
                                <div class="acciones">
                                    <!-- Botón Finalizar -->
                                    <button class="btn-finalizar" :disabled="reserva.estado_reserva !== 'activa'"
                                        @click="finalizarReserva(reserva.id_reserva)">
                                        Finalizar
                                    </button>

                                    <!-- Botón Cancelar -->
                                    <button class="btn-cancelar" :disabled="reserva.estado_reserva !== 'activa'"
                                        @click="cancelarReserva(reserva.id_reserva)">
                                        Cancelar
                                    </button>
                                </div>
                            </td>

                        </tr>
                    </tbody>
                </table>

                <p v-if="reservas.length === 0" class="sin-datos">No hay reservas registradas.</p>
            </div>
        </section>
    </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
    obtenerReservasRestaurante,
    cancelarReservaAdmin,
    finalizarReservaAdmin,
} from "@/services/reservas";
import Swal from "sweetalert2";

const reservas = ref([]);

async function cargarReservas() {
    try {
        const data = await obtenerReservasRestaurante();
        reservas.value = data;
    } catch (err) {
        console.error("Error al cargar reservas:", err);
        Swal.fire("Error", err.message || "No se pudieron cargar las reservas", "error");
    }
}

async function cancelarReserva(id) {
    const confirm = await Swal.fire({
        title: "¿Cancelar esta reserva?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
        await cancelarReservaAdmin(id);
        Swal.fire("Reserva cancelada", "La reserva ha sido cancelada exitosamente", "success");
        await cargarReservas();
    } catch (err) {
        Swal.fire("Error", err.message || "No se pudo cancelar la reserva", "error");
    }
}

async function finalizarReserva(id) {
    const confirm = await Swal.fire({
        title: "¿Finalizar esta reserva?",
        text: "Esto marcará la reserva como completada.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, finalizar",
        cancelButtonText: "No",
    });

    if (!confirm.isConfirmed) return;

    try {
        await finalizarReservaAdmin(id);
        Swal.fire("Reserva finalizada", "La reserva ha sido finalizada correctamente", "success");
        await cargarReservas();
    } catch (err) {
        Swal.fire("Error", err.message || "No se pudo finalizar la reserva", "error");
    }
}

function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const opcionesFecha = { day: "2-digit", month: "2-digit", year: "numeric" };
    const opcionesHora = { hour: "2-digit", minute: "2-digit", hour12: false };
    const fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha);
    const horaFormateada = fecha.toLocaleTimeString("es-ES", opcionesHora);
    return `${fechaFormateada} - ${horaFormateada}`;
}

onMounted(() => {
    cargarReservas();
});
</script>


<style scoped>
.gestion-reservas {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem 4rem;
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    box-sizing: border-box;
}

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
    border-left: 1px;
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

/* Colores por estado */
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

.acciones {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
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

.btn-cancelar:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.btn-finalizar {
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

.btn-finalizar:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}



/* ===== Responsive ===== */
@media (max-width: 1024px) {
    .gestion-reservas {
        padding: 2rem;
    }

    .reservas {
        padding: 1.8rem 2rem;
    }
}

@media (max-width: 768px) {
    .gestion-reservas {
        padding: 1rem;
    }

    .reservas {
        padding: 1.5rem;
    }

    .tabla-scroll {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    table {
        font-size: 0.9rem;
        min-width: 700px;
    }

    th,
    td {
        padding: 0.6rem;
    }
}
</style>
