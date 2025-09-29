<template>
  <main class="contacto">
    <!-- ===== FORMULARIO DE CONTACTO ===== -->
    <section class="contacto__section">
      <header class="section-header">
        <h2>Recibe más información sobre nuestros servicios</h2>
        <p>Déjanos tus datos y te contactaremos en breve.</p>
      </header>

      <form class="contacto__form" @submit.prevent="enviarFormulario">
        <div class="form-group">
          <label for="nombre">Nombre completo</label>
          <input type="text" id="nombre" v-model.trim="form.nombre" required placeholder="Joan David Zapata Turizo" />
        </div>

        <div class="form-group">
          <label for="correo">Correo electrónico</label>
          <input type="email" id="correo" v-model.trim="form.correo" required placeholder="juan_david@gmail.com" />
        </div>

        <div class="form-group">
          <label for="telefono">Teléfono</label>
          <input type="tel" id="telefono" v-model.trim="form.telefono" placeholder="xxxxxxxxxx" />
        </div>

        <div class="form-group">
          <label for="mensaje">Mensaje</label>
          <textarea id="mensaje" rows="4" maxlength="500" v-model.trim="form.mensaje" required></textarea>
          <small class="char-counter">{{ form.mensaje.length }}/500</small>
        </div>

        <div class="form-actions">
          <button v-if="!enviado" type="submit" class="btn btn--primary">
            Solicitar información
          </button>
          <p v-else class="gracias-msg">¡Gracias! Nos pondremos en contacto contigo</p>
        </div>

        <p class="seguridad-msg">
          Tus datos están seguros, nunca compartiremos tu información.
        </p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { enviarContacto } from '@/services/contacto';

const form = reactive({
  nombre: '',
  correo: '',
  telefono: '',
  mensaje: '',
});

const enviado = ref(false);

async function enviarFormulario() {
  try {
    await enviarContacto({
      nombre: form.nombre,
      correo: form.correo,
      telefono: form.telefono,
      mensaje: form.mensaje,
    });
    enviado.value = true;

    // Reset form
    form.nombre = '';
    form.correo = '';
    form.telefono = '';
    form.mensaje = '';

    // Hide success message after 5 seconds
    setTimeout(() => {
      enviado.value = false;
    }, 5000);
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    alert('Hubo un error al enviar el formulario. Por favor, intenta de nuevo.');
  }
}
</script>

<style scoped>
.contacto {
  max-width: 720px;
  margin: 0 auto;
  padding: 0.5rem 1rem 3rem;
}

.contacto__section {
  background: var(--color-blanco);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  display: grid;
  gap: 1.25rem;
}

.contacto__section .section-header {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.contacto__form {
  display: grid;
  gap: 1rem;
}

.form-group {
  display: grid;
  gap: 0.35rem;
}

label {
  font-weight: 600;
  color: var(--color-oscuro);
  font-size: 0.95rem;
}

input,
textarea {
  width: 100%;
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--color-info-luz);
  border-radius: var(--border-radius-2);
  font-size: 1rem;
  background: var(--color-light);
  transition: border-color 120ms ease, box-shadow 120ms ease;
  box-sizing: border-box; /* Asegura que el padding no afecte el tamaño total */
}


textarea {
  resize: none; 
  max-height: 150px; 
}

input {
  height: 2.5rem;
}

/* Estilos al enfocar */
input:focus,
textarea:focus {
  border-color: var(--color-azul-1);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 105, 255, 0.2);
}

/* Contador */
.char-counter {
  font-size: 0.85rem;
  color: var(--color-dark-variant);
  justify-self: end;
}

/* Botón centrado y estilos de reservas */
.form-actions {
  display: flex;
  justify-content: center;
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

.gracias-msg {
  font-weight: 600;
  color: var(--color-azul-1);
  text-align: center;
}

.seguridad-msg {
  font-size: 0.85rem;
  color: var(--color-dark-variant);
  text-align: center;
  margin-top: 0.5rem;
}


@media (max-width: 576px) {
  .contacto__section {
    padding: 1.4rem; 
  }

  .contacto__section .section-header  {
    text-align:  center;
  }


}
</style>