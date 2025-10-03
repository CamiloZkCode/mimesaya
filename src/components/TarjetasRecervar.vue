<template>
  <main class="reservas">
    <!-- ===== NAVBAR / FILTROS ===== -->
    <section class="filters" aria-label="Filtros de búsqueda">
      <div class="filters__row">
        <div class="field">
          <label for="f-lugar">Restaurante</label>
          <select id="f-lugar" v-model="filters.restaurant">
            <option value="">Todos</option>
            <option v-for="r in restaurants" :key="r.value" :value="r.value">{{ r.label }}</option>
          </select>
        </div>

        <div class="field">
          <label for="f-ambiente">Ambientes</label>
          <select id="f-ambiente" v-model="filters.ambiente">
            <option value="">Todos</option>
            <option v-for="p in places" :key="p.value" :value="p.value">{{ p.label }}</option>
          </select>
        </div>

        <div class="field">
          <label for="f-personas">Personas</label>
          <select id="f-personas" v-model.number="filters.people">
            <option :value="0">Cualquiera</option>
            <option v-for="n in peopleOptions" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <div class="field">
          <label for="f-fecha">Fecha</label>
          <input id="f-fecha" type="date" v-model="filters.date" />
        </div>

        <div class="filters__actions">
          <button class="btn btn--primary" @click="applyFilters">Aplicar</button>
          <button class="btn btn--ghost" @click="clearFilters">Limpiar</button>
        </div>
      </div>

      <div class="filters__meta">
        <span>{{ filteredTables.length }} resultados</span>
        <span v-if="filtersSummary">• {{ filtersSummary }}</span>
      </div>
    </section>

    <!-- ===== LISTADO DE MESAS ===== -->
    <section class="results" aria-live="polite">
      <ul class="cards" v-if="currentPageTables.length">
        <li v-for="t in currentPageTables" :key="t.id_mesa" class="card">
          <article>
            <div class="card__media" :style="{ '--img': `url(${t.foto_url || defaultImage})` }"></div>
            <div class="card__content">
              <header class="card__head">
                <h3 class="card__title">{{ t.nombre_mesa }}</h3>
                <span class="badge">{{ t.nombre_ambiente || '—' }}</span>
              </header>
              <dl class="card__info">
                <div class="row">
                  <dt>Restaurante:</dt>
                  <dd>{{ t.nombre_restaurante }}</dd>
                </div>
                <div class="row">
                  <dt>Capacidad</dt>
                  <dd>{{ t.capacidad }} pers.</dd>
                </div>
                <div class="row">
                  <dt>Fecha</dt>
                  <dd>{{ displayDate }}</dd>
                </div>
              </dl>
              <footer class="card__actions">
                <button class="btn btn--primary btn--small" @click="openModal(t)">Reservar</button>
              </footer>
            </div>
          </article>
        </li>
      </ul>

      <!-- Paginación -->
      <div class="pagination" v-if="filteredTables.length > perPage">
        <button class="btn btn--ghost" @click="prevPage" :disabled="currentPage === 1">Anterior</button>
        <button v-for="page in totalPages" :key="page" class="btn btn--ghost"
          :class="{ 'btn--active': page === currentPage }" @click="currentPage = page">
          {{ page }}
        </button>
        <button class="btn btn--ghost" @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
      </div>

      <!-- Vacío -->
      <div v-else-if="filteredTables.length === 0" class="empty">
        <p>No hay mesas que coincidan con tus filtros.</p>
        <button class="btn btn--ghost" @click="suggestRelaxFilters">Sugerir ajustes</button>
      </div>
    </section>

    <!-- ===== MODAL RESERVA ===== -->
    <teleport to="body">
      <div v-if="modal.open" class="modal-backdrop" @click.self="closeModal" :aria-hidden="!modal.open">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="reserva-title" ref="modalRef"
          @keydown.esc.prevent="closeModal">
          <header class="modal__header">
            <h3 id="reserva-title">Confirmar reserva/{{ modal.table?.nombre_mesa }}</h3>
            <button class="modal__close" @click="closeModal" aria-label="Cerrar">✕</button>
          </header>

          <section class="modal__body">
            <div class="modal__details">
              <p><strong>Restaurante:</strong> {{ modal.table?.nombre_restaurante }}</p>
              <p><strong>Lugar:</strong> {{ modal.table?.nombre_ambiente || '—' }}</p>
              <p><strong>Capacidad:</strong> {{ modal.table?.capacidad }} pers.</p>
              <p><strong>Fecha:</strong> {{ displayDate }}</p>
              <p><strong>Hora:</strong> {{ form.time || 'A convenir' }}</p>
              <p><strong>Usuario:</strong> {{ userData.nombre || 'Cargando...' }}</p>
              <p><strong>Correo:</strong> {{ userData.correo || 'Cargando...' }}</p>
              <p><strong>Teléfono:</strong> {{ userData.telefono || 'Cargando...' }}</p>
            </div>

            <form class="form" @submit.prevent="submitReservation">
              <div v-if="formError" class="form__error">
                {{ formError }}
              </div>
              <div class="grid">
                <div class="field">
                  <label for="r-hora">Hora</label>
                  <select id="r-hora" v-model="form.time" required>
                    <option value="">Seleccionar hora</option>
                    <option v-for="h in timeSlots" :key="h" :value="h">{{ h }}</option>
                  </select>
                </div>

                <div class="field">
                  <label for="r-ocasion">Ocasión</label>
                  <select id="r-ocasion" v-model="form.occasionId" @change="actualizarPrecio">
                    <option :value="null">Ninguna (3.000 COP)</option>
                    <option v-for="o in occasionOptions" :key="o.id_ocasion" :value="o.id_ocasion">
                      {{ o.nombre_ocasion }} - {{ o.precio_ocasion }} COP
                    </option>
                  </select>
                </div>

                <div class="field" style="grid-column: 1 / -1;">
                  <p><strong>Total a pagar:</strong> {{ precioSeleccionado }} COP</p>
                </div>

                <div class="field" style="grid-column: 1 / -1;">
                  <label for="r-notas">Notas / preferencias</label>
                  <textarea id="r-notas" v-model.trim="form.notes" rows="3"
                    placeholder="Ej.: silla para bebé, pastel sorpresa, alérgenos..."></textarea>
                </div>

                <div class="checks">
                  <label class="chk">
                    <input type="checkbox" v-model="form.acceptsPolicy" required />
                    <span>Acepto la política de privacidad</span>
                  </label>
                </div>
              </div>

              <div class="modal__actions">
                <button type="button" class="btn btn--ghost" @click="closeModal">Cancelar</button>
                <button type="submit" class="btn btn--primary">Confirmar</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </teleport>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { obtenerAmbientes } from '@/services/ambientes';
import { obtenerRestaurantes } from '@/services/restaurante';
import { obtenerMesasDisponibles } from '@/services/mesas';
import { obtenerHorariosDisponibles, crearReserva, confirmarReserva } from '@/services/reservas';
import { obtenerOcasionesPorRestaurante } from '@/services/ocasion';
import { obtenerUsuario } from '@/services/usuarios';
import Swal from 'sweetalert2';

/* ---------- Estado del usuario ---------- */
const userData = reactive({
  nombre: '',
  telefono: '',
  correo: '',
});

/* ---------- Catálogos ---------- */
const places = ref([]);
const restaurants = ref([]);
const tables = ref([]);
const defaultImage = 'https://via.placeholder.com/160';
const peopleOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const timeSlots = ref([]);
const occasionOptions = ref([]);

/* ---------- Paginación ---------- */
const perPage = 30;
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(filteredTables.value.length / perPage));
const currentPageTables = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  const end = start + perPage;
  return filteredTables.value.slice(start, end);
});

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

/* ---------- Estado filtros ---------- */
const todayISO = new Date().toISOString().slice(0, 10);
const filters = reactive({
  restaurant: '',
  ambiente: '',
  people: 0,
  date: todayISO,
});
const applied = reactive({ ...filters });

/* ---------- Vue Router ---------- */
const route = useRoute();
const router = useRouter();

/* ---------- Precio dinámico ---------- */
const precioSeleccionado = ref(3000);

function actualizarPrecio() {
  const selectedOption = occasionOptions.value.find(o => o.id_ocasion === form.occasionId);
  precioSeleccionado.value = selectedOption ? selectedOption.precio_ocasion : 3000;
}

/* ---------- Cargar datos iniciales ---------- */
onMounted(async () => {
  try {
    // Cargar datos del usuario
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const usuario = await obtenerUsuario();
        userData.nombre = usuario.nombre;
        userData.telefono = usuario.telefono;
        userData.correo = usuario.correo;
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los datos del usuario. Por favor, inicia sesión nuevamente.',
          icon: 'error',
          confirmButtonText: 'OK',
        }).then(() => {
          router.push('/login');
        });
      }
    }

    // Cargar restaurantes
    const restaurantesData = await obtenerRestaurantes();
    restaurants.value = restaurantesData.map(r => ({
      value: r.id_restaurante,
      label: r.nombre_restaurante,
    }));

    // Cargar ambientes
    const ambientesData = await obtenerAmbientes();
    places.value = ambientesData.map(a => ({
      value: a.id_ambiente,
      label: a.nombre_ambiente,
    }));

    // Aplicar filtro inicial desde la URL
    if (route?.query?.tipo && typeof route.query.tipo === 'string' && restaurants.value.length) {
      const matchingRestaurant = restaurants.value.find(r => r.label === route.query.tipo);
      if (matchingRestaurant) {
        filters.restaurant = matchingRestaurant.value;
      }
    }

    // Aplicar filtros iniciales
    await applyFilters();

    // Verificar si estamos en la página de éxito
    if (route.path === '/reserva/success') {
      await handleSuccess();
    }
  } catch (error) {
    console.error('Error al cargar datos:', error);
    Swal.fire('Error', 'No se pudieron cargar los datos. Intenta de nuevo.', 'error');
  }

  window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => window.removeEventListener('keydown', onKeydown));

async function applyFilters() {
  Object.assign(applied, filters);
  currentPage.value = 1;
  try {
    const params = {
      id_restaurante: applied.restaurant || undefined,
      id_ambiente: applied.ambiente || undefined,
      min_capacidad: applied.people || undefined,
      fecha: applied.date,
    };
    tables.value = await obtenerMesasDisponibles(params);
  } catch (error) {
    console.error('Error al cargar mesas:', error);
    tables.value = [];
    Swal.fire('Error', 'No se pudieron cargar las mesas disponibles.', 'error');
  }
}

function clearFilters() {
  filters.restaurant = '';
  filters.ambiente = '';
  filters.people = 0;
  filters.date = todayISO;
  applyFilters();
}

/* ---------- Computados ---------- */
const filteredTables = computed(() => tables.value);

const filtersSummary = computed(() => {
  const parts = [];
  if (applied.restaurant) {
    const restaurant = restaurants.value.find(r => r.value === applied.restaurant);
    if (restaurant) parts.push(restaurant.label);
  }
  if (applied.ambiente) {
    const ambiente = places.value.find(p => p.value === applied.ambiente);
    if (ambiente) parts.push(ambiente.label);
  }
  if (applied.people) parts.push(`${applied.people} pers.`);
  if (applied.date !== todayISO) parts.push(applied.date.split('-').reverse().join('/'));
  return parts.join(' · ');
});

const displayDate = computed(() => applied.date.split('-').reverse().join('/'));

/* ---------- Modal ---------- */
const modal = reactive({ open: false, table: null });
const modalRef = ref(null);
const formError = ref('');

const form = reactive({
  time: '',
  occasionId: null,
  notes: '',
  acceptsPolicy: false,
});

async function openModal(t) {
  modal.table = t;
  modal.open = true;
  formError.value = '';
  if (!form.notes) {
    form.notes = `Reserva para ${applied.people || t.capacidad} personas en ${t.nombre_ambiente || '—'}.`;
  }
  try {
    // Cargar horarios disponibles
    timeSlots.value = await obtenerHorariosDisponibles(t.id_mesa, applied.date);

    // Cargar ocasiones para el restaurante
    const ocasiones = await obtenerOcasionesPorRestaurante(t.id_restaurante);
    occasionOptions.value = ocasiones;
    actualizarPrecio();
  } catch (error) {
    console.error('Error al cargar datos:', error);
    timeSlots.value = [];
    occasionOptions.value = [];
    formError.value = error.message || 'No hay horarios ni ocasiones disponibles para esta mesa.';
  }
  requestAnimationFrame(() => {
    modalRef.value?.querySelector('#r-hora')?.focus();
  });
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.open = false;
  form.time = '';
  form.occasionId = null;
  form.notes = '';
  form.acceptsPolicy = false;
  formError.value = '';
  document.body.style.overflow = '';
}

async function submitReservation() {
  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire({
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para continuar con la reserva.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Iniciar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login');
      }
    });
    return;
  }

  if (!form.time || !form.acceptsPolicy) {
    formError.value = 'Por favor, selecciona una hora y acepta la política de privacidad.';
    return;
  }

  const payload = {
    id_restaurante: modal.table.id_restaurante,
    id_mesa: modal.table.id_mesa,
    id_ocasion: form.occasionId || null,
    fecha_inicio: `${applied.date} ${form.time}:00`,
    notas: form.notes,
  };

  try {
    const { checkoutUrl } = await crearReserva(payload);
    window.location.href = checkoutUrl;
  } catch (error) {
    console.error('Error al crear reserva:', error);
    formError.value = error.message || 'Error al crear la reserva. Intenta de nuevo.';
    Swal.fire('Error', formError.value, 'error');
  }
}

async function handleSuccess() {
  const sessionId = route.query.session_id;
  if (sessionId) {
    try {
      await confirmarReserva(sessionId);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Tu reserva fue confirmada exitosamente.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        router.push('/');
      });
    } catch (error) {
      console.error('Error al confirmar reserva:', error);
      Swal.fire('Error', error.message || 'No se pudo confirmar la reserva.', 'error');
    }
  }
}

async function suggestRelaxFilters() {
  if (applied.people > 0) filters.people = Math.max(0, applied.people - 1);
  filters.restaurant = '';
  filters.ambiente = '';
  await applyFilters();
}

function onKeydown(e) {
  if (e.key === 'Escape' && modal.open) closeModal();
}
</script>

<style scoped>
.reservas {
  display: grid;
  gap: 1.25rem;
  padding: 1rem;
}

.filters {
  background: var(--color-blanco);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  padding: 1rem;
  display: grid;
  gap: .6rem;
}

.filters__row {
  display: grid;
  gap: .75rem;
  grid-template-columns: repeat(12, 1fr);
}

.field {
  grid-column: span 12;
  display: grid;
  gap: .25rem;
}

.field label {
  color: var(--color-oscuro);
  font-weight: 700;
  font-size: .95rem;
}

.field input,
.field select,
.field textarea {
  border: 1px solid var(--color-info-luz);
  border-radius: var(--border-radius-2);
  padding: .55rem .7rem;
  font: inherit;
  background: var(--color-blanco);
}

.filters__actions {
  grid-column: span 12;
  display: flex;
  gap: .6rem;
  align-items: end;
  justify-content: flex-start;
}

.filters__meta {
  color: var(--color-dark-variant);
  font-size: .95rem;
}

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

.card>article {
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: start;
  height: 160px;
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
  font-size: 0.65rem;
}

.card__info .row {
  display: grid;
  grid-template-columns: 1fr auto;
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

.pagination {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.btn--active {
  background: var(--color-azul-1);
  color: var(--color-blanco);
  border-color: var(--color-azul-1);
}

.empty {
  background: var(--color-blanco);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  padding: 1rem;
  text-align: center;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .45);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 1000;
}

.modal {
  background: var(--color-blanco);
  width: min(820px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
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
  padding: .9rem 1rem;
  border-bottom: 1px solid var(--color-info-luz);
}

.modal__header h3 {
  margin: 0;
  color: var(--color-oscuro);
}

.modal__close {
  background: transparent;
  border: 1px solid var(--color-info-luz);
  border-radius: var(--border-radius-2);
  padding: .25rem .45rem;
  cursor: pointer;
}

.modal__body {
  padding: 1rem;
  display: grid;
  gap: 1rem;
}

.modal__details {
  background: var(--color-background);
  border: 1px solid var(--color-info-luz);
  border-radius: var(--border-radius-2);
  padding: .6rem .8rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: .25rem .8rem;
}

.form .grid {
  display: grid;
  gap: .75rem;
  grid-template-columns: repeat(12, 1fr);
}

.form .field {
  grid-column: span 12;
  display: grid;
  gap: .25rem;
}

.form .field label {
  color: var(--color-oscuro);
  font-weight: 700;
}

.form input,
.form select,
.form textarea {
  border: 1px solid var(--color-info-luz);
  border-radius: var(--border-radius-2);
  padding: .55rem .7rem;
  font: inherit;
  background: var(--color-blanco);
}

.form__error {
  color: var(--color-error, #d32f2f);
  font-size: .9rem;
  font-weight: 500;
  padding: .5rem;
  background: var(--color-error-light, #ffebee);
  border-radius: var(--border-radius-2);
  text-align: center;
}

.checks {
  display: flex;
  gap: 1rem;
  width: 200px;
}

.chk {
  display: inline-flex;
  gap: .4rem;
  align-items: center;
  position: relative;
}

.chk input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--color-info-luz);
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.chk input[type="checkbox"]:checked {
  border-color: var(--color-azul-1);
  background-color: var(--color-azul-1);
}

.chk input[type="checkbox"]:checked::before {
  content: '✔';
  color: var(--color-blanco);
  font-size: 0.8rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.chk input[type="checkbox"]:focus-visible {
  outline: 3px solid var(--color-amarillo-2);
  outline-offset: 2px;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: .6rem;
  padding-top: .5rem;
}

.btn {
  --_pad: .6rem 1rem;
  padding: var(--_pad);
  border-radius: var(--border-radius-2);
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: .2px;
  transition: transform 120ms ease, filter 120ms ease;
}

.btn--small {
  --_pad: .4rem .8rem;
  font-size: .9rem;
}

.btn:hover {
  transform: translateY(-1px);
  filter: brightness(.98);
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

:focus-visible {
  outline: 3px solid var(--color-amarillo-2);
  outline-offset: 2px;
}

@media (min-width: 560px) {
  .modal__details {
    grid-template-columns: repeat(2, 1fr);
  }

  .checks {
    width: 250px;
  }

  .card__info {
    font-size: 0.9rem;
  }
}

@media (min-width: 720px) {
  .field {
    grid-column: span 3;
  }

  .filters__actions {
    grid-column: span 12;
    justify-content: flex-end;
  }

  .form .field:nth-child(1),
  .form .field:nth-child(2) {
    grid-column: span 6;
  }
}

@media (min-width: 768px) {
  .card {
    grid-column: span 6;
  }
}

@media (min-width: 1100px) {
  .card {
    grid-column: span 4;
  }
}
</style>
