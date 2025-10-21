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

  async actualizarReservasFinalizadas() {
    const now = moment().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");
    await db.query(
      `UPDATE reserva 
     SET estado_reserva = 'finalizada' 
     WHERE fecha_fin <= ? AND estado_reserva = 'activa'`,
      [now]
    );
  },

  // === Obtener reservas de un cliente ===
  async obtenerReservasPorCliente(id_usuario) {
    const query = `
    SELECT 
      r.id_reserva,
      res.nombre_restaurante,
      m.nombre_mesa,
      o.nombre_ocasion,
      r.fecha_inicio,
      r.fecha_fin,
      r.estado_reserva
    FROM reserva r
    LEFT JOIN restaurantes res ON r.id_restaurante = res.id_restaurante
    LEFT JOIN mesa m ON r.id_mesa = m.id_mesa
    LEFT JOIN ocasion o ON r.id_ocasion = o.id_ocasion
    WHERE r.id_usuario = ?
    ORDER BY 
      CASE 
        WHEN r.estado_reserva = 'activa' THEN 1
        ELSE 2
      END,
      r.id_reserva DESC
  `;

    const [rows] = await db.query(query, [id_usuario]);
    return rows;
  },

  // === Obtener reservas del restaurante del administrador ===
  async obtenerReservasPorRestauranteAdmin(id_usuario_admin) {
  const query = `
    SELECT 
      r.id_reserva,
      u.nombre AS nombre_cliente,
      u.correo AS correo_cliente,
      m.nombre_mesa,
      o.nombre_ocasion,
      r.fecha_inicio,
      r.fecha_fin,
      r.estado_reserva
    FROM reserva r
    INNER JOIN restaurantes res ON r.id_restaurante = res.id_restaurante
    INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
    LEFT JOIN mesa m ON r.id_mesa = m.id_mesa
    LEFT JOIN ocasion o ON r.id_ocasion = o.id_ocasion
    WHERE res.id_admin = ?
    ORDER BY 
      CASE 
        WHEN r.estado_reserva = 'activa' THEN 0
        WHEN r.estado_reserva = 'pendiente_pago' THEN 1
        WHEN r.estado_reserva = 'finalizada' THEN 2
        ELSE 3
      END,
      r.id_reserva DESC
  `;
  const [rows] = await db.query(query, [id_usuario_admin]);
  return rows;
},

  // === Cancelar reserva (por administrador del restaurante) ===
  async cancelarReservaPorAdmin(id_reserva, id_usuario_admin) {
    const [rows] = await db.query(
      `SELECT r.id_reserva, r.estado_reserva
     FROM reserva r
     INNER JOIN restaurantes res ON r.id_restaurante = res.id_restaurante
     WHERE r.id_reserva = ? AND res.id_admin = ?`,
      [id_reserva, id_usuario_admin]
    );

    if (rows.length === 0) return null; // no pertenece al restaurante del admin
    await db.query(
      `UPDATE reserva SET estado_reserva = 'cancelada' WHERE id_reserva = ?`,
      [id_reserva]
    );
    return true;
  },

  // === Finalizar reserva (por administrador del restaurante) ===
  async finalizarReservaPorAdmin(id_reserva, id_usuario_admin) {
    const [rows] = await db.query(
      `SELECT r.id_reserva, r.estado_reserva
     FROM reserva r
     INNER JOIN restaurantes res ON r.id_restaurante = res.id_restaurante
     WHERE r.id_reserva = ? AND res.id_admin = ?`,
      [id_reserva, id_usuario_admin]
    );

    if (rows.length === 0) return null; // no pertenece al restaurante del admin
    await db.query(
      `UPDATE reserva SET estado_reserva = 'finalizada' WHERE id_reserva = ?`,
      [id_reserva]
    );
    return true;
  },
};

module.exports = ReservaModel;
