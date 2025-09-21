import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '@/store/auth'

// Layouts
import LayoutConFooter from "@/layouts/LayoutConFooter.vue";
import LayoutSinFooter from "@/layouts/LayoutSinFooter.vue";

// Vistas generales
import Home from "@/views/Home.vue";
import Reservas from "@/views/Reservas.vue";
import Contacto from "@/views/Contacto.vue";
import Login from "@/views/Login.vue";

// Cliente
import Perfil from "@/views/Cliente/Perfil.vue";

// Administrador
import GestionarReservas from "@/views/Administrador/GestionarReservas.vue";
import GestionarMesas from "@/views/Administrador/GestorMesas.vue";
import GestionarClientes from "@/views/Administrador/GestorClientes.vue";

const routes = [
  // 🌐 Rutas públicas (cualquiera puede ver)
  {
    path: "/",
    component: LayoutConFooter,
    children: [
      { path: "", name: "Home", component: Home },
      { path: "reservas", name: "Reservas", component: Reservas },
      { path: "contacto", name: "Contacto", component: Contacto }
    ],
  },

  // 👤 Cliente autenticado
  {
    path: "/perfil",
    component: LayoutConFooter,
    children: [
      { path: "", name: "Perfil", component: Perfil, meta: { requiereAuth: true, rol: "cliente" } },
    ],
  },

  // 🔑 Login (sin footer)
  {
    path: "/",
    component: LayoutSinFooter,
    children: [
      { path: "login", name: "Login", component: Login },
    ],
  },

  // ⚙️ Administración
  {
    path: "/admin",
    component: LayoutSinFooter,
    meta: { requiereAuth: true, rol: "administrador" },
    children: [
      { path: "reservas", name: "GestionarReservas", component: GestionarReservas },
      { path: "mesas", name: "GestionarMesas", component: GestionarMesas },
      { path: "clientes", name: "GestionarClientes", component: GestionarClientes },
    ],
  },

  // 🚨 Fallback
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Guards
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // ⛔ Bloquear acceso a login si ya está autenticado
  if (to.name === 'Login' && auth.isAuthenticated) {
    if (auth.isAdmin) return next('/admin/mesas')
    return next('/inicio')
  }

  // 🔒 Rutas que requieren autenticación
  if (to.meta.requiereAuth) {
    if (!auth.isAuthenticated) return next('/login')

    // 👮 Validar rol si la ruta lo pide
    if (to.meta.rol && auth.user?.rol?.toLowerCase() !== to.meta.rol) {
      return next('/') // redirige a Home si no tiene permisos
    }
  }

  next()
})

export default router
