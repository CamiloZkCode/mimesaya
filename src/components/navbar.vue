<template>
  <nav class="navbar">
    <!-- Botón hamburguesa (solo mobile) -->
    <button class="hamburger" @click="toggleMenu" v-if="isMobile">
      <img src="@/assets/icons/menu.png" alt="menu" class="hamburger-icon" />
    </button>

    <!-- Logo + Marca -->
    <div class="logo">
      <img src="@/assets/icons/menu.png" alt="MiMesaYa" />
      <span class="brand">MiMesaYa</span>
    </div>

    <!-- Links Desktop -->
    <ul class="nav-links" v-if="!isMobile">
      <li><router-link to="/" active-class="active">Inicio</router-link></li>
      <li><router-link to="/reservas" active-class="active">Reservar</router-link></li>
      <li><router-link to="/contacto" active-class="active">Contacto</router-link></li>
      <li v-if="auth.isAdmin"><router-link to="/admin/mesas" active-class="active">Gestionar Mesas</router-link></li>
      <li v-if="auth.isAdmin"><router-link to="/admin/reservas" active-class="active">Gestionar Reservas</router-link>
      </li>
      <li v-if="auth.isAdmin"><router-link to="/admin/clientes" active-class="active">Gestionar Clientes</router-link>
      </li>
    </ul>

    <!-- Perfil -->
    <div class="perfil" @click="handleProfileClick">
      <img src="@/assets/icons/menu.png" alt="perfil" class="perfil-icon" />
    </div>
  </nav>

  <!-- Sidebar Mobile -->
  <transition name="slide">
    <aside v-if="isMobile && menuOpen" class="sidebar">
      <!-- Botón cerrar como imagen -->
      <button class="close" @click="toggleMenu">
        <img src="@/assets/icons/close.png" alt="cerrar" class="close-icon" />
      </button>

      <ul>
        <li><router-link to="/" active-class="active" @click="closeMenu">Inicio</router-link></li>
        <li><router-link to="/reservas" active-class="active" @click="closeMenu">Reservar</router-link></li>
        <li><router-link to="/contacto" active-class="active" @click="closeMenu">Contacto</router-link></li>
        <li v-if="auth.isAdmin"><router-link to="/admin/mesas" active-class="active" @click="closeMenu">Gestionar
            Mesas</router-link></li>
        <li v-if="auth.isAdmin"><router-link to="/admin/reservas" active-class="active" @click="closeMenu">Gestionar
            Reservas</router-link></li>
        <li v-if="auth.isAdmin"><router-link to="/admin/clientes" active-class="active" @click="closeMenu">Gestionar
            Clientes</router-link></li>
      </ul>
    </aside>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const auth = ref({
  isLoggedIn: false,
  isAdmin: true,
});

const isMobile = ref(false);
const menuOpen = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});
onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
const closeMenu = () => {
  menuOpen.value = false;
};

const handleProfileClick = () => {
  if (!auth.value.isLoggedIn) {
    window.location.href = "/login";
  } else {
    alert("Abrir menú de perfil aquí");
  }
};
</script>

<style scoped>
/* ===== Navbar base ===== */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-blanco, #fff);
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  left: 0;
  right: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo img {
  width: 50px;
  height: 50px;
}

.brand {
  font-weight: 700;
  font-size: 1.3rem;
  font-family: 'Poppins', sans-serif;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.nav-links a {
  text-decoration: none;
  color: var(--color-oscuro, #333);
  font-weight: 500;
}

.nav-links a.active {
  color: var(--color-rojo-5, crimson);
}

.perfil {
  cursor: pointer;
}

.perfil-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

/* ===== Mobile ===== */
.hamburger {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.hamburger-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100%;
  background: var(--color-blanco, #fff);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 1rem 0;
}

.sidebar a {
  text-decoration: none;
  color: var(--color-oscuro, #333);
  font-size: 1.1rem;
  font-weight: 500;
}

.sidebar a.active {
  color: var(--color-rojo-5, crimson);
}

.close {
  align-self: flex-end;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-bottom: 1rem;
}

.close-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

/* Animación del sidebar */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
