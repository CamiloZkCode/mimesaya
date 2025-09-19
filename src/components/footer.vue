<script setup lang="ts">
type Links = { inicio?: string; reserva?: string; contacto?: string }
type Socials = { instagram?: string; facebook?: string; tiktok?: string }

withDefaults(defineProps<{
  brand?: string
  year?: number
  links?: Links
  socials?: Socials
}>(), {
  brand: 'Tu Restaurante',
  year: () => new Date().getFullYear(),
  links: () => ({ inicio: '/', reserva: '/reservas', contacto: '/contacto' }),
  socials: () => ({ instagram: '#', facebook: '#', tiktok: '#' })
})
</script>

<template>
  <footer class="site-footer" aria-label="Pie de página">
    <div class="site-footer__inner">
      <p class="site-footer__brand">© {{ year }} — {{ brand }}</p>

      <!-- Botonera -->
      <nav class="site-footer__nav" aria-label="Navegación inferior">
        <RouterLink :to="links.inicio" class="footer-link">Inicio</RouterLink>
        <RouterLink :to="links.reserva" class="footer-link">Reserva</RouterLink>
        <RouterLink :to="links.contacto" class="footer-link">Contacto</RouterLink>
      </nav>

      <!-- Redes -->
      <nav class="site-footer__social" aria-label="Redes sociales">
        <a class="social" :href="socials.instagram" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7m5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10m6.5-.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"/>
          </svg>
          <span>Instagram</span>
        </a>
        <a class="social" :href="socials.facebook" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="M13 22v-9h3l1-4h-4V7a1 1 0 0 1 1-1h3V2h-3a5 5 0 0 0-5 5v2H6v4h3v9z"/>
          </svg>
          <span>Facebook</span>
        </a>
        <a class="social" :href="socials.tiktok" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="M12.5 2h3c.2 1.6 1.1 3 2.5 3.9A6.5 6.5 0 0 0 21 6v3a9 9 0 0 1-3.8-1.1V14a6 6 0 1 1-6-6v3.2a3 3 0 1 0 3 3z"/>
          </svg>
          <span>TikTok</span>
        </a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.site-footer{
  width:100%;
  background: var(--color-blanco);
  border-top: 1px solid var(--color-info-luz);
  padding: 1.2rem 0;
}
.site-footer__inner{
  max-width:1200px;
  margin:0 auto;
  padding:0 1rem;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:.8rem;
  text-align:center;
}
.site-footer__brand{
  margin:0;
  color:var(--color-oscuro);
  font-weight:600;
}
.site-footer__nav{
  display:flex;
  gap:1.5rem;
  flex-wrap:wrap;
  justify-content:center;
}
.footer-link{
  text-decoration:none;
  color:var(--color-oscuro);
  font-weight:600;
}
.footer-link:hover{
  color:var(--color-azul-1);
}
.site-footer__social{
  display:flex;
  gap:1rem;
  flex-wrap:wrap;
  justify-content:center;
}
.social{
  display:inline-flex;
  align-items:center;
  gap:.4rem;
  text-decoration:none;
  color:var(--color-dark-variant);
  font-weight:500;
  transition:color .2s ease, transform .2s ease;
}
.social:hover{
  color:var(--color-azul-1);
  transform:translateY(-2px);
}
</style>
