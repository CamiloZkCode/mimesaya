<template>
  <main class="home" aria-describedby="home-intro">
    <!-- ===== HERO / CARRUSEL ===== -->
    <section class="hero" ref="heroRef" @mouseenter="pause" @mouseleave="play">
      <div class="hero__slides" :style="slidesStyle">
        <article v-for="(img, i) in images" :key="img.src" class="hero__slide" :class="{ 'is-active': i === current }"
          role="img" :aria-label="img.alt" :style="{ backgroundImage: `url(${img.src})` }" />
      </div>

      <div class="hero__overlay">
        <header class="hero__content">
          <h1 class="hero__title">{{ title }}</h1>
          <p id="home-intro" class="hero__desc">{{ description }}</p>
          <div class="hero__cta">
            <button class="btn btn--primary"> <RouterLink to="/reservas" class="footer-link"> Reservar ahora </RouterLink></button>
            <button class="btn btn--ghost" @click="scrollToAmbientes">Ver ambientes</button>
          </div>
        </header>

        <nav class="hero__controls" aria-label="Controles del carrusel">
          <button class="hero__nav" @click="prev" aria-label="Anterior">‹</button>
          <button class="hero__nav" @click="next" aria-label="Siguiente">›</button>
        </nav>

        <div class="hero__dots" role="tablist" aria-label="Cambiar imagen">
          <button v-for="(img, i) in images" :key="'dot-' + i" class="hero__dot" :class="{ 'is-active': i === current }"
            @click="go(i)" role="tab" :aria-selected="i === current" :aria-controls="'slide-' + i" :title="img.alt" />
        </div>
      </div>
    </section>

    <!-- ===== AMBIENTES ===== -->
    <section class="ambientes" ref="ambientesRef">
      <header class="section-header">
        <h2>Ambientes para cada plan</h2>
        <p>Elige tu espacio favorito y continúa con la reserva.</p>
      </header>

      <ul class="ambientes__grid" role="list">
        <li v-for="place in places" :key="place.key" class="place">
          <article class="place__card">
            <div class="place__media">
              <img class="place__img" :src="place.image" :alt="`Ambiente ${place.title}`" loading="lazy"
                decoding="async" />
              <span class="place__badge">{{ place.badge }}</span>
            </div>
            <div class="place__body">
              <h3 class="place__title">
                {{ place.title }}
                <span class="place__capacity">
                  <img src="/src/assets/Icons/capacidad.png" alt="Capacidad" class="capacity-icon" />
                  {{ place.capacity }}
                </span>
              </h3>
              <p class="place__desc">{{ place.desc }}</p>
              <div class="place__meta">
                <span class="chip" v-if="place.features?.length">• {{ place.features.join(' • ') }}</span>
              </div>
              <div class="place__actions">
                <button class="btn btn--primary" @click="$emit('reservar', place.key)">Reservar</button>
              </div>
            </div>
          </article>
        </li>
      </ul>
    </section>

    <!-- ===== UBICACIÓN (HORIZONTAL) ===== -->
    <section class="ubicacion">
      <header class="section-header">
        <h2>¿Dónde estamos?</h2>
        <p>Hiciste tu reserva o quieres disfrutar de un buen restaurante, visítanos.</p>
      </header>

      <div class="map-wrapper map-wrapper--horizontal">
        <!-- Reemplaza el src con el embed de tu dirección -->
        <iframe class="map" title="Ubicación del restaurante" loading="lazy" allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d997!2d-74.072090!3d4.710989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3ARestaurante!2sTu%20Restaurante!5e0!3m2!1ses!2sCO!4v1680000000000">
        </iframe>

        <aside class="visit">
          <h3 class="visit__title">Horarios & Contacto</h3>
          <ul class="visit__list">
            <li><strong>L–J:</strong> 12:00–22:00</li>
            <li><strong>V–S:</strong> 12:00–00:00</li>
            <li><strong>Dom:</strong> 12:00–21:00</li>
            <li><strong>Tel:</strong> (601) 000 0000</li>
          </ul>
          <div class="visit__addr">
            <p><strong>Dirección:</strong> Calle 123 #45–67, Bogotá</p>
            <p><strong>Cómo llegar:</strong> Estamos frente al Parque X.</p>
          </div>
          <button class="btn btn--primary" @click="$emit('cta-whatsapp')">Escríbenos por WhatsApp</button>
        </aside>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref, computed } from 'vue'

/** ---------- TEXTOS ---------- */
const title = 'Reserva tu mesa con un clic'
const description =
  'Experiencias memorables en espacios únicos: barra para after office, terraza al aire libre, salón climatizado y salón privado.'

/** ---------- CARRUSEL ---------- */
type Slide = { src: string; alt: string }
const images = reactive<Slide[]>([
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=870&auto=format&fit=crop', alt: 'Barra iluminada' },
  { src: 'https://images.unsplash.com/photo-1667388969250-1c7220bf3f37?q=80&w=910&auto=format&fit=crop', alt: 'Salón principal' },
  { src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=870&auto=format&fit=crop', alt: 'Barra con coctelería' },
  { src: 'https://images.unsplash.com/photo-1521917441209-e886f0404a7b?q=80&w=1160&auto=format&fit=crop', alt: 'Barra con coctelería' }

  ])

const current = ref(0)
const DURATION = 5500
let timer: number | null = null
const heroRef = ref<HTMLElement | null>(null)

const next = () => (current.value = (current.value + 1) % images.length)
const prev = () => (current.value = (current.value - 1 + images.length) % images.length)
const go = (i: number) => (current.value = i)

const stop = () => { if (timer) { window.clearInterval(timer); timer = null } }
const play = () => {
  stop()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = window.setInterval(next, DURATION)
}
const pause = () => stop()

const handleVisibility = () => (document.hidden ? stop() : play())

onMounted(() => {
  const preload = new Image()
  preload.src = images[(current.value + 1) % images.length].src

  document.addEventListener('visibilitychange', handleVisibility)
  const io = new IntersectionObserver(
    (entries) => (entries[0].isIntersecting ? play() : stop()),
    { threshold: 0.25 }
  )
  if (heroRef.value) io.observe(heroRef.value)
  bindSwipe(heroRef.value)
})
onBeforeUnmount(() => {
  stop()
  document.removeEventListener('visibilitychange', handleVisibility)
  unbindSwipe()
})

// swipe básico
let touchStartX = 0
let touchEndX = 0
function bindSwipe(el: HTMLElement | null) {
  if (!el) return
  el.addEventListener('touchstart', onTouchStart, { passive: true })
  el.addEventListener('touchend', onTouchEnd, { passive: true })
}
function unbindSwipe() {
  if (!heroRef.value) return
  heroRef.value.removeEventListener('touchstart', onTouchStart)
  heroRef.value.removeEventListener('touchend', onTouchEnd)
}
function onTouchStart(e: TouchEvent) { touchStartX = e.changedTouches[0].screenX }
function onTouchEnd(e: TouchEvent) {
  touchEndX = e.changedTouches[0].screenX
  const delta = touchEndX - touchStartX
  if (Math.abs(delta) > 40) { delta < 0 ? next() : prev() }
}

const slidesStyle = computed(() => ({ '--active-index': String(current.value) } as any))

/** ---------- AMBIENTES ---------- */
type Place = {
  key: string
  title: string
  desc: string
  image: string
  capacity?: string
  features?: string[]
  badge?: string
}

const places = reactive<Place[]>([
  {
    key: 'barra',
    title: 'Barra',
    desc: 'Coctelería de autor y energía alta. Ideal para parejas o grupos pequeños.',
    image: 'https://images.unsplash.com/photo-1543007631-283050bb3e8c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    capacity: '2–4',
    features: ['Cocteles', 'Alta energía'],
    badge: 'Popular'
  },
  {
    key: 'terraza',
    title: 'Terraza',
    desc: 'Aire libre con vegetación y luces cálidas. Perfecta para el atardecer.',
    image: 'https://images.unsplash.com/photo-1665758564776-f2aa6b41327e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    capacity: '2–6',
    features: ['Al aire libre'],
    badge: 'Al aire libre'
  },
  {
    key: 'salon',
    title: 'Salón',
    desc: 'Ambiente cómodo y climatizado con acústica pensada para conversar.',
    image: 'https://images.unsplash.com/photo-1560053608-13721e0d69e8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    capacity: '2–8',
    features: ['Climatizado'],
    badge: 'Cómodo'
  },
  {
    key: 'privado',
    title: 'Privado',
    desc: 'Espacio íntimo para celebraciones o reuniones ejecutivas.',
    image: 'https://images.unsplash.com/photo-1645640931580-b4909b189b2f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    capacity: '6–12',
    features: ['Privacidad'],
    badge: 'Íntimo'
  }
])

/** ---------- SCROLL & FOOTER ---------- */
const ambientesRef = ref<HTMLElement | null>(null)
function scrollToAmbientes() {
  ambientesRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
const year = new Date().getFullYear()

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}
window.addEventListener('keydown', onKey)
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
/* ===== Base ===== */
.home {
  display: grid;
  gap: 4rem;
}

/* ===== Hero ===== */
.hero {
  position: relative;
  height: min(78vh, 720px);
  border-radius: var(--card-border-radius);
  overflow: clip;
  background: var(--color-dark-variant);
  box-shadow: var(--box-shadow);
  isolation: isolate;
}

.hero__slides {
  position: absolute;
  inset: 0;
}

.hero__slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: scale(1.04);
  transition: opacity 680ms ease, transform 1400ms ease;
}

.hero__slide.is-active {
  opacity: 1;
  transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .hero__slide {
    transition: none
  }
}

.hero__overlay {
  position: relative;
  z-index: 2;
  inset: 0;
  display: grid;
  place-items: center;
  height: 100%;
  padding: 1.5rem;
  color: var(--color-blanco);
  background:
    radial-gradient(60% 50% at 50% 70%, rgba(0, 0, 0, 0.45), transparent 70%),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.55));
}

.hero__content {
  text-align: center;
  display: grid;
  gap: .9rem;
  max-width: 780px;
}

.hero__title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.1;
  text-shadow: 0 8px 28px rgba(0, 0, 0, .5);
}

.hero__desc {
  margin: 0 auto;
  max-width: 60ch;
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  opacity: .95;
}

.hero__cta {
  display: flex;
  gap: .6rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero__controls {
  position: absolute;
  inset: auto 0 1.25rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero__nav {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  font-size: 1.6rem;
  background: var(--color-amarillo-2);
  color: var(--color-oscuro);
  box-shadow: 0 10px 24px rgba(0, 0, 0, .28);
  transition: transform 120ms ease, filter 120ms ease;
}

.hero__nav:hover {
  transform: translateY(-2px);
  filter: brightness(.98);
}

.hero__dots {
  position: absolute;
  left: 50%;
  bottom: .9rem;
  transform: translateX(-50%);
  display: flex;
  gap: .45rem;
}

.hero__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 2px solid var(--color-blanco);
  background: transparent;
  opacity: .7;
  cursor: pointer;
  transition: width 180ms ease, opacity 120ms ease, background 180ms ease, border-color 180ms ease;
}

.hero__dot.is-active {
  width: 26px;
  background: var(--color-azul-1);
  border-color: var(--color-azul-1);
  opacity: 1;
}

/* ===== Section headers ===== */
.section-header {
  text-align: center;
  margin: 0 auto 1.25rem;
}

.section-header h2 {
  margin: 0 0 .25rem;
  color: var(--color-oscuro);
  font-size: clamp(1.6rem, 3vw, 2.1rem);
}

.section-header p {
  margin: 0;
  color: var(--color-dark-variant);
}

/* ===== Ambientes ===== */
.ambientes {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.ambientes__grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.place {
  grid-column: span 12;
  display: flex;
}

.place__card {
  height: 100%;
  display: grid;
  grid-template-columns: 128px 1fr;
  gap: .9rem;
  align-items: stretch;
  background: var(--color-blanco);
  border-radius: var(--border-radius-3);
  box-shadow: var(--box-shadow);
  padding: .7rem;
  transition: transform 140ms ease, box-shadow 140ms ease;
}

.place__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 1.4rem 3rem var(--color-light);
}

.place__media {
  position: relative;
  border-radius: var(--border-radius-2);
  overflow: clip;
  height: 100%;
}

.place__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.place__badge {
  position: absolute;
  top: .5rem;
  left: .5rem;
  padding: .25rem .5rem;
  background: linear-gradient(135deg, var(--color-naranja-3), var(--color-morado-4));
  color: var(--color-blanco);
  border-radius: 999px;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .2px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .25);
}

.place__body {
  display: grid;
  grid-template-rows: auto auto auto 1fr auto;
  gap: .25rem;
  min-height: 170px;
}

.place__title {
  margin: 0;
  color: var(--color-oscuro);
  font-size: 1.1rem;
}

.place__capacity {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-dark-variant);
  margin-left: .4rem;
}

.capacity-icon {
  width: 1.2rem;
  height: 1.2rem;
  object-fit: contain;
  display: inline-block;
}


.place__desc {
  margin: 0;
  color: var(--color-dark-variant);
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.place__meta {
  display: flex;
  flex-wrap: wrap;
  gap: .4rem .6rem;
  margin-top: .15rem;
}

.chip {
  border: 1px solid var(--color-info-luz);
  color: var(--color-oscuro);
  border-radius: 999px;
  padding: .25rem .5rem;
  font-size: .78rem;
}


.place__actions {
  align-self: end;
  display: flex;
  gap: .55rem;
  flex-wrap: wrap;
}

/* ===== Ubicación ===== */
.ubicacion {
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.map-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  align-items: stretch;
}

.map {
  width: 100%;
  height: 260px;
  border: 0;
  display: block;
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  background: var(--color-blanco);
}

.visit {
  background: var(--color-blanco);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  padding: var(--card-padding);
  display: grid;
  gap: .5rem;
  align-content: start;
}

.visit__title {
  margin: 0 0 .25rem;
  color: var(--color-oscuro);
}

.visit__list {
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--color-dark-variant);
}

.visit__addr {
  color: var(--color-dark-variant);
  font-size: .95rem;
}

/* ===== Botones ===== */
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

.footer-link{
  color: var(--color-blanco);
}

.btn--ghost {
  background: var(--color-blanco);
  border-color: var(--color-info-luz);
  color: var(--color-oscuro);
}

/* ===== Focus visible ===== */
:focus-visible {
  outline: 3px solid var(--color-amarillo-2);
  outline-offset: 2px;
}

/* ===== Breakpoints agrupados ===== */
@media (min-width: 480px) {
  .map {
    height: 320px;
  }

  .place__desc {
    font-size: 1.1rem;

  }

}

@media (min-width: 768px) {

  /* Ambientes */
  .place {
    grid-column: span 6;
  }

  /* Ubicación */
  .map-wrapper {
    grid-template-columns: 1.6fr 1fr;
  }

  .map {
    height: 360px;
  }
}

@media (min-width: 992px) {
  .map {
    height: 420px;
  }
}

@media (min-width: 1024px) {
  .place {
    grid-column: span 3;
  }

  .place__card {
    grid-template-columns: 1fr;
    padding: .9rem;
  }

  .place__media {
    min-height: 160px;
    max-height: 160px;
  }

  .place__body {
    min-height: 200px;
  }
}
</style>
