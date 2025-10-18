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
                        <tr v-for="reserva in reservas" :key="reserva.id">
                            <td>#{{ reserva.id }}</td>
                            <td>{{ reserva.cliente }}</td>
                            <td>{{ reserva.mesa }}</td>
                            <td>{{ reserva.ocasion }}</td>
                            <td>{{ formatearFecha(reserva.fecha_inicio) }}</td>
                            <td>{{ formatearFecha(reserva.fecha_fin) }}</td>
                            <td>
                                <span class="estado" :class="{
                                    pendiente: reserva.estado === 'Pendiente',
                                    confirmada: reserva.estado === 'Confirmada',
                                    cancelada: reserva.estado === 'Cancelada'
                                }">
                                    {{ reserva.estado }}
                                </span>
                            </td>
                            <td>
                                <button class="btn-cancelar" :disabled="reserva.estado === 'Cancelada'"
                                    @click="cancelarReserva(reserva.id)">
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
        id: 12,
        cliente: "Laura Martínez",
        mesa: "Mesa 4",
        ocasion: "Cumpleaños",
        fecha_inicio: "2025-10-20 18:00",
        fecha_fin: "2025-10-20 20:00",
        estado: "Pendiente",
    },
    {
        id: 13,
        cliente: "Carlos Gómez",
        mesa: "Mesa 2",
        ocasion: "Cena Romántica",
        fecha_inicio: "2025-09-28 19:00",
        fecha_fin: "2025-09-28 21:00",
        estado: "Confirmada",
    },
    {
        id: 14,
        cliente: "Ana Torres",
        mesa: "Mesa 1",
        ocasion: "Reunión",
        fecha_inicio: "2025-09-10 10:00",
        fecha_fin: "2025-09-10 11:30",
        estado: "Cancelada",
    },
    {
        id: 15,
        cliente: "Pedro López",
        mesa: "Mesa 3",
        ocasion: "Aniversario",
        fecha_inicio: "2025-11-01 20:00",
        fecha_fin: "2025-11-01 22:00",
        estado: "Pendiente",
    },
    {
        id: 16,
        cliente: "Sofía Ramírez",
        mesa: "Mesa 5",
        ocasion: "Cena Familiar",
        fecha_inicio: "2025-11-05 19:30",
        fecha_fin: "2025-11-05 21:30",
        estado: "Confirmada",
    },
    {
        id: 17,
        cliente: "Luis Fernández",
        mesa: "Mesa 6",
        ocasion: "Trabajo",
        fecha_inicio: "2025-11-10 12:00",
        fecha_fin: "2025-11-10 13:30",
        estado: "Pendiente",
    },
    {
        id: 18,
        cliente: "Valentina Castro",
        mesa: "Mesa 7",
        ocasion: "Cumpleaños",
        fecha_inicio: "2025-11-15 19:00",
        fecha_fin: "2025-11-15 21:00",
        estado: "Pendiente",
    },
]);

function cancelarReserva(id) {
    const reserva = reservas.value.find((r) => r.id === id);
    if (reserva && reserva.estado !== "Cancelada") {
        reserva.estado = "Cancelada";
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

.btn-cancelar:disabled {
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
