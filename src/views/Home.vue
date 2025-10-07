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
            <button class="btn btn--primary">
              <RouterLink to="/reservas" class="footer-link"> Reservar ahora </RouterLink>
            </button>
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

    <!-- ===== REGISTRA TU RESTAURANTE ===== -->
    <section class="plan">
      <header class="section-header">
        <h2>Registra tu Restaurante</h2>
        <p>Únete a MiMesaYa gratis y haz crecer tu negocio con nuestro modelo de negocio flexible.</p>
      </header>
      <div class="plan__wrapper">
        <div class="plan__content">
          <div class="plan__text">
            <h3 class="plan__title">Para Restaurantes</h3>
            <ul class="plan__features">
              <li><strong>Registro 100% gratuito</strong>: Sin costos iniciales ni mensualidades.</li>
              <li>Gestiona reservas en tiempo real desde nuestra plataforma intuitiva.</li>
              <li>Solo pagas una <strong>comisión del 5% por cada reserva</strong> confirmada.</li>
              <li>Accede a reportes detallados para optimizar la operación de tu restaurante.</li>
              <li>Atrae más clientes y aumenta tu visibilidad con nuestro soporte dedicado.</li>
            </ul>
            <div class="plan__actions">
              <button class="btn btn--primary">
                <RouterLink to="/registrar-restaurante" class="footer-link"> Registrar ahora</RouterLink>
              </button>
            </div>
          </div>
          <div class="plan__media">
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=870&auto=format&fit=crop"
              alt="Interior de un restaurante moderno" class="plan__img" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>

    <!-- ===== AMBIENTES ===== -->
    <section class="ambientes" ref="ambientesRef">
      <header class="section-header">
        <h2>Ambientes para cada plan</h2>
        <p>Elige tu espacio favorito y continúa con la reserva.</p>
      </header>

      <div v-if="loading" class="loading">Cargando ambientes...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <ul v-else class="ambientes__grid" role="list">
        <li v-for="ambiente in ambientes" :key="ambiente.id_ambiente" class="place">
          <article class="place__card">
            <div class="place__media">
              <img class="place__img" :src="ambiente.imagen_ambiente" :alt="`Ambiente ${ambiente.nombre_ambiente}`"
                loading="lazy" decoding="async" />
              <span class="place__badge">{{ ambiente.insignia }}</span>
            </div>
            <div class="place__body">
              <h3 class="place__title">
                {{ ambiente.nombre_ambiente }}
                <span class="place__capacity">
                  <img src="/src/assets/Icons/capacidad.png" alt="Capacidad" class="capacity-icon" />
                  {{ ambiente.capacidad_min }}–{{ ambiente.capacidad_max }}
                </span>
              </h3>
              <p class="place__desc">{{ ambiente.descripcion_ambiente }}</p>
              <div class="place__meta">
                <span class="chip" v-if="ambiente.caracteristica">• {{ ambiente.caracteristica }}</span>
              </div>
              <div class="place__actions">
                <RouterLink class="btn btn--primary"
                  :to="{ path: '/reservas', query: { ambiente: ambiente.id_ambiente } }">
                  Reservar
                </RouterLink>
              </div>
            </div>
          </article>
        </li>
      </ul>
    </section>

    <!-- ===== CARRUSEL DE LOGOS ===== -->
    <section class="logos">
      <header class="section-header">
        <h2>Nuestras Marcas Asociadas</h2>
        <p>Colaboramos con las mejores cadenas de restaurantes para ofrecerte experiencias únicas.</p>
      </header>
      <div class="logos__carousel" ref="logosRef" @mouseenter="pauseLogos" @mouseleave="playLogos">
        <div class="logos__track" :style="logosStyle">
          <img v-for="(logo, i) in logos.concat(logos)" :key="'logo-' + i" class="logos__item" :src="logo.src"
            :alt="logo.alt" loading="lazy" decoding="async" />
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { onMounted, onBeforeUnmount, reactive, ref, computed } from 'vue'
import { obtenerAmbientes } from '@/services/ambientes'

export default {
  setup() {
    // TEXTOS
    const title = 'Reserva tu mesa con un clic'
    const description =
      'Experiencias memorables en espacios únicos: barra para after office, terraza al aire libre, salón climatizado y salón privado.'

    // CARRUSEL HERO
    const images = reactive([
      { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=870&auto=format&fit=crop', alt: 'Barra iluminada' },
      { src: 'https://images.unsplash.com/photo-1667388969250-1c7220bf3f37?q=80&w=910&auto=format&fit=crop', alt: 'Salón principal' },
      { src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=870&auto=format&fit=crop', alt: 'Barra con coctelería' },
      { src: 'https://images.unsplash.com/photo-1521917441209-e886f0404a7b?q=80&w=1160&auto=format&fit=crop', alt: 'Barra con coctelería' }
    ])

    const current = ref(0)
    const DURATION = 5000
    let timer = null
    const heroRef = ref(null)

    const next = () => (current.value = (current.value + 1) % images.length)
    const prev = () => (current.value = (current.value - 1 + images.length) % images.length)
    const go = (i) => (current.value = i)

    const stop = () => {
      if (timer) {
        window.clearInterval(timer)
        timer = null
      }
    }
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
    function bindSwipe(el) {
      if (!el) return
      el.addEventListener('touchstart', onTouchStart, { passive: true })
      el.addEventListener('touchend', onTouchEnd, { passive: true })
    }
    function unbindSwipe() {
      if (!heroRef.value) return
      heroRef.value.removeEventListener('touchstart', onTouchStart)
      heroRef.value.removeEventListener('touchend', onTouchEnd)
    }
    function onTouchStart(e) {
      touchStartX = e.changedTouches[0].screenX
    }
    function onTouchEnd(e) {
      touchEndX = e.changedTouches[0].screenX
      const delta = touchEndX - touchStartX
      if (Math.abs(delta) > 40) {
        delta < 0 ? next() : prev()
      }
    }

    const slidesStyle = computed(() => ({ '--active-index': String(current.value) }))

    // AMBIENTES
    const ambientes = reactive([])
    const loading = ref(true)
    const error = ref(null)

    async function fetchAmbientes() {
      try {
        loading.value = true
        const data = await obtenerAmbientes()
        const mappedData = data.map((item) => ({
          id_ambiente: item.id_ambiente.toString(),
          nombre_ambiente: item.nombre_ambiente,
          descripcion_ambiente: item.descripcion_ambiente,
          capacidad_min: item.capacidad_min.toString(),
          capacidad_max: item.capacidad_max.toString(),
          imagen_ambiente: item.imagen_ambiente,
          caracteristica: item.caracteristica || '',
          insignia: item.insignia || ''
        }))
        ambientes.splice(0, ambientes.length, ...mappedData)
      } catch (err) {
        error.value = 'No se pudieron cargar los ambientes. Intenta de nuevo más tarde.'
        console.error('Error al obtener ambientes:', err)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchAmbientes()
    })

    // CARRUSEL DE LOGOS
    const logos = reactive([
      { src: "https://laherradura.com.co/wp-content/uploads/2020/08/frisby.png", alt: "Frisby" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/McDonald%27s_logo.svg/2560px-McDonald%27s_logo.svg.png", alt: "McDonald's" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Burger_King_logo_%281999%E2%80%932020%29.svg/1012px-Burger_King_logo_%281999%E2%80%932020%29.svg.png", alt: "Burger King" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/9/91/KFC_Logo.svg", alt: "KFC" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Subway_bi_%282002%29.svg", alt: "Subway" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/1018px-Domino%27s_pizza_logo.svg.png", alt: "Domino's Pizza" }
    ])

    const logosOffset = ref(0)
    const LOGO_SPEED = 0.5 // píxeles por frame
    let logosAnimationFrame = null
    const logosRef = ref(null)

    function animateLogos() {
      logosOffset.value -= LOGO_SPEED
      const logoWidth = 80 // ancho base reducido para móviles
      const totalWidth = logos.length * logoWidth
      if (Math.abs(logosOffset.value) >= totalWidth) {
        logosOffset.value += totalWidth
      }
      logosAnimationFrame = requestAnimationFrame(animateLogos)
    }

    const playLogos = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      if (!logosAnimationFrame) {
        animateLogos()
      }
    }

    const pauseLogos = () => {
      if (logosAnimationFrame) {
        cancelAnimationFrame(logosAnimationFrame)
        logosAnimationFrame = null
      }
    }

    const logosStyle = computed(() => ({
      transform: `translateX(${logosOffset.value}px)`,
      display: 'flex'
    }))

    onMounted(() => {
      playLogos()
      const io = new IntersectionObserver(
        (entries) => (entries[0].isIntersecting ? playLogos() : pauseLogos()),
        { threshold: 0.25 }
      )
      if (logosRef.value) io.observe(logosRef.value)
    })

    onBeforeUnmount(() => {
      pauseLogos()
    })

    // SCROLL
    const ambientesRef = ref(null)
    function scrollToAmbientes() {
      ambientesRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    function onKey(e) {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

    return {
      title,
      description,
      images,
      current,
      heroRef,
      next,
      prev,
      go,
      pause,
      play,
      slidesStyle,
      ambientes,
      loading,
      error,
      ambientesRef,
      scrollToAmbientes,
      logos,
      logosRef,
      logosStyle,
      pauseLogos,
      playLogos
    }
  }
}
</script>

<style scoped>
/* Estilos existentes (sin cambios) */
.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-dark-variant);
  font-size: 1.2rem;
}

.error {
  text-align: center;
  padding: 2rem;
  color: var(--color-error, #d32f2f);
  font-size: 1.2rem;
}

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

/* ===== Logos Carousel ===== */
.logos {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.logos__carousel {
  position: relative;
  height: 100px;
  overflow: clip;
  border-radius: var(--card-border-radius);
  isolation: isolate;
}

.logos__track {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
}

.logos__item {
  flex: 0 0 auto;
  width: 80px;
  height: 60px;
  object-fit: contain;
  margin: 0 2.5rem;
  filter: grayscale(20%);
  transition: filter 0.3s ease;
}

.logos__item:hover {
  filter: grayscale(0%);
}

/* ===== Registra tu Restaurante ===== */
.plan {
  max-width: 1200px;
  margin: 0 auto 1rem;
  padding: 0 1rem;
}

.plan__wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.plan__content {
  background: var(--color-blanco);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.plan__text {
  display: grid;
  gap: 1rem;
  text-align: left;
}

.plan__media {
  display: none;
  /* Oculta la imagen por defecto en móviles */
}

.plan__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius-2);
}

.plan__title {
  margin: 0;
  color: var(--color-oscuro);
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
}

.plan__features {
  list-style: none;
  padding: 0;
  margin: 0;
  color: var(--color-dark-variant);
  font-size: 0.95rem;
  text-align: left;
}

.plan__features li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.plan__features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-azul-1);
  font-weight: bold;
}

.plan__actions {
  display: flex;
  justify-content: center;
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

.footer-link {
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
  .place__desc {
    font-size: 1.1rem;
  }

  .logos__item {
    width: 110px;
    height: 85px;
  }
}

@media (min-width: 768px) {
  .place {
    grid-column: span 6;
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

  .logos__carousel {
    max-width: 1100px;
    margin: 0 auto;
    height: 160px;
  }

  .logos__item {
    width: 120px;
    height: 90px;
  }

  .plan__content {
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }

  .plan__text {
    flex: 1;
  }

  .plan__media {
    display: block;
    flex: 0 0 40%;
    max-width: 400px;
    height: 300px;
  }
}
</style>