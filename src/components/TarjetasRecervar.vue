<template>
  <main class="reservas">
    <!-- ===== NAVBAR / FILTROS ===== -->
    <section class="filters" aria-label="Filtros de búsqueda">
      <div class="filters__row">
        <div class="field">
          <label for="f-lugar">Lugar</label>
          <select id="f-lugar" v-model="filters.place">
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
      <ul class="cards" v-if="filteredTables.length">
        <li v-for="t in filteredTables" :key="t.id" class="card">
          <article>
            <div class="card__media" :style="{ '--img': `url(${t.image})` }"></div>
            <div class="card__content">
              <header class="card__head">
                <h3 class="card__title">Mesa #{{ t.number }}</h3>
                <span class="badge">{{ placeLabel(t.place) }}</span>
              </header>
              <dl class="card__info">
                <div class="row">
                  <dt>Capacidad</dt>
                  <dd>{{ t.capacity }} pers.</dd>
                </div>
                <div class="row">
                  <dt>Ubicación</dt>
                  <dd>{{ t.position }}</dd>
                </div>
                <div class="row">
                  <dt>Fecha</dt>
                  <dd>{{ displayDate }}</dd>
                </div>
              </dl>
              <footer class="card__actions">
                <button class="btn btn--primary" @click="openModal(t)">Reservar</button>
              </footer>
            </div>
          </article>
        </li>
      </ul>

      <!-- Vacío -->
      <div v-else class="empty">
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
            <h3 id="reserva-title">Confirmar reserva — Mesa #{{ modal.table?.number }}</h3>
            <button class="modal__close" @click="closeModal" aria-label="Cerrar">✕</button>
          </header>

          <section class="modal__body">
            <div class="modal__details">
              <p><strong>Lugar:</strong> {{ placeLabel(modal.table?.place) }}</p>
              <p><strong>Capacidad:</strong> {{ modal.table?.capacity }} pers.</p>
              <p><strong>Fecha:</strong> {{ displayDate }}</p>
              <p><strong>Hora:</strong> {{ form.time || 'A convenir' }}</p>
            </div>

            <form class="form" @submit.prevent="submitReservation">
              <div v-if="formError" class="form__error">
                {{ formError }}
              </div>
              <div class="grid">
                <div class="field">
                  <label for="r-nombre">Nombre completo</label>
                  <input id="r-nombre" v-model.trim="form.name" required autocomplete="name" />
                </div>

                <div class="field">
                  <label for="r-telefono">Teléfono</label>
                  <input id="r-telefono" v-model.trim="form.phone" inputmode="tel" required autocomplete="tel" />
                </div>

                <div class="field">
                  <label for="r-email">Correo</label>
                  <input id="r-email" v-model.trim="form.email" type="email" required autocomplete="email" />
                </div>

                <div class="field">
                  <label for="r-hora">Hora</label>
                  <select id="r-hora" v-model="form.time" required>
                    <option value="">Seleccionar hora</option>
                    <option v-for="h in timeSlots" :key="h" :value="h">{{ h }}</option>
                  </select>
                </div>

                <div class="field">
                  <label for="r-ocasion">Ocasión</label>
                  <select id="r-ocasion" v-model="form.occasion">
                    <option value="">Ninguna</option>
                    <option>Celebración</option>
                    <option>Aniversario</option>
                    <option>Cumpleaños</option>
                    <option>Negocios</option>
                  </select>
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

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute } from "vue-router"

const route = useRoute()

/* ---------- Catálogos ---------- */
const places = [
  { value: 'barra', label: 'Barra' },
  { value: 'terraza', label: 'Terraza' },
  { value: 'salon', label: 'Salón' },
  { value: 'privado', label: 'Privado' }
]
const peopleOptions = Array.from({ length: 12 }, (_, i) => i + 1)
const timeSlots = [
  '12:00', '12:30', '13:00', '13:30', '14:00',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
]

/* ---------- Estado filtros ---------- */
const todayISO = new Date().toISOString().slice(0, 10)
const filters = reactive({
  place: '' as '' | 'barra' | 'terraza' | 'salon' | 'privado',
  people: 0,
  date: todayISO
})
const applied = reactive({ ...filters })
function applyFilters() { Object.assign(applied, filters) }
function clearFilters() {
  filters.place = ''
  filters.people = 0
  filters.date = todayISO
  applyFilters()
}

/* ---------- Inicializar con query.tipo ---------- */
if (route.query.tipo && typeof route.query.tipo === 'string') {
  filters.place = route.query.tipo as typeof filters.place
  applied.place = filters.place
}

/* ---------- Datos de ejemplo (simulación inventario) ---------- */
type Table = {
  id: string
  number: number
  place: 'barra' | 'terraza' | 'salon' | 'privado'
  capacity: number
  position: string
  features?: string[]
  image: string
  favorite?: boolean
}
const tables = ref<Table[]>([
  { id: 't-01', number: 5, place: 'barra', capacity: 2, position: 'Cerca de la barra', features: ['Alta energía'], image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop' },
  { id: 't-02', number: 12, place: 'terraza', capacity: 4, position: 'Esquina con plantas', features: ['Al aire libre', 'Pet-friendly'], image: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop' },
  { id: 't-03', number: 21, place: 'salon', capacity: 4, position: 'Cerca a ventana', features: ['Climatizado'], image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop' },
  { id: 't-04', number: 8, place: 'privado', capacity: 8, position: 'Sala privada', features: ['Privacidad'], image: 'https://images.unsplash.com/photo-1532634896-26909d0d4b6a?q=80&w=1200&auto=format&fit=crop' },
  { id: 't-05', number: 9, place: 'salon', capacity: 6, position: 'Centro del salón', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop' },
  { id: 't-06', number: 2, place: 'terraza', capacity: 2, position: 'Bajo guirnaldas', image: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?q=80&w=1200&auto=format&fit=crop' }
])

/* ---------- Computados ---------- */
const filteredTables = computed(() =>
  tables.value.filter(t => {
    if (applied.place && t.place !== applied.place) return false
    if (applied.people && t.capacity < applied.people) return false
    return true
  })
)
const filtersSummary = computed(() => {
  const parts: string[] = []
  if (applied.place) parts.push(placeLabel(applied.place))
  if (applied.people) parts.push(`${applied.people} pers.`)
  if (applied.date !== todayISO) parts.push(applied.date)
  return parts.join(' · ')
})
const displayDate = computed(() => applied.date?.split('-').reverse().join('/'))

function placeLabel(v?: Table['place'] | '') {
  const m = places.find(p => p.value === v)
  return m ? m.label : '—'
}

/* ---------- Modal ---------- */
const modal = reactive<{ open: boolean; table: Table | null }>({ open: false, table: null })
const modalRef = ref<HTMLElement | null>(null)
const formError = ref('')

const form = reactive({
  name: '',
  phone: '',
  email: '',
  time: '',
  occasion: '',
  notes: '',
  whatsapp: false,
  acceptsPolicy: false
})

function openModal(t: Table) {
  modal.table = t
  modal.open = true
  formError.value = ''
  if (!form.notes) {
    form.notes = `Reserva para ${applied.people || t.capacity} personas en ${placeLabel(t.place)}.`
  }
  requestAnimationFrame(() => {
    modalRef.value?.querySelector<HTMLInputElement>('#r-nombre')?.focus()
  })
  document.body.style.overflow = 'hidden'
}
function closeModal() {
  modal.open = false
  form.time = '' // Resetear hora al cerrar
  formError.value = ''
  document.body.style.overflow = ''
}
function submitReservation() {
  if (!form.name || !form.phone || !form.email || !form.time) {
    formError.value = 'Por favor, completa todos los campos requeridos.'
    return
  }
  if (!form.acceptsPolicy || !form.whatsapp) {
    formError.value = 'Debes aceptar la política de privacidad y confirmar por WhatsApp.'
    return
  }
  const payload = {
    tableId: modal.table?.id,
    tableNumber: modal.table?.number,
    place: modal.table?.place,
    date: applied.date,
    people: Math.max(applied.people, modal.table?.capacity || 0),
    ...form
  }
  console.info('Reserva enviada (fake):', payload)
  alert(`¡Reserva registrada para la Mesa #${payload.tableNumber}! Te contactaremos pronto.`)
  closeModal()
}

/* ---------- Extras UI ---------- */
function suggestRelaxFilters() {
  if (applied.people > 0) filters.people = Math.max(0, applied.people - 1)
  filters.place = ''
  applyFilters()
}

/* ---------- UX: ESC para cerrar modal ---------- */
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && modal.open) closeModal()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// Inicial
applyFilters()
</script>

<style scoped>
/* ===== Layout base ===== */
.reservas {
  display: grid;
  gap: 1.25rem;
  padding: 1rem;
}

/* ===== Filtros ===== */
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
.field textarea{
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

/* ===== Cards ===== */
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
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: start;
  height: 160px; /* Altura fija para todas las cartas */
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
  padding: 0.75rem 1rem;
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
  font-size: 1.05rem;
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

/* ===== Empty ===== */
.empty {
  background: var(--color-blanco);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  padding: 1rem;
  text-align: center;
}

/* ===== Modal ===== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .45);
  backdrop-filter: blur(5px); /* Efecto de desenfoque */
  -webkit-backdrop-filter: blur(5px); /* Soporte para navegadores WebKit */
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 1000;
}

.modal {
  background: var(--color-blanco);
  width: min(820px, 100%);
  max-height: 90vh; /* Limita la altura al 90% de la ventana */
  overflow-y: auto; /* Habilita desplazamiento vertical */
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
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

/* ===== Botones reutilizables ===== */
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

    .checks{
      width: 250px;
  }

  .card__info{
      font-size: 0.9rem;

  }
}

@media (min-width: 720px) {

  #f-lugar.field,
  #f-personas.field,
  #f-fecha.field {
    grid-column: span 4;
  }

  .field:nth-child(1) {
    grid-column: span 4;
  }

  .field:nth-child(2) {
    grid-column: span 4;
  }

  .field:nth-child(3) {
    grid-column: span 4;
  }

  .filters__actions {
    grid-column: span 12;
    justify-content: flex-end;
  }

  .form .field:nth-child(1),
  .form .field:nth-child(2),
  .form .field:nth-child(3),
  .form .field:nth-child(4) {
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