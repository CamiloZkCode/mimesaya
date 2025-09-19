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
                    <input type="tel" id="telefono" v-model.trim="form.telefono" placeholder="xxxxxxxxxx"/>
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

<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({
    nombre: '',
    correo: '',
    telefono: '',
    mensaje: ''
})

const enviado = ref(false)

function enviarFormulario() {
    console.log('Formulario enviado:', form)
    enviado.value = true

    // Resetear formulario después de enviar
    form.nombre = ''
    form.correo = ''
    form.telefono = ''
    form.mensaje = ''

    // Opcional: ocultar mensaje después de unos segundos
    setTimeout(() => {
        enviado.value = false
    }, 5000)
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
    gap: .35rem;
}

label {
    font-weight: 600;
    color: var(--color-oscuro);
    font-size: .95rem;
}

input,
textarea {
    width: 100%;
    padding: .65rem .8rem;
    border: 1px solid var(--color-info-luz);
    border-radius: var(--border-radius-2);
    font-size: 1rem;
    background: var(--color-light);
    transition: border-color 120ms ease, box-shadow 120ms ease;
}

input:focus,
textarea:focus {
    border-color: var(--color-azul-1);
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 105, 255, 0.2);
}

/* Contador */
.char-counter {
    font-size: .85rem;
    color: var(--color-dark-variant);
    justify-self: end;
}

/* Botón centrado y estilos de reservas */
.form-actions {
    display: flex;
    justify-content: center;
}

.btn {
    --_pad: .6rem 1rem;
    padding: var(--_pad);
    border-radius: var(--border-radius-2);
    border: 1px solid transparent;
    cursor: pointer;
    font-weight: 700;
    letter-spacing: .2px;
    transition: transform 120ms ease, filter 120ms ease;
}

.btn:hover {
    transform: translateY(-1px);
    filter: brightness(.98);
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
    font-size: .85rem;
    color: var(--color-dark-variant);
    text-align: center;
    margin-top: .5rem;
}
</style>
