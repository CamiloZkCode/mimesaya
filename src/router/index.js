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
import RegistrarRestaurante from "@/views/RegistrarRestaurante.vue";

// Cliente
import PerfilCliente from "@/views/Cliente/PerfilCliente.vue";
import ReservaSuccess from "@/views/Cliente/ReservaConfirmada.vue";
import ReservaCancel from "@/views/Cliente/ReservaCancelada.vue";


// Administrador
import GestionarReservas from "@/views/Administrador/GestionarReservas.vue";
import GestionarMesas from "@/views/Administrador/GestorMesas.vue";
import GestionarClientes from "@/views/Administrador/GestorClientes.vue";
import PerfilAdministrador from "@/views/Administrador/PerfilAdministrador.vue";

const routes = [
  // 🌐 Rutas públicas
  {
    path: "/",
    component: LayoutConFooter,
    children: [
      { path: "", name: "Home", component: Home },
      { path: "reservas", name: "Reservas", component: Reservas },
      { path: "contacto", name: "Contacto", component: Contacto },
      { path: "reserva/success", name: "ReservaSuccess", component: ReservaSuccess },
      { path: "reserva/cancel", name: "ReservaCancel", component: ReservaCancel },
    ],
  },

  // 👤 Cliente autenticado
  {
    path: "/perfil",
    component: LayoutConFooter,
    children: [
      { 
        path: "", 
        name: "PerfilCliente", 
        component: PerfilCliente, 
        meta: { requiereAuth: true, rol: "cliente" } 
      },
    ],
  },

  // 🔑 Login y registro (sin footer)
  {
    path: "/",
    component: LayoutSinFooter,
    children: [
      { path: "login", name: "Login", component: Login },
      { path: "registrar-restaurante", name: "RegistrarRestaurante", component: RegistrarRestaurante }
    ],
  },

  // ⚙️ Administración
  {
    path: "/admin",
    component: LayoutSinFooter,
    meta: { requiereAuth: true, rol: "administrador" },
    children: [
      { path: "perfil", name: "PerfilAdministrador", component: PerfilAdministrador },
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
    if (auth.isAdmin) return next('/admin/perfil')
    return next('/perfil')
  }

  // ⛔ Bloquear acceso a registrar-restaurante si ya está autenticado
  if (to.name === 'RegistrarRestaurante' && auth.isAuthenticated) {
    return next('/') // o podrías mandarlo a su perfil
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
