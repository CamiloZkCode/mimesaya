<template>
  <main class="factura-confirmada">
    <section class="factura-container">
      <div v-if="loading" class="estado">
        <p>Confirmando tu reserva...</p>
      </div>

      <div v-else-if="error" class="estado error">
        <h2>Error</h2>
        <p>{{ error }}</p>
        <RouterLink to="/" class="btn btn--primary mt-3">Volver al inicio</RouterLink>
      </div>

      <div v-else class="factura-card" id="facturaPDF">
        <!-- HEADER -->
        <header class="factura-header">
          <img :src="factura.logo_restaurante" alt="Logo Restaurante" class="logo" />
          <div>
            <h2>{{ factura.nombre_restaurante }}</h2>
            <p>Factura de Reserva</p>
          </div>
        </header>

        <!-- DATOS RESERVA -->
        <section class="datos-reserva">
          <div>
            <p><strong>ID Reserva:</strong> {{ factura.id_reserva }}</p>
            <p><strong>Fecha:</strong> {{ formatFecha(factura.fecha_inicio) }}</p>
            <p><strong>Hora:</strong> {{ factura.hora_reserva }}</p>
          </div>
          <div>
            <p><strong>Mesa:</strong> {{ factura.nombre_mesa }} (ID: {{ factura.id_mesa }})</p>
            <p><strong>Ocasión:</strong> {{ factura.nombre_ocasion }}</p>
          </div>
        </section>

        <!-- TABLA DE PRECIOS -->
        <section class="tabla-precios">
          <table>
            <thead>
              <tr>
                <th>Concepto</th>
                <th class="text-right">Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Precio ocasión</td>
                <td class="text-right">{{ formatPrice(factura.precio_ocasion) }}</td>
              </tr>
              <tr>
                <td>Fee MiMesaYa</td>
                <td class="text-right">{{ formatPrice(factura.comisionMiMesaYa) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>Total pagado</th>
                <th class="text-right">{{ formatPrice(factura.precio_total) }}</th>
              </tr>
            </tfoot>
          </table>
        </section>

        <!-- FOOTER -->
        <footer class="factura-footer">
          <p>✅ Gracias por tu reserva. ¡Te esperamos!</p>

          <!-- Botones visibles en la web, ocultos en PDF -->
          <div class="botones-footer no-pdf">
            <RouterLink to="/perfil" class="btn btn--primary mt-2">
              Ir a mis reservas
            </RouterLink>

            <button @click="descargarPDF" class="btn btn--secondary mt-2">
              Descargar PDF
            </button>
          </div>
        </footer>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { confirmarReserva, obtenerFactura } from "@/services/reservas";
import html2pdf from "html2pdf.js";

const route = useRoute();
const loading = ref(true);
const error = ref(null);
const factura = ref({});

onMounted(async () => {
  const sessionId = route.query.session_id;
  if (!sessionId) {
    error.value = "No se encontró la sesión de pago.";
    loading.value = false;
    return;
  }

  try {
    const confirmacion = await confirmarReserva(sessionId);
    const dataFactura = await obtenerFactura(confirmacion.reservaId);
    factura.value = dataFactura;
  } catch (err) {
    console.error(err);
    error.value = err.message || "Error al confirmar la reserva.";
  } finally {
    loading.value = false;
  }
});

function formatPrice(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 🧾 Generar PDF con diseño profesional solo en el PDF
function descargarPDF() {
  const element = document.getElementById("facturaPDF");
  const botones = element.querySelectorAll(".no-pdf");

  // Ocultar botones temporalmente
  botones.forEach(btn => btn.style.display = "none");

  // Aplicar clase PDF profesional
  element.classList.add("pdf-profesional");

  const opt = {
    margin: 10,
    filename: `Factura_${factura.value.id_reserva}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(element).save().finally(() => {
    // Restaurar botones y quitar clase profesional
    botones.forEach(btn => btn.style.display = "");
    element.classList.remove("pdf-profesional");
  });
}
</script>

<style scoped>
/* ================= WEB ================= */
.factura-confirmada {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
}

.factura-container {
  max-width: 700px;
  width: 100%;
}

.factura-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.factura-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.factura-header .logo {
  width: 90px;
  height: 90px;
  object-fit: contain;
  border-radius: 8px;
  background: #fafafa;
  padding: 5px;
}

.datos-reserva {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.tabla-precios table {
  width: 100%;
  border-collapse: collapse;
}

.tabla-precios th,
.tabla-precios td {
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.tabla-precios tfoot th {
  font-size: 1.1rem;
  font-weight: bold;
  border-top: 2px solid var(--color-azul-1);
}

.text-right {
  text-align: right;
}

.factura-footer {
  text-align: center;
  margin-top: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.botones-footer {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
}

.btn {
  display: inline-block;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s;
  cursor: pointer;
}

.btn--primary {
  background: var(--color-azul-1);
  color: #fff;
}

.btn--secondary {
  background: #444;
  color: #fff;
}

.btn:hover {
  opacity: 0.9;
}

.estado {
  font-size: 1.2rem;
  color: #555;
  text-align: center;
}

.estado.error {
  color: var(--color-rojo-5);
}

/* ================= PDF PROFESIONAL ================= */
.pdf-profesional {
  font-family: 'Helvetica', 'Arial', sans-serif;
  color: #333;
}

.pdf-profesional .factura-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #1a1a1a;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.pdf-profesional .factura-header .logo {
  width: 100px;
  height: auto;
  object-fit: contain;
  border-radius: 0;
  background: transparent;
}

.pdf-profesional h2 {
  margin: 0;
  font-size: 20px;
  color: #1a1a1a;
}

.pdf-profesional p {
  margin: 2px 0;
  color: #555;
}

.pdf-profesional .datos-reserva {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #ccc;
}

.pdf-profesional .tabla-precios table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.pdf-profesional .tabla-precios th,
.pdf-profesional .tabla-precios td {
  padding: 10px;
  border: 1px solid #ccc;
}

.pdf-profesional .tabla-precios th {
  background: #f0f0f0;
  text-align: left;
}

.pdf-profesional .tabla-precios tfoot th,
.pdf-profesional .tabla-precios tfoot td {
  font-weight: bold;
  font-size: 16px;
  background: #e8f0ff;
}

.pdf-profesional .text-right {
  text-align: right;
}

.pdf-profesional .factura-footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 14px;
  color: #555;
  border-top: 2px solid #1a1a1a;
  padding-top: 1rem;
}
</style>
