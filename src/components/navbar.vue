<template>
  <nav class="navbar" aria-label="Barra de navegación">
    <RouterLink to="/" class="logo">
      <img src="@/assets/icons/menu.png" alt="MiMesaYa" />
      <span class="brand">MiMesaYa</span>
    </RouterLink>

    <!-- Desktop -->
    <ul class="nav-links" v-if="!isMobile">
      <li>
        <RouterLink to="/" class="nav-link" exact-active-class="is-active">Inicio</RouterLink>
      </li>
      <li>
        <RouterLink to="/reservas" class="nav-link" exact-active-class="is-active">Reservar</RouterLink>
      </li>
      <li>
        <RouterLink to="/contacto" class="nav-link" exact-active-class="is-active">Contacto</RouterLink>
      </li>
      <li v-if="auth.isAdmin" class="divider"></li>
      <li v-if="auth.isAdmin">
        <RouterLink to="/admin/mesas" class="nav-link" exact-active-class="is-active">Gestionar Mesas</RouterLink>
      </li>
      <li v-if="auth.isAdmin">
        <RouterLink to="/admin/reservas" class="nav-link" exact-active-class="is-active">Gestionar Reservas</RouterLink>
      </li>
      <li v-if="auth.isAdmin">
        <RouterLink to="/admin/clientes" class="nav-link" exact-active-class="is-active">Gestionar Clientes</RouterLink>
      </li>
    </ul>

    <!-- Right -->
    <div class="right">
      <button class="icon-btn hamburger" @click="toggleMenu" v-if="isMobile" aria-label="Abrir menú">
        <img src="@/assets/icons/menu.png" alt="" class="icon" />
      </button>
      <button class="icon-btn profile" @click="handleProfileClick" aria-label="Perfil">
        <img src="@/assets/icons/menu.png" alt="" class="icon" />
      </button>
    </div>
  </nav>

  <!-- Sidebar -->
  <transition name="slide">
    <aside v-if="isMobile && menuOpen" class="sidebar">
      <button class="icon-btn close" @click="toggleMenu">
        <img src="@/assets/icons/close.png" alt="cerrar" class="icon" />
      </button>
      <ul class="side-links">
        <li><RouterLink to="/" class="side-link" exact-active-class="is-active" @click="closeMenu">Inicio</RouterLink></li>
        <li><RouterLink to="/reservas" class="side-link" exact-active-class="is-active" @click="closeMenu">Reservar</RouterLink></li>
        <li><RouterLink to="/contacto" class="side-link" exact-active-class="is-active" @click="closeMenu">Contacto</RouterLink></li>
        <li v-if="auth.isAdmin" class="side-divider"></li>
        <li v-if="auth.isAdmin"><RouterLink to="/admin/mesas" class="side-link" exact-active-class="is-active" @click="closeMenu">Gestionar Mesas</RouterLink></li>
        <li v-if="auth.isAdmin"><RouterLink to="/admin/reservas" class="side-link" exact-active-class="is-active" @click="closeMenu">Gestionar Reservas</RouterLink></li>
        <li v-if="auth.isAdmin"><RouterLink to="/admin/clientes" class="side-link" exact-active-class="is-active" @click="closeMenu">Gestionar Clientes</RouterLink></li>
      </ul>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const auth = ref({ isLoggedIn: false, isAdmin: true })
const isMobile = ref(false)
const menuOpen = ref(false)
function checkMobile(){ isMobile.value = window.innerWidth <= 900 }
onMounted(()=>{ checkMobile(); window.addEventListener('resize', checkMobile) })
onUnmounted(()=> window.removeEventListener('resize', checkMobile))
function toggleMenu(){ menuOpen.value = !menuOpen.value }
function closeMenu(){ menuOpen.value = false }
function handleProfileClick(){
  if(!auth.value.isLoggedIn) window.location.href='/login'
  else alert('Abrir menú de perfil aquí')
}
</script>

<style scoped>
.navbar{
  position:sticky; top:0; z-index:100;
  display:flex; justify-content:space-between; align-items:center;
  width:100%; background:var(--color-blanco);
  padding:.8rem 1.2rem; box-shadow:0 2px 4px rgba(0,0,0,.1);
}
.logo{ display:flex; align-items:center; gap:.5rem; text-decoration:none; color:var(--color-oscuro); }
.logo img{ width:44px; height:44px; }
.brand{ font-weight:800; font-size:1.4rem; }

.nav-links{ display:flex; gap:1.8rem; list-style:none; margin:0; padding:0; }
.nav-link{
  text-decoration:none; color:var(--color-oscuro);
  font-weight:600; font-size:1.15rem;
  position:relative; padding:.4rem 0;
}
.nav-link.is-active::after{
  content:""; position:absolute; left:0; right:0; bottom:-6px;
  height:3px; background:linear-gradient(135deg,var(--color-azul-1),var(--color-primary-variant));
  border-radius:999px;
}
.divider{ width:1px; height:22px; background:var(--color-info-luz); }

.right{ display:flex; gap:.5rem; align-items:center; }
.icon-btn{ background:transparent; border:none; cursor:pointer; }
.icon{ width:28px; height:28px; }

/* Sidebar móvil */
@media (max-width:900px){ .nav-links{ display:none; } }
.sidebar{ position:fixed; inset:0 40% 0 0; background:var(--color-blanco); padding:1rem; box-shadow:2px 0 8px rgba(0,0,0,.2); }
.side-links{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:.5rem; }
.side-link{ text-decoration:none; color:var(--color-oscuro); font-size:1.1rem; font-weight:600; padding:.6rem 0; }
.side-link.is-active{ color:var(--color-azul-1); }
.side-divider{ height:1px; background:var(--color-info-luz); margin:.6rem 0; }
.slide-enter-active,.slide-leave-active{ transition: transform .3s ease; }
.slide-enter-from,.slide-leave-to{ transform:translateX(-100%); }
</style>
