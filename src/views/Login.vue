<template>
  <main class="auth">
    <div class="auth__section" :class="{ 'active': isRegister }">
      <div class="form-container login-container" :class="{ 'active': !isRegister }">
        <form @submit.prevent="login">
          <h1>Iniciar Sesión</h1>
          <div class="input-box">
            <label for="email">Correo Electrónico</label>
            <div class="input-wrapper">
              <input type="email" v-model="loginForm.correo" id="email" placeholder="mimesaya@gmail.com" required />
              <span class="material-symbols-outlined icon-static">person</span>
            </div>
          </div>
          <div class="input-box">
            <label for="password">Contraseña</label>
            <div class="input-wrapper">
              <input :type="showLoginPassword ? 'text' : 'password'" v-model="loginForm.password" id="password"
                placeholder="********" required />
              <span class="material-symbols-outlined toggle-password" @click="toggleLoginPassword"
                :aria-label="showLoginPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">{{ showLoginPassword ?
                'lock_open' : 'lock' }}</span>
            </div>
          </div>
          <button type="submit" class="btn btn--primary">Iniciar Sesión</button>
        </form>
      </div>

      <!-- Registro -->
      <div class="form-container registro-container" :class="{ 'active': isRegister }">
        <form @submit.prevent="register">
          <h1>Registrarse</h1>
          <div class="input-boxr">
            <label for="nombre">Nombre Completo</label>
            <div class="input-wrapper">
              <input type="text" v-model="registerForm.nombre" id="nombre" placeholder="Joan David Zapata Turizo"
                required />
              <span class="material-symbols-outlined icon-static">person</span>
            </div>
          </div>

          <div class="input-boxr">
            <label for="cedyla">Numero Identificacion</label>
            <div class="input-wrapper">
              <input type="number" v-model="registerForm.cedula" id="cedula" placeholder="xxxxxxxxxx" required />
              <span class="material-symbols-outlined icon-static">id_card</span>
            </div>
          </div>

          <div class="input-boxr">
            <label for="email">Correo Electrónico</label>
            <div class="input-wrapper">
              <input type="email" v-model="registerForm.correo" id="email" placeholder="mimesaya@gmail.com" required />
              <span class="material-symbols-outlined icon-static">mail</span>
            </div>
          </div>

          <div class="input-boxr">
            <label for="telefono">Teléfono</label>
            <div class="input-wrapper">
              <input type="tel" v-model="registerForm.telefono" id="telefono" placeholder="xxxxxxxxxx" required />
              <span class="material-symbols-outlined icon-static">call</span>
            </div>
          </div>

          <div class="input-boxr">
            <label for="password">Contraseña</label>
            <div class="input-wrapper">
              <input :type="showRegisterPassword ? 'text' : 'password'" v-model="registerForm.password" id="password"
                placeholder="********" required />
              <span class="material-symbols-outlined toggle-password" @click="toggleRegisterPassword"
                :aria-label="showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">{{ showRegisterPassword
                  ? 'lock_open' : 'lock' }}</span>
            </div>
          </div>

          <div class="input-boxr">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <div class="input-wrapper">
              <input :type="showConfirmPassword ? 'text' : 'password'" v-model="registerForm.confirmPassword"
                id="confirmPassword" placeholder="********" required />
              <span class="material-symbols-outlined toggle-password" @click="toggleConfirmPassword"
                :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">{{ showConfirmPassword ?
                'lock_open' : 'lock' }}</span>
            </div>
          </div>

          <button type="submit" class="btn btn--primary">Registrarse</button>
        </form>
      </div>

      <!-- Paneles de toggle -->
      <div class="toggle-box">
        <div class="toggle-panel toggle-left">
          <h1>¡Bienvenido a MiMesaYa!</h1>
          <img src="@/assets/Logo/LogoCon.png" alt="MiMesaYa" />
          <p>No tienes una cuenta aun ?</p>
          <button class="btn registrar" @click="activarRegistro">Registrarse</button>
        </div>
        <div class="toggle-panel toggle-right">
          <h1>¡Bienvenido a MiMesaYa!</h1>
          <img src="@/assets/Logo/LogoConLetra.jpg" alt="MiMesaYa" />
          <p>Ya tienes cuenta, inicia sesion</p>
          <button class="btn iniciar" @click="activarLogin">Iniciar</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import Swal from 'sweetalert2'
import { registrarUsuario } from '@/services/usuarios.js'  // <-- import

const auth = useAuthStore()

// estados
const isRegister = ref(false)

const loginForm = reactive({ correo: '', password: '' })
const registerForm = reactive({ nombre: '', correo: '', telefono: '', password: '', confirmPassword: '' })

const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)
const showConfirmPassword = ref(false)

async function login() {
  try {
    await auth.login(loginForm.correo, loginForm.password)
    Swal.fire({
      icon: 'success',
      title: 'Bienvenido',
      text: `Hola ${auth.user?.nombre || 'Usuario'}`
    })
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Credenciales incorrectas'
    })
  }
}

async function register() {
  if (registerForm.password !== registerForm.confirmPassword) {
    return Swal.fire({
      icon: 'warning',
      title: 'Error',
      text: 'Las contraseñas no coinciden'
    })
  }

  try {
    const data = await registrarUsuario({
      id_usuario: registerForm.cedula,   // 👈 agregado
      nombre: registerForm.nombre,
      correo: registerForm.correo,
      telefono: registerForm.telefono,
      contraseña: registerForm.password
    })

    Swal.fire({
      icon: 'success',
      title: 'Registro exitoso',
      text: data.mensaje || 'Usuario registrado correctamente'
    })

    // limpiar formulario y volver al login
    Object.assign(registerForm, { nombre: '', correo: '', telefono: '', password: '', confirmPassword: '' })
    isRegister.value = false
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudo registrar el usuario'
    })
  }
}

function activarRegistro() { isRegister.value = true }
function activarLogin() { isRegister.value = false }
function toggleLoginPassword() { showLoginPassword.value = !showLoginPassword.value }
function toggleRegisterPassword() { showRegisterPassword.value = !showRegisterPassword.value }
function toggleConfirmPassword() { showConfirmPassword.value = !showConfirmPassword.value }
</script>


<style scoped>
.auth {
  max-width: 900px;
  margin: 0 auto;
  padding: 0.5rem 1rem;
}

.auth__section {
  background: var(--color-blanco);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  position: relative;
  width: 100%;
  min-height: 500px;
  overflow: hidden;
}

.form-container {
  position: absolute;
  right: 0;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  z-index: 1;
  background: var(--color-blanco);
  transition: 0.6s ease-in-out 1.2s visibility, 0s 1s;
}

.auth__section.active .form-container {
  right: 50%;
}

.form-container.registro-container {
  visibility: hidden;
}

.auth__section.active .form-container.registro-container {
  visibility: visible;
  left: 0;
  transition-delay: 0.6s;
}

form {
  width: 100%;
}

.form-container h1 {
  margin: -10px 0;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.input-box {
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  width: 100%;
  align-items: flex-start;
}

.input-boxr {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  width: 100%;
  align-items: flex-start;
}

.input-box label,
.input-boxr label {
  font-weight: 600;
  color: var(--color-oscuro);
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
  margin-left: 15%;
}

input[type="number"] {
  appearance: textfield; /* Standard */
  -moz-appearance: textfield; /* Firefox */
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none; /* Chrome, Safari, Edge */
  margin: 0;
}

.input-wrapper {
  position: relative;
  width: 70%;
  margin: 0 auto;
}

.input-wrapper input {
  width: 100%;
  padding: 0.65rem 0.8rem;
  padding-right: 2.5rem;
  /* Espacio para el ícono interactivo */
  border: 1px solid var(--color-info-luz);
  border-radius: var(--border-radius-2);
  font-size: 1rem;
  background: var(--color-blanco);
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

/* Ícono estático (no interactivo) */
.icon-static {
  position: absolute;
  top: 50%;
  right: 0.7rem;
  transform: translateY(-50%);
  color: var(--color-azul-1);
  font-size: 1.3rem;
  pointer-events: none;
}

/* Ícono interactivo para alternar visibilidad */
.toggle-password {
  position: absolute;
  top: 50%;
  right: 0.7rem;
  transform: translateY(-50%);
  cursor: pointer;
  background: transparent;
  border: none;
  font-size: 1.3rem;
  color: var(--color-azul-1);
  padding: 0;
}

.toggle-password:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 105, 255, 0.3);
}

.input-wrapper input:focus {
  border-color: var(--color-azul-1);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 105, 255, 0.2);
}

.btn {
  --_pad: 0.6rem 1rem;
  padding: var(--_pad);
  border-radius: var(--border-radius-2);
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.2px;
  transition: transform 120ms ease, filter 120ms ease;
}

.btn:hover {
  transform: translateY(-1px);
  filter: brightness(0.98);
}

.btn:active {
  transform: translateY(0);
}

.btn--primary {
  background: linear-gradient(135deg, var(--color-azul-1), var(--color-primary-variant));
  color: var(--color-blanco);
}

/*====================Parte Izquierda==============*/

.toggle-box {
  position: absolute;
  width: 100%;
  height: 100%;
}

.toggle-box::before {
  content: '';
  position: absolute;
  left: -250%;
  width: 300%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-azul-1), var(--color-primary-variant));
  border-radius: 150px;
  z-index: 2;
  transition: 1.8s ease-in-out;
}

.auth__section.active .toggle-box::before {
  left: 50%;
}

.toggle-panel {
  position: absolute;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-items: center;
  color: var(--color-blanco);
  z-index: 2;
  transition: 0.6s ease-in-out;
}

.toggle-panel.toggle-left {
  left: 0;
  transition-delay: 1.2s;
}

.auth__section.active .toggle-panel.toggle-left {
  left: -50%;
  transition-delay: 0.6s;
}

.toggle-panel.toggle-right {
  right: -50%;
  transition-delay: 0.6s;
}

.auth__section.active .toggle-panel.toggle-right {
  right: 0%;
  transition-delay: 1.2s;
}

.toggle-panel p {
  margin-bottom: 2rem;
}

.toggle-panel img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 40%;
  margin: 1rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media screen and (max-width: 650px) {
  .auth__section {
    height: calc(100vh - 65px);
  }

  .form-container.login-container {
    bottom: 0;
    width: 100%;
    height: 80%;
  }

  .form-container.registro-container {
    bottom: 0;
    width: 100%;
    height: 65%;
  }

  .auth__section.active .form-container {
    right: 0;
    bottom: 30%;
  }

  .toggle-box::before {
    left: 0;
    top: -270%;
    width: 100%;
    height: 300%;
    border-radius: 20vw;
  }

  .auth__section.active .toggle-box::before {
    top: 75%;
    left: 0;
  }

  .toggle-panel {
    width: 100%;
    height: 30%;
  }

  .toggle-panel img {
    display: none;
  }

  .toggle-panel.toggle-left {
    top: 0;
  }

  .auth__section.active .toggle-panel.toggle-left {
    left: 0;
    top: -30%;
  }

  .toggle-panel.toggle-right {
    right: 0;
    bottom: -30%;
  }

  .auth__section.active .toggle-panel.toggle-right {
    right: 0;
    bottom: -5%;
  }
}
</style>