<template>
    <main class="gestion-reservas">
        <section class="reservas">
            <h2>Reservas del Restaurante</h2>

            <!-- ===== FILTROS ===== -->
            <div class="filtros">
                <div class="campo-filtro">
                    <label for="tipoFiltro">Filtrar por:</label>
                    <select id="tipoFiltro" v-model="filtroTipo">
                        <option value="dia">Día</option>
                        <option value="mes">Mes</option>
                    </select>
                </div>

                <div class="campo-filtro">
                    <label for="fechaFiltro">Fecha:</label>
                    <input v-if="filtroTipo === 'dia'" type="date" v-model="filtroFecha" />
                    <input v-if="filtroTipo === 'mes'" type="month" v-model="filtroMes" />
                </div>

                <div class="campo-filtro">
                    <label for="estadoFiltro">Estado:</label>
                    <select v-model="filtroEstado">
                        <option value="todas">Todas</option>
                        <option value="pendiente_pago">Pendientes</option>
                        <option value="activa">Activas</option>
                        <option value="cancelada">Canceladas</option>
                        <option value="finalizada">Finalizadas</option>
                    </select>
                </div>

                <button @click="filtrarReservas" class="btn-filtrar">Aplicar filtro</button>
                <button @click="resetearFiltros" class="btn-reset">Resetear</button>
                <button @click="exportarExcelHandler" class="btn-exportar">Exportar Excel</button>
            </div>

            <!-- ===== TABLA ===== -->
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
                        <tr v-for="reserva in reservasFiltradas" :key="reserva.id_reserva">
                            <td>#{{ reserva.id_reserva }}</td>
                            <td>{{ reserva.nombre_cliente }}</td>
                            <td>{{ reserva.nombre_mesa || '-' }}</td>
                            <td>{{ reserva.nombre_ocasion || '-' }}</td>
                            <td>{{ formatearFecha(reserva.fecha_inicio) }}</td>
                            <td>{{ formatearFecha(reserva.fecha_fin) }}</td>
                            <td>
                                <span class="estado" :class="estadoClass(reserva.estado_reserva)">
                                    {{ formatearEstado(reserva.estado_reserva) }}
                                </span>
                            </td>
                            <td>
                                <div class="acciones">
                                    <button class="btn-finalizar" :disabled="reserva.estado_reserva !== 'activa'"
                                        @click="finalizarReserva(reserva.id_reserva)">Finalizar</button>
                                    <button class="btn-cancelar" :disabled="reserva.estado_reserva !== 'activa'"
                                        @click="cancelarReserva(reserva.id_reserva)">Cancelar</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="reservasFiltradas.length === 0" class="sin-datos">No hay reservas registradas.</p>
            </div>
        </section>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import { exportarExcel } from "@/store/exportexcel";
import { obtenerReservasRestaurante, cancelarReservaAdmin, finalizarReservaAdmin } from "@/services/reservas";

// VARIABLES
const reservas = ref([]);
const filtroTipo = ref("dia");
const filtroFecha = ref("");
const filtroMes = ref("");
const filtroEstado = ref("todas");

// CARGAR RESERVAS
async function cargarReservas() {
    try {
        reservas.value = await obtenerReservasRestaurante();
    } catch {
        Swal.fire("Error", "No se pudieron cargar las reservas", "error");
    }
}

// FILTRO
const reservasFiltradas = computed(() => {
    let filtradas = [...reservas.value];

    if (filtroTipo.value === "dia" && filtroFecha.value) {
        filtradas = filtradas.filter(r => r.fecha_inicio.split(" ")[0] === filtroFecha.value);
    } else if (filtroTipo.value === "mes" && filtroMes.value) {
        const [anio, mes] = filtroMes.value.split("-").map(Number);
        filtradas = filtradas.filter(r => {
            const [a, m] = r.fecha_inicio.split(" ")[0].split("-").map(Number);
            return a === anio && m === mes;
        });
    }

    if (filtroEstado.value !== "todas") {
        filtradas = filtradas.filter(r => r.estado_reserva === filtroEstado.value);
    }

    return filtradas;
});

// BOTONES
function filtrarReservas() {
    if (filtroTipo.value === "dia" && !filtroFecha.value) Swal.fire("Atención", "Selecciona un día para filtrar.", "info");
    if (filtroTipo.value === "mes" && !filtroMes.value) Swal.fire("Atención", "Selecciona un mes para filtrar.", "info");
}

function resetearFiltros() {
    filtroFecha.value = "";
    filtroMes.value = "";
    filtroEstado.value = "todas";
}

// EXPORTAR EXCEL
async function exportarExcelHandler() {
    if (!reservasFiltradas.value.length) return Swal.fire("Sin datos", "No hay reservas para exportar.", "info");

    const datos = reservasFiltradas.value.map(r => ({
        "ID Reserva": r.id_reserva,
        Cliente: r.nombre_cliente,
        Mesa: r.nombre_mesa || "-",
        Ocasión: r.nombre_ocasion || "-",
        "Fecha Inicio": formatearFecha(r.fecha_inicio),
        "Fecha Fin": formatearFecha(r.fecha_fin),
        Estado: formatearEstado(r.estado_reserva),
    }));

    const total = datos.length;
    const canceladas = reservasFiltradas.value.filter(r => r.estado_reserva === "cancelada").length;
    const finalizadas = reservasFiltradas.value.filter(r => r.estado_reserva === "finalizada").length;

    const resumen = [
        { Resumen: "Reservas Canceladas", Cantidad: canceladas },
        { Resumen: "Reservas Finalizadas", Cantidad: finalizadas },
        { Resumen: "Total de Reservas", Cantidad: total }
    ];

    await exportarExcel(datos, "Reporte_Reservas.xlsx", resumen);
}

// ACCIONES
async function cancelarReserva(id) {
    const confirm = await Swal.fire({ title: "¿Cancelar esta reserva?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, cancelar" });
    if (!confirm.isConfirmed) return;
    try { await cancelarReservaAdmin(id); Swal.fire("Cancelada", "La reserva fue cancelada.", "success"); await cargarReservas(); } catch { Swal.fire("Error", "No se pudo cancelar la reserva.", "error"); }
}

async function finalizarReserva(id) {
    const confirm = await Swal.fire({ title: "¿Finalizar esta reserva?", icon: "question", showCancelButton: true, confirmButtonText: "Sí, finalizar" });
    if (!confirm.isConfirmed) return;
    try { await finalizarReservaAdmin(id); Swal.fire("Finalizada", "Reserva finalizada correctamente.", "success"); await cargarReservas(); } catch { Swal.fire("Error", "No se pudo finalizar la reserva.", "error"); }
}

// FORMATOS
function formatearFecha(f) {
    const [fecha, hora] = f.split(" ");
    const [a, m, d] = fecha.split("-");
    return `${d}/${m}/${a} ${hora}`;
}

function formatearEstado(e) {
    return { pendiente_pago: "Pendiente", activa: "Activa", cancelada: "Cancelada", finalizada: "Finalizada" }[e] || e;
}

function estadoClass(e) {
    return { pendiente_pago: "pendiente", activa: "activa", cancelada: "cancelada", finalizada: "finalizada" }[e] || "";
}

onMounted(() => cargarReservas());
</script>

<style scoped>
/* ===== FILTROS ===== */
.filtros {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.campo-filtro {
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.campo-filtro label {
    font-weight: 600;
    color: var(--color-oscuro);
    font-size: 0.95rem;
    white-space: nowrap;
}

.campo-filtro select,
.campo-filtro input {
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 1rem;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
}

.campo-filtro select:focus,
.campo-filtro input:focus {
    outline: none;
    border-color: var(--color-azul-1);
    box-shadow: 0 0 5px rgba(79, 70, 229, 0.3);
}

.btn-filtrar,
.btn-reset,
.btn-exportar {
    background-color: var(--color-azul-1);
    color: white;
    border: none;
    padding: 0.55rem 0.9rem;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.3s;
    font-weight: 600;
    white-space: nowrap;
}

.btn-reset {
    background-color: var(--color-naranja-3);
}

.btn-exportar {
    background-color: var(--color-aprobado-1);
}

.btn-filtrar:hover,
.btn-reset:hover,
.btn-exportar:hover {
    opacity: 0.8;
}

.tabla-scroll {
    width: 100%;
    overflow-x: auto;
    overflow-y: auto;
    max-height: 350px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tabla-scroll {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.tabla-scroll::-webkit-scrollbar {
    display: none;
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
    position: sticky;
    top: 0;
    z-index: 1;
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

.acciones {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
}

.btn-cancelar,
.btn-finalizar {
    color: var(--color-blanco);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.3s;
    font-size: 0.9rem;
    padding: 0.5rem 0.7rem;
    font-weight: 600;
    white-space: nowrap;
}

.btn-cancelar {
    background-color: var(--color-rojo-5);
}

.btn-finalizar {
    background-color: var(--color-azul-1);
}

.btn-cancelar:disabled,
.btn-finalizar:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

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

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
    .gestion-reservas {
        padding: 1.5rem;
    }

    .reservas {
        padding: 1.5rem;
    }

    .filtros {
        flex-direction: column;
        align-items: stretch;
    }

    .campo-filtro {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
    }

    .campo-filtro label {
        margin-bottom: 0.2rem;
    }

    .campo-filtro select,
    .campo-filtro input {
        width: 100%;
    }

    .btn-filtrar,
    .btn-reset,
    .btn-exportar {
        width: 100%;
        text-align: center;
    }
}

@media (max-width: 768px) {
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
