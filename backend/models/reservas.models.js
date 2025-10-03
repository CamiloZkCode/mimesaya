// models/reservas.models.js
const db = require("../config/db");
const moment = require("moment-timezone");

const ReservaModel = {
  async crearReserva(data) {
    const [result] = await db.query(
      `INSERT INTO reserva 
        (id_usuario, id_restaurante, id_mesa, id_ocasion, fecha_inicio, fecha_fin, notas, estado_reserva)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.id_usuario || null,
        data.id_restaurante,
        data.id_mesa,
        data.id_ocasion,
        data.fecha_inicio,
        data.fecha_fin,
        data.notas || null,
        data.estado_reserva || "pendiente_pago",
      ]
    );
    return result.insertId;
  },

  async obtenerReservasPorMesaYFecha(id_mesa, fecha) {
    const startDate = `${fecha} 00:00:00`;
    const endDate = `${fecha} 23:59:59`;
    const [rows] = await db.query(
      `SELECT fecha_inicio, fecha_fin, estado_reserva
       FROM reserva
       WHERE id_mesa = ? 
       AND fecha_inicio BETWEEN ? AND ?
       AND estado_reserva IN ('pendiente_pago', 'activa', 'finalizada')`,
      [id_mesa, startDate, endDate]
    );
    return rows;
  },

  async verificarDisponibilidad(id_mesa, fecha_inicio, fecha_fin) {
    const [rows] = await db.query(
      `SELECT id_reserva
       FROM reserva
       WHERE id_mesa = ?
       AND estado_reserva IN ('pendiente_pago', 'activa')
       AND (
         (fecha_inicio <= ? AND fecha_fin >= ?) OR
         (fecha_inicio <= ? AND fecha_fin >= ?) OR
         (fecha_inicio >= ? AND fecha_fin <= ?)
       )`,
      [
        id_mesa,
        fecha_fin,
        fecha_inicio,
        fecha_fin,
        fecha_inicio,
        fecha_inicio,
        fecha_fin,
      ]
    );
    return rows.length === 0; // True si no hay conflictos
  },

  async actualizarEstadoReserva(id_reserva, nuevo_estado) {
    await db.query(
      `UPDATE reserva SET estado_reserva = ? WHERE id_reserva = ?`,
      [nuevo_estado, id_reserva]
    );
    return true;
  },

  async crearPago(data) {
    const [result] = await db.query(
      `INSERT INTO pagos 
        (id_reserva, stripe_payment_id, stripe_charge_id, monto, moneda, metodo, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.id_reserva,
        data.stripe_payment_id || null,
        data.stripe_charge_id || null,
        data.monto,
        data.moneda || "COP",
        data.metodo || "card",
        data.estado || "pendiente",
      ]
    );
    return result.insertId;
  },
};

module.exports = ReservaModel;
