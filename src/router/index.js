import { createRouter, createWebHistory } from "vue-router";

// Layouts
import LayoutConFooter from "@/layouts/LayoutConFooter.vue";
import LayoutSinFooter from "@/layouts/LayoutSinFooter.vue";

// Vistas generales
import Home from "@/views/Home.vue";
import Reservas from "@/views/Reservas.vue";
import Contacto from "@/views/Contacto.vue";
import Login from "@/views/Login.vue";
import Registro from "@/views/Registro.vue";

// Cliente
import Perfil from "@/views/Cliente/Perfil.vue";

// Administrador
import GestionarReservas from "@/views/Administrador/GestionarReservas.vue";
import GestionarMesas from "@/views/Administrador/GestorMesas.vue";
import GestionarClientes from "@/views/Administrador/GestorClientes.vue";

const routes = [
  // 👥 Rutas públicas y de cliente (con footer)
  {
    path: "/",
    component: LayoutConFooter,
    children: [
      { path: "", name: "Home", component: Home },
      { path: "reservas", name: "Reservas", component: Reservas },
      { path: "contacto", name: "Contacto", component: Contacto },
      { path: "perfil", name: "Perfil", component: Perfil },
    ],
  },

  // 🔑 Login y Registro (sin footer)
  {
    path: "/",
    component: LayoutSinFooter,
    children: [
      { path: "login", name: "Login", component: Login },
      { path: "registro", name: "Registro", component: Registro },
    ],
  },

  // ⚙️ Administración (sin footer)
  {
    path: "/admin",
    component: LayoutSinFooter,
    children: [
      { path: "reservas", name: "GestionarReservas", component: GestionarReservas },
      { path: "mesas", name: "GestionarMesas", component: GestionarMesas },
      { path: "clientes", name: "GestionarClientes", component: GestionarClientes },
    ],
  },

  // 🚨 Fallback para rutas inexistentes
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
