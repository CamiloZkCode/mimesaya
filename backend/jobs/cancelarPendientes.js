// backend/jobs/cancelarPendientes.js
const moment = require("moment-timezone");
const cron = require("node-cron");
const ReservaModel = require("../models/reservas.models");

// === FUNCIÓN PRINCIPAL ===
async function cancelarReservasPendientes() {
  try {
    // Obtener todas las reservas pendientes
    const reservasPendientes = await ReservaModel.obtenerReservasPendientes();
    const ahora = moment().tz("America/Bogota");

    for (const reserva of reservasPendientes) {
      const minutosTranscurridos = ahora.diff(moment(reserva.fecha_creacion), "minutes");

      if (minutosTranscurridos >= 5) {
        await ReservaModel.actualizarEstadoReserva(reserva.id_reserva, "cancelada");
        console.log(`Reserva ${reserva.id_reserva} cancelada automáticamente (más de 5 min sin pagar).`);
      }
    }
  } catch (error) {
    console.error(" Error en autolimpieza de reservas:", error);
  }
}

// Se ejecuta automáticamente cada minuto
cron.schedule("* * * * *", async () => {
  await cancelarReservasPendientes();
});

module.exports = cancelarReservasPendientes;
