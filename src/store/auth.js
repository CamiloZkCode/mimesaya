import { defineStore } from 'pinia';
import API from '@/services/axios';
import router from '@/router';
import Swal from 'sweetalert2';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  }),
  actions: {
    async login(correo, contraseña) {
      try {
        const response = await API.post('/auth/login', { correo, contraseña });
        const { token, user } = response.data;

        this.isAuthenticated = true;
        this.user = user;
        this.token = token;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirecciones según rol
        if (user.rol.toLowerCase() === 'administrador') {
          router.push('/admin/mesas');
          Swal.fire({
            icon: 'success',
            title: 'Bienvenido Administrador',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          router.push('/inicio');
          Swal.fire({
            icon: 'success',
            title: `Bienvenido ${user.nombre}`,
            timer: 2000,
            showConfirmButton: false
          });
        }

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Usuario o contraseña incorrectos'
        });
        throw error;
      }
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      Swal.fire({
        icon: 'info',
        title: 'Sesión cerrada',
        timer: 1500,
        showConfirmButton: false
      });

      router.push('/');
    }
  },
  getters: {
    isAdmin: (state) => state.user?.rol?.toLowerCase() === 'administrador',
    isCliente: (state) => state.user?.rol?.toLowerCase() === 'cliente'
  }
});
