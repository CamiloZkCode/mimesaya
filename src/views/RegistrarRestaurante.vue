<template>
  <main class="auth empresa">
    <div class="form-container">
      <form @submit.prevent="registrarEmpresa">
        <h1>Registro de Empresa</h1>

        <div class="columns">
          <!-- ===== COLUMNA ADMIN ===== -->
          <div class="col">
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
                <input :type="showPassword ? 'text' : 'password'" v-model="form.usuario.password" id="password"
                  placeholder="********" required />
                <span class="material-symbols-outlined toggle-password" @click="showPassword = !showPassword">
                  {{ showPassword ? 'lock_open' : 'lock' }}
                </span>
              </div>
            </div>
          </div>

          <!-- ===== COLUMNA RESTAURANTE ===== -->
          <div class="col">
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
                <input type="text" v-model="form.restaurante.nombre" id="nombre_restaurante"
                  placeholder="Mi Restaurante" required />
                <span class="material-symbols-outlined icon-static">restaurant</span>
              </div>
            </div>

            <div class="input-box">
              <label for="direccion">Dirección</label>
              <div class="input-wrapper">
                <input type="text" v-model="form.restaurante.direccion" id="direccion" placeholder="Calle 123 #45-67"
                  required />
                <span class="material-symbols-outlined icon-static">location_on</span>
              </div>
            </div>

            <div class="input-box">
              <label for="telefono_restaurante">Teléfono</label>
              <div class="input-wrapper">
                <input type="tel" v-model="form.restaurante.telefono" id="telefono_restaurante" placeholder="6011234567" />
                <span class="material-symbols-outlined icon-static">call</span>
              </div>
            </div>

            <div class="input-box">
              <label for="logo">Logo (URL)</label>
              <div class="input-wrapper">
                <input type="url" v-model="form.restaurante.logo" id="logo" placeholder="https://logo.com/logo.png"
                  required />
                <span class="material-symbols-outlined icon-static">image</span>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn--primary">Registrar Empresa</button>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
// import { registrarEmpresa } from "@/services/empresas.js" // futuro servicio

const showPassword = ref(false);

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
  },
});

async function registrarEmpresa() {
  try {
    console.log("Admin:", form.value.usuario);
    console.log("Restaurante:", form.value.restaurante);

    // const resp = await registrarEmpresa(form.value);
    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text: "Tu empresa fue registrada correctamente",
    });

    // Redirigir al login
    window.location.href = "/login";
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message || "No se pudo registrar la empresa",
    });
  }
}
</script>

<style scoped>
.empresa .form-container {
  width: 100%;
  max-width: 900px; 
  margin: 0 auto;   
  padding: 1rem 2.5rem;
  background: var(--color-blanco);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
}

h1 {
  text-align: center;
  margin-bottom: 0.8rem;
}

.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* ===== Columna ===== */
.col h2 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: var(--color-oscuro);
  border-bottom: 2px solid var(--color-info-luz);
  padding-bottom: 0.3rem;
}

/* ===== Inputs ===== */
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

/* Todos los inputs igual tamaño */
.input-wrapper input {
  width: 100%;
  padding: 0.65rem 0.8rem;
  padding-right: 2.5rem;
  border: 1px solid var(--color-info-luz);
  border-radius: var(--border-radius-2);
  font-size: 1rem;
  transition: 0.2s ease;
}

.input-wrapper input:focus {
  border-color: var(--color-azul-1);
  box-shadow: 0 0 0 3px rgba(0, 105, 255, 0.15);
  outline: none;
}

/* Iconos */
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

/* Botón */
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

/* ===== Responsivo ===== */
@media screen and (max-width: 768px) {
  .columns {
    grid-template-columns: 1fr;
  }

  .empresa .form-container {
    max-width: 100%;
    padding: 1.5rem;
  }
}
</style>

