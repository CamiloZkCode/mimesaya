<template>
  <main class="auth empresa">
    <div class="form-container">
      <form @submit.prevent="registrarEmpresa">
        <h1>Registro de Empresa</h1>

        <!-- ===== TRANSICIÓN ENTRE PASOS ===== -->
        <transition name="fade" mode="out-in">
          <!-- ===== PASO 1: DATOS DEL ADMINISTRADOR ===== -->
          <div v-if="step === 1" key="step1" class="step">
            <h2>Datos del Administrador</h2>

            <div class="input-box">
              <label for="cedula">Cédula</label>
              <div class="input-wrapper">
                <input type="number" v-model="form.usuario.cedula" id="cedula" placeholder="1234567890" required />
                <span class="material-symbols-outlined icon-static">badge</span>
              </div>
            </div>

            <div class="input-box">
              <label for="nombre">Nombre Completo</label>
              <div class="input-wrapper">
                <input type="text" v-model="form.usuario.nombre" id="nombre" placeholder="Joan Zapata" required />
                <span class="material-symbols-outlined icon-static">person</span>
              </div>
            </div>

            <div class="input-box">
              <label for="telefono">Teléfono</label>
              <div class="input-wrapper">
                <input type="tel" v-model="form.usuario.telefono" id="telefono" placeholder="3001234567" required />
                <span class="material-symbols-outlined icon-static">call</span>
              </div>
            </div>

            <div class="input-box">
              <label for="correo">Correo</label>
              <div class="input-wrapper">
                <input type="email" v-model="form.usuario.correo" id="correo" placeholder="admin@mimesaya.com" required />
                <span class="material-symbols-outlined icon-static">mail</span>
              </div>
            </div>

            <div class="input-box">
              <label for="password">Contraseña</label>
              <div class="input-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="form.usuario.password"
                  id="password"
                  placeholder="********"
                  required
                />
                <span class="material-symbols-outlined toggle-password" @click="showPassword = !showPassword">
                  {{ showPassword ? 'lock_open' : 'lock' }}
                </span>
              </div>
            </div>

            <button type="button" class="btn btn--primary" @click="siguientePaso">Siguiente</button>
          </div>

          <!-- ===== PASO 2: DATOS DEL RESTAURANTE ===== -->
          <div v-else key="step2" class="step">
            <h2>Datos del Restaurante</h2>

            <div class="input-box">
              <label for="nit">NIT</label>
              <div class="input-wrapper">
                <input type="text" v-model="form.restaurante.nit" id="nit" placeholder="123456789-0" required />
                <span class="material-symbols-outlined icon-static">assignment</span>
              </div>
            </div>

            <div class="input-box">
              <label for="nombre_restaurante">Nombre</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  v-model="form.restaurante.nombre"
                  id="nombre_restaurante"
                  placeholder="Mi Restaurante"
                  required
                />
                <span class="material-symbols-outlined icon-static">restaurant</span>
              </div>
            </div>

            <div class="input-box">
              <label for="direccion">Dirección</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  v-model="form.restaurante.direccion"
                  id="direccion"
                  placeholder="Calle 123 #45-67"
                  required
                />
                <span class="material-symbols-outlined icon-static">location_on</span>
              </div>
            </div>

            <div class="input-box">
              <label for="telefono_restaurante">Teléfono</label>
              <div class="input-wrapper">
                <input
                  type="tel"
                  v-model="form.restaurante.telefono"
                  id="telefono_restaurante"
                  placeholder="6011234567"
                />
                <span class="material-symbols-outlined icon-static">call</span>
              </div>
            </div>

            <div class="input-box">
              <label for="tipo_restaurante">Tipo de Restaurante</label>
              <div class="input-wrapper">
                <select v-model="form.restaurante.id_tipo" id="tipo_restaurante" required>
                  <option value="">Seleccione un tipo</option>
                  <option v-for="tipo in tiposRestaurante" :key="tipo.id_tipo" :value="tipo.id_tipo">
                    {{ tipo.nombre_tipo }}
                  </option>
                </select>
                <span class="material-symbols-outlined icon-static">category</span>
              </div>
            </div>

            <div class="input-box">
              <label for="logo">Logo (URL)</label>
              <div class="input-wrapper">
                <input
                  type="url"
                  v-model="form.restaurante.logo"
                  id="logo"
                  placeholder="https://logo.com/logo.png"
                  required
                />
                <span class="material-symbols-outlined icon-static">image</span>
              </div>
            </div>

            <div class="buttons">
              <button type="button" class="btn btn--secondary" @click="step = 1">Atrás</button>
              <button type="submit" class="btn btn--primary">Registrar Empresa</button>
            </div>
          </div>
        </transition>

        <!-- ===== INDICADORES DE PROGRESO ===== -->
        <div class="step-indicators">
          <div :class="['indicator', step >= 1 ? 'active' : '']">1</div>
          <div class="line" :class="{ active: step === 2 }"></div>
          <div :class="['indicator', step === 2 ? 'active' : '']">2</div>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { registrarAdministrador } from "@/services/usuarios";
import { obtenerTiposRestaurantes } from "@/services/restaurante";

const step = ref(1);
const showPassword = ref(false);
const tiposRestaurante = ref([]);

const form = ref({
  usuario: {
    cedula: "",
    nombre: "",
    telefono: "",
    correo: "",
    password: "",
  },
  restaurante: {
    nit: "",
    nombre: "",
    direccion: "",
    telefono: "",
    logo: "",
    id_tipo: "",
  },
});

onMounted(async () => {
  try {
    tiposRestaurante.value = await obtenerTiposRestaurantes();
  } catch (err) {
    console.error("Error al cargar tipos de restaurante:", err);
  }
});

function siguientePaso() {
  const u = form.value.usuario;
  if (!u.cedula || !u.nombre || !u.telefono || !u.correo || !u.password) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor completa todos los datos del administrador antes de continuar.",
    });
    return;
  }
  step.value = 2;
}

async function registrarEmpresa() {
  try {
    const resp = await registrarAdministrador(form.value);

    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text: resp.mensaje,
      confirmButtonText: "Configurar Pagos",
    }).then(() => {
      window.open(resp.stripeOnboardingUrl, "_blank");

      form.value = {
        usuario: {
          cedula: "",
          nombre: "",
          telefono: "",
          correo: "",
          password: "",
        },
        restaurante: {
          nit: "",
          nombre: "",
          direccion: "",
          telefono: "",
          logo: "",
          id_tipo: "",
        },
      };
      step.value = 1;
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "No se pudo registrar la empresa",
      confirmButtonText: "OK",
    });
  }
}
</script>

<style scoped>
.empresa .form-container {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  padding: 2rem 2.5rem;
  background: var(--color-blanco);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: var(--color-oscuro);
  border-bottom: 2px solid var(--color-info-luz);
  padding-bottom: 0.3rem;
}

.input-box {
  display: flex;
  flex-direction: column;
  margin: 15px 0;
  align-items: flex-start;
  width: 100%;
}

label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
  color: var(--color-oscuro);
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper input,
.input-wrapper select {
  width: 100%;
  padding: 0.65rem 0.8rem;
  padding-right: 2.5rem;
  border: 1px solid var(--color-info-luz);
  border-radius: var(--border-radius-2);
  font-size: 1rem;
  transition: 0.2s ease;
}

.input-wrapper input:focus,
.input-wrapper select:focus {
  border-color: var(--color-azul-1);
  box-shadow: 0 0 0 3px rgba(0, 105, 255, 0.15);
  outline: none;
}

.icon-static,
.toggle-password {
  position: absolute;
  top: 50%;
  right: 0.7rem;
  transform: translateY(-50%);
  font-size: 1.3rem;
  color: var(--color-azul-1);
}

.toggle-password {
  cursor: pointer;
}

/* Botones */
.btn {
  margin-top: 0.6rem;
  width: 100%;
  padding: 0.9rem;
  font-weight: 700;
  border: none;
  border-radius: var(--border-radius-2);
  background: linear-gradient(135deg, var(--color-azul-1), var(--color-primary-variant));
  color: var(--color-blanco);
  cursor: pointer;
  transition: 0.2s ease;
}

.btn:hover {
  filter: brightness(1.05);
  transform: translateY(-2px);
}

.btn--secondary {
  background: var(--color-info-luz);
  color: var(--color-oscuro);
}

.buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

/* Indicadores */
.step-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}

.indicator {
  width: 35px;
  height: 35px;
  background: var(--color-info-luz);
  color: var(--color-oscuro);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  transition: 0.3s ease;
}

.indicator.active {
  background: var(--color-azul-1);
  color: white;
  transform: scale(1.1);
}

.line {
  width: 50px;
  height: 3px;
  background: var(--color-info-luz);
  transition: background 0.3s ease;
}

.line.active {
  background: var(--color-azul-1);
}

/* Transición */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsivo */
@media screen and (max-width: 768px) {
  .empresa .form-container {
    max-width: 100%;
    padding: 1.5rem;
  }
}
</style>
