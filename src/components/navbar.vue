<template>
  <nav class="navbar" aria-label="Barra de navegación">
    <button
      class="icon-btn hamburger"
      @click="toggleMenu"
      v-if="isMobile"
      aria-label="Abrir menú"
    >
      <img src="@/assets/icons/menu.png" alt="" class="icon" />
    </button>

    <RouterLink to="/" class="logo">
      <img src="@/assets/Logo/LogoSin.png" alt="MiMesaYa" />
      <span class="brand">MiMesaYa</span>
    </RouterLink>

    <!-- Desktop -->
    <ul class="nav-links" v-if="!isMobile">
      <li>
        <RouterLink to="/" class="nav-link" exact-active-class="is-active"
          >Inicio</RouterLink
        >
      </li>
      <li>
        <RouterLink
          to="/reservas"
          class="nav-link"
          exact-active-class="is-active"
          >Reservar</RouterLink
        >
      </li>
      <li>
        <RouterLink
          to="/contacto"
          class="nav-link"
          exact-active-class="is-active"
          >Contacto</RouterLink
        >
      </li>
      <li v-if="authStore.isAdmin" class="divider"></li>
      <li v-if="authStore.isAdmin">
        <RouterLink
          to="/admin/mesas"
          class="nav-link"
          exact-active-class="is-active"
          >Gestionar Mesas</RouterLink
        >
      </li>
      <li v-if="authStore.isAdmin">
        <RouterLink
          to="/admin/reservas"
          class="nav-link"
          exact-active-class="is-active"
          >Gestionar Reservas</RouterLink
        >
      </li>
      <li v-if="authStore.isAdmin">
        <RouterLink
          to="/admin/clientes"
          class="nav-link"
          exact-active-class="is-active"
          >Gestionar Clientes</RouterLink
        >
      </li>
    </ul>

    <!-- Right -->
    <div class="right">
      <button
        class="icon-btn profile"
        @click="handleProfileClick"
        aria-label="Perfil o Login"
      >
        <img src="@/assets/icons/User.png" alt="" class="icon" />
      </button>
      <!-- Mini-modal de perfil (para autenticados) -->
      <transition name="fade">
        <div
          v-if="showProfileMenu && authStore.isAuthenticated"
          class="profile-menu"
        >
          <ul class="profile-options">
            <!-- Perfil de cliente -->
            <li v-if="authStore.isCliente">
              <RouterLink to="/perfil" @click="closeProfileMenu">
                Perfil
              </RouterLink>
            </li>

            <!-- Perfil de administrador -->
            <li v-if="authStore.isAdmin">
              <RouterLink to="/admin/perfil" @click="closeProfileMenu">
                Perfil Administrador
              </RouterLink>
            </li>

            <!-- Cerrar sesión -->
            <li>
              <a href="#" @click.prevent="logout">Cerrar Sesión</a>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </nav>

  <!-- Sidebar -->
  <transition name="slide">
    <aside v-if="isMobile && menuOpen" class="sidebar">
      <div class="sidebar-header">
        <button
          class="icon-btn close"
          @click="toggleMenu"
          aria-label="Cerrar menú"
        >
          <img src="@/assets/icons/close.png" alt="cerrar" class="icon" />
        </button>
      </div>
      <ul class="side-links">
        <li>
          <RouterLink
            to="/"
            class="side-link"
            exact-active-class="is-active"
            @click="closeMenu"
            >Inicio</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/reservas"
            class="side-link"
            exact-active-class="is-active"
            @click="closeMenu"
            >Reservar</RouterLink
          >
        </li>
        <li>
          <RouterLink
            to="/contacto"
            class="side-link"
            exact-active-class="is-active"
            @click="closeMenu"
            >Contacto</RouterLink
          >
        </li>
        <li v-if="authStore.isAdmin" class="side-divider"></li>
        <li v-if="authStore.isAdmin">
          <RouterLink
            to="/admin/mesas"
            class="side-link"
            exact-active-class="is-active"
            @click="closeMenu"
            >Gestionar Mesas</RouterLink
          >
        </li>
        <li v-if="authStore.isAdmin">
          <RouterLink
            to="/admin/reservas"
            class="side-link"
            exact-active-class="is-active"
            @click="closeMenu"
            >Gestionar Reservas</RouterLink
          >
        </li>
        <li v-if="authStore.isAdmin">
          <RouterLink
            to="/admin/clientes"
            class="side-link"
            exact-active-class="is-active"
            @click="closeMenu"
            >Gestionar Clientes</RouterLink
          >
        </li>
      </ul>
    </aside>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const router = useRouter();
const authStore = useAuthStore();
const isMobile = ref(false);
const menuOpen = ref(false);
const showProfileMenu = ref(false);

function checkMobile() {
  isMobile.value = window.innerWidth <= 900;
}
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});
onUnmounted(() => window.removeEventListener("resize", checkMobile));

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
function closeMenu() {
  menuOpen.value = false;
}
function closeProfileMenu() {
  showProfileMenu.value = false;
}

function handleProfileClick() {
  if (!authStore.isAuthenticated) {
    router.push("/login");
  } else {
    showProfileMenu.value = !showProfileMenu.value;
  }
}

function logout() {
  authStore.logout();
  closeProfileMenu();
  router.push("/login");
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: var(--color-blanco);
  padding: 0.5rem 1.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-oscuro);
}

.logo img {
  width: 44px;
  height: 44px;
}

.brand {
  font-weight: 800;
  font-size: 1.4rem;
}

.nav-links {
  display: flex;
  gap: 1.8rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: var(--color-oscuro);
  font-weight: 600;
  font-size: 1.15rem;
  position: relative;
  padding: 0.4rem 0;
}

.nav-link.is-active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 3px;
  background: linear-gradient(
    135deg,
    var(--color-azul-1),
    var(--color-primary-variant)
  );
  border-radius: 999px;
}

.divider {
  width: 1px;
  height: 22px;
  background: var(--color-info-luz);
}

.right {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  position: relative;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
}

.icon {
  width: 40px;
  height: 40px;
}

/* Mini-modal de perfil */
.profile-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-blanco);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  z-index: 1000;
  min-width: 150px;
}

.profile-options {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profile-options li {
  padding: 0.5rem 1rem;
}

.profile-options a {
  text-decoration: none;
  color: var(--color-oscuro);
  font-size: 1rem;
  font-weight: 500;
  display: block;
}

.profile-options a:hover {
  background-color: var(--color-info-luz);
  border-radius: 4px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Sidebar móvil */
@media (max-width: 900px) {
  .nav-links {
    display: none;
  }
}

.sidebar {
  position: fixed;
  inset: 0 40% 0 0;
  background: var(--color-blanco);
  padding: 1rem;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.close {
  order: 1;
}

.side-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.side-link {
  text-decoration: none;
  color: var(--color-oscuro);
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.8rem 1rem;
}

.side-link.is-active {
  color: var(--color-azul-1);
}

.side-divider {
  height: 1px;
  background: var(--color-info-luz);
  margin: 0.6rem 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
