<!-- frontend/src/views/GestionOcasiones.vue -->
<template>
  <main class="gestion-mesas">
    <!-- ===== GESTIONAR OCASIONES ===== -->
    <section class="actions" aria-label="Gestión de ocasiones">
      <h2>Gestionar Ocasiones</h2>
      <div class="actions__buttons">
        <button class="btn btn--primary" @click="openCreateOccasionModal">
          Crear Nueva Ocasión
        </button>
      </div>
    </section>

    <section class="results" aria-live="polite">
      <ul class="cards" v-if="ocasiones.length">
        <li v-for="ocasion in ocasiones" :key="ocasion.id_ocasion" class="card card--mini">
          <article>
            <div class="card__content">
              <header class="card__head">
                <h3 class="card__title">{{ ocasion.nombre_ocasion }}</h3>
              </header>
              <dl class="card__info">
                <div class="row">
                  <dt>Precio:</dt>
                  <dd>{{ formatCurrency(ocasion.precio_ocasion, ocasion.moneda) }}</dd>
                </div>
                <div class="row">
                  <dt>Moneda:</dt>
                  <dd>{{ ocasion.moneda }}</dd>
                </div>
              </dl>
            </div>
          </article>
        </li>
      </ul>
      <p v-else class="empty">No hay ocasiones registradas.</p>
    </section>

    <!-- ===== GESTIONAR MESAS ===== -->
    <section class="actions" aria-label="Gestión de mesas">
      <h2>Gestionar Mesas</h2>
      <div class="actions__buttons">
        <button class="btn btn--primary" @click="openCreateMesaModal">
          Crear Nueva Mesa
        </button>
      </div>
    </section>

    <section class="results" aria-live="polite">
      <ul class="cards" v-if="mesas.length">
        <li v-for="mesa in mesas" :key="mesa.id_mesa" class="card">
          <article>
            <div class="card__media" :style="{ '--img': `url(${mesa.foto_url || defaultImage})` }"></div>
            <div class="card__content">
              <header class="card__head">
                <h3 class="card__title">{{ mesa.nombre_mesa }}</h3>
                <span class="badge">{{ mesa.nombre_ambiente || 'Sin ambiente' }}</span>
              </header>
              <dl class="card__info">
                <div class="row">
                  <dt>Ubicación:</dt>
                  <dd>{{ mesa.ubicacion }}</dd>
                </div>
                <div class="row">
                  <dt>Capacidad:</dt>
                  <dd>{{ mesa.capacidad }} pers.</dd>
                </div>
              </dl>
              <footer class="card__actions">
                <button class="btn btn--primary btn--small" @click="openEditMesaModal(mesa)">Editar</button>
                <button class="btn btn--ghost btn--small" @click="confirmarEliminarMesa(mesa.id_mesa)">Eliminar</button>
              </footer>
            </div>
          </article>
        </li>
      </ul>
      <p v-else class="empty">No hay mesas registradas.</p>
    </section>

    <!-- ===== MODAL CREAR/EDITAR OCASIÓN ===== -->
    <teleport to="body">
      <div v-if="showOccasionModal" class="modal-backdrop" @click.self="closeOccasionModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="ocasion-title">
          <header class="modal__header">
            <h3 id="ocasion-title">Nueva Ocasión</h3>
            <button class="modal__close" @click="closeOccasionModal" aria-label="Cerrar">✕</button>
          </header>
          <div class="modal__body">
            <form class="form" @submit.prevent="guardarOcasion">
              <div class="grid">
                <div class="field">
                  <label for="nombre_ocasion">Nombre</label>
                  <input id="nombre_ocasion" v-model="formOcasion.nombre_ocasion" required />
                </div>
                <div class="field">
                  <label for="precio_ocasion">Precio</label>
                  <input id="precio_ocasion" type="number" step="0.01" v-model="formOcasion.precio_ocasion" required />
                </div>
                <div class="field">
                  <label for="moneda">Moneda</label>
                  <input id="moneda" v-model="formOcasion.moneda" required />
                </div>
              </div>
              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closeOccasionModal">Cancelar</button>
                <button type="submit" class="btn btn--primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>

    <!-- ===== MODAL CREAR/EDITAR MESA ===== -->
    <teleport to="body">
      <div v-if="showMesaModal" class="modal-backdrop" @click.self="closeMesaModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="mesa-title">
          <header class="modal__header">
            <h3 id="mesa-title">{{ mesaModalTitle }}</h3>
            <button class="modal__close" @click="closeMesaModal" aria-label="Cerrar">✕</button>
          </header>
          <div class="modal__body">
            <form class="form" @submit.prevent="guardarMesa">
              <div class="grid">
                <div class="field">
                  <label for="nombre_mesa">Nombre</label>
                  <input id="nombre_mesa" v-model="formMesa.nombre_mesa" required />
                </div>
                <div class="field">
                  <label for="id_ambiente">Ambiente</label>
                  <select id="id_ambiente" v-model="formMesa.id_ambiente" required>
                    <option value="" disabled>Selecciona un ambiente</option>
                    <option v-for="ambiente in ambientes" :key="ambiente.id_ambiente" :value="ambiente.id_ambiente">
                      {{ ambiente.nombre_ambiente }}
                    </option>
                  </select>
                </div>
                <div class="field">
                  <label for="capacidad">Capacidad</label>
                  <input id="capacidad" type="number" min="1" v-model="formMesa.capacidad" required />
                </div>
                <div class="field field--full">
                  <label for="ubicacion">Ubicación (Descripcion Minima)</label>
                  <textarea id="ubicacion" v-model="formMesa.ubicacion" required></textarea>
                </div>
                <div class="field field--full">
                  <label for="foto_url">URL de la foto</label>
                  <input id="foto_url" v-model="formMesa.foto_url" type="url" />
                </div>
              </div>
              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closeMesaModal">Cancelar</button>
                <button type="submit" class="btn btn--primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { crearOcasion, obtenerMisOcasiones } from "@/services/ocasion";
import { crearMesa, obtenerMisMesas, actualizarMesa, eliminarMesa } from "@/services/mesas";
import { obtenerAmbientes } from "@/services/ambientes";
import Swal from "sweetalert2";

const ocasiones = ref([]);
const mesas = ref([]);
const ambientes = ref([]);
const showOccasionModal = ref(false);
const showMesaModal = ref(false);
const mesaModalTitle = ref("Nueva Mesa");
const formOcasion = ref({ nombre_ocasion: "", precio_ocasion: "", moneda: "COP" });
const formMesa = ref({ id_mesa: null, nombre_mesa: "", id_ambiente: "", capacidad: "", ubicacion: "", foto_url: "" });
const defaultImage = 'https://via.placeholder.com/160';

/* ===== CARGAR OCASIONES ===== */
async function cargarOcasiones() {
  try {
    const result = await obtenerMisOcasiones();
    console.log("Ocasiones recibidas del API:", result);
    ocasiones.value = result;
  } catch (err) {
    console.error("Error al cargar ocasiones:", err);
    console.error("Detalles del error:", err.response?.data || err.message);
    Swal.fire({
      icon: "error",
      title: "Error al cargar ocasiones",
      text: err.response?.data?.message || "Error desconocido",
    });
  }
}

/* ===== CARGAR MESAS Y AMBIENTES ===== */
async function cargarMesasYAmbientes() {
  try {
    const [mesasResult, ambientesResult] = await Promise.all([
      obtenerMisMesas(),
      obtenerAmbientes(),
    ]);
    console.log("Mesas recibidas del API:", mesasResult);
    console.log("Ambientes recibidos del API:", ambientesResult);
    mesas.value = mesasResult;
    ambientes.value = ambientesResult;
  } catch (err) {
    console.error("Error al cargar mesas o ambientes:", err);
    console.error("Detalles del error:", err.response?.data || err.message);
    Swal.fire({
      icon: "error",
      title: "Error al cargar mesas o ambientes",
      text: err.response?.data?.message || "Error desconocido",
    });
  }
}

/* ===== MODAL OCASIÓN ===== */
function openCreateOccasionModal() {
  formOcasion.value = { nombre_ocasion: "", precio_ocasion: "", moneda: "COP" };
  showOccasionModal.value = true;
  document.body.style.overflow = "hidden";
}

function closeOccasionModal() {
  showOccasionModal.value = false;
  document.body.style.overflow = "";
}

/* ===== MODAL MESA ===== */
function openCreateMesaModal() {
  formMesa.value = { id_mesa: null, nombre_mesa: "", id_ambiente: "", capacidad: "", ubicacion: "", foto_url: "" };
  mesaModalTitle.value = "Nueva Mesa";
  showMesaModal.value = true;
  document.body.style.overflow = "hidden";
}

function openEditMesaModal(mesa) {
  formMesa.value = {
    id_mesa: mesa.id_mesa,
    nombre_mesa: mesa.nombre_mesa,
    id_ambiente: mesa.id_ambiente,
    capacidad: mesa.capacidad,
    ubicacion: mesa.ubicacion,
    foto_url: mesa.foto_url,
  };
  mesaModalTitle.value = "Editar Mesa";
  showMesaModal.value = true;
  document.body.style.overflow = "hidden";
}

function closeMesaModal() {
  showMesaModal.value = false;
  document.body.style.overflow = "";
}

/* ===== GUARDAR OCASIÓN ===== */
async function guardarOcasion() {
  try {
    console.log("Datos enviados para crear ocasión:", formOcasion.value);
    const nueva = await crearOcasion(formOcasion.value);
    console.log("Respuesta de crearOcasion:", nueva);
    ocasiones.value.push({ ...formOcasion.value, id_ocasion: nueva.id || Date.now() });
    closeOccasionModal();
    Swal.fire({
      icon: "success",
      title: "Ocasión creada",
      text: "La ocasión se ha registrado correctamente.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error("Error al crear ocasión:", err);
    console.error("Detalles del error:", err.response?.data || err.message);
    Swal.fire({
      icon: "error",
      title: "Error al crear ocasión",
      text: err.response?.data?.message || "Error desconocido",
    });
    closeOccasionModal();
  }
}

/* ===== GUARDAR MESA (CREAR O ACTUALIZAR) ===== */
async function guardarMesa() {
  try {
    let nuevaOActualizada;
    const data = { ...formMesa.value };
    delete data.id_mesa; // No enviar id en el body

    if (formMesa.value.id_mesa) {
      // Modo editar
      console.log("Datos enviados para actualizar mesa:", formMesa.value);
      nuevaOActualizada = await actualizarMesa(formMesa.value.id_mesa, data);
      console.log("Respuesta de actualizarMesa:", nuevaOActualizada);
      Swal.fire({
        icon: "success",
        title: "Mesa actualizada",
        text: "La mesa se ha actualizado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      // Modo crear
      console.log("Datos enviados para crear mesa:", formMesa.value);
      nuevaOActualizada = await crearMesa(data);
      console.log("Respuesta de crearMesa:", nuevaOActualizada);
      Swal.fire({
        icon: "success",
        title: "Mesa creada",
        text: "La mesa se ha registrado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
    }

    closeMesaModal();
    await cargarMesasYAmbientes(); // Recargar para reflejar cambios
  } catch (err) {
    console.error("Error al guardar mesa:", err);
    console.error("Detalles del error:", err.response?.data || err.message);
    Swal.fire({
      icon: "error",
      title: "Error al guardar mesa",
      text: err.response?.data?.message || "Error desconocido",
    });
  }
}

/* ===== ELIMINAR MESA ===== */
async function confirmarEliminarMesa(id) {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esta acción!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      await eliminarMesa(id);
      Swal.fire({
        icon: "success",
        title: "Mesa eliminada",
        text: "La mesa se ha eliminado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
      await cargarMesasYAmbientes(); // Recargar
    } catch (err) {
      console.error("Error al eliminar mesa:", err);
      Swal.fire({
        icon: "error",
        title: "Error al eliminar mesa",
        text: err.response?.data?.message || "Error desconocido",
      });
    }
  }
}

/* ===== FORMATO MONEDA ===== */
function formatCurrency(value, currency) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency || "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

onMounted(() => {
  cargarOcasiones();
  cargarMesasYAmbientes();
});
</script>

<style scoped>
/* Estilos base existentes */
.gestion-mesas {
  display: grid;
  gap: 1.25rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== Secciones ===== */
.actions {
  background: #fff;
  border-radius: 0.6rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 1rem;
}
.actions__buttons {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

/* ===== Cards (adaptado del otro código) ===== */
.results {
  max-width: 1200px;
  margin: 0 auto;
}

.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(12, 1fr);
}

.card {
  grid-column: span 12;
}

.card > article {
  background: var(--color-blanco, #fff);
  border-radius: var(--border-radius-3, 0.6rem);
  box-shadow: var(--box-shadow, 0 2px 6px rgba(0, 0, 0, 0.08));
  overflow: hidden;
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: start;
  height: 160px;
}

.card--mini {
  grid-column: span 12;
}

.card--mini > article {
  grid-template-columns: 1fr;
  height: auto;
  padding: 1rem;
}

.card__media {
  background-image: var(--img);
  background-size: cover;
  background-position: center;
  min-height: 160px;
}

.card__content {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  overflow: hidden;
}

.card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card__title {
  margin: 0;
  color: var(--color-oscuro);
  font-size: 1.0rem;
}

.badge {
  padding: .25rem .5rem;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--color-azul-1), var(--color-primary-variant));
  color: var(--color-blanco);
  font-weight: 700;
  font-size: .75rem;
}

.card__info {
  display: grid;
  gap: .35rem;
  overflow: hidden;
  font-size: 0.85rem;
}

.card__info .row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: .5rem;
}

.card__info dt {
  color: var(--color-dark-variant);
}

.card__info dd {
  margin: 0;
  color: var(--color-oscuro);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card__actions {
  display: flex;
  gap: .6rem;
  margin-top: 0.6rem;
  justify-content: flex-end;
  margin-bottom: 0;
}

/* ===== Empty ===== */
.empty {
  color: var(--color-oscuro);
  font-style: italic;
  text-align: center;
  margin: 1rem 0;
  background: var(--color-blanco);
  border-radius: 0.6rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 1rem;
}

/* ===== Modal (estilos existentes) ===== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 1000;
}
.modal {
  background: #fff;
  width: min(820px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 0.6rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
.modal {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.modal::-webkit-scrollbar {
  display: none;
}
.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #d1e3ff;
}
.modal__header h3 {
  margin: 0;
  color: var(--color-oscuro);
}
.modal__close {
  background: transparent;
  border: 1px solid #d1e3ff;
  border-radius: 0.4rem;
  padding: 0.25rem 0.45rem;
  cursor: pointer;
}
.modal__body {
  padding: 1rem;
  display: grid;
  gap: 1rem;
}
.form .grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(12, 1fr);
}
.form .field {
  grid-column: span 12;
  display: grid;
  gap: 0.25rem;
}
.form .field--full {
  grid-column: span 12;
}
.form .field label {
  color: var(--color-oscuro);
  font-weight: 700;
}
.form input,
.form select,
.form textarea {
  border: 1px solid #d1e3ff;
  border-radius: 0.4rem;
  padding: 0.55rem 0.7rem;
  font: inherit;
  background: var(--color-blanco);
}
.form textarea {
  resize: vertical;
  min-height: 100px;
}
.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding-top: 0.5rem;
}

/* ===== Botones ===== */
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
  background: var(--color-blanco);
  border-color: var(--color-info-luz);
  color: var(--color-oscuro);
}
.btn--small {
  --_pad: 0.4rem 0.8rem;
  font-size: 0.9rem;
}
:focus-visible {
  outline: 3px solid #ffd700;
  outline-offset: 2px;
}

/* ===== Responsive ===== */
@media (min-width: 720px) {
  .form .field {
    grid-column: span 6;
  }
  .form .field--full {
    grid-column: span 12;
  }
  .card {
    grid-column: span 6;
  }
  .card--mini {
    grid-column: span 6;
  }
}

@media (min-width: 1100px) {
  .card {
    grid-column: span 4;
  }
  .card--mini {
    grid-column: span 4;
  }
}
</style>