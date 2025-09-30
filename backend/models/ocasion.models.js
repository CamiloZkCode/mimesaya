// models/ocasion.models.js
const db = require("../config/db");

const OcasionModel = {
  async crearOcasion(data) {
    const [result] = await db.query(
      `INSERT INTO ocasion 
        (id_restaurante, nombre_ocasion, precio_ocasion, moneda, stripe_product_id, stripe_price_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.id_restaurante,
        data.nombre_ocasion,
        data.precio_ocasion,
        data.moneda || "COP",
        data.stripe_product_id,
        data.stripe_price_id,
      ]
    );
    return result.insertId;
  },

  async obtenerOcasionesPorRestaurante(id_restaurante) {
    const [rows] = await db.query(
      `SELECT id_ocasion, nombre_ocasion, precio_ocasion, moneda, stripe_product_id, stripe_price_id
       FROM ocasion
       WHERE id_restaurante = ?`,
      [id_restaurante]
    );
    return rows;
  },

  async obtenerOcasionPorId(id_ocasion) {
    const [rows] = await db.query(
      `SELECT id_ocasion, id_restaurante, nombre_ocasion, precio_ocasion, moneda, stripe_product_id, stripe_price_id
       FROM ocasion
       WHERE id_ocasion = ?`,
      [id_ocasion]
    );
    return rows.length > 0 ? rows[0] : null;
  },
};

module.exports = OcasionModel;
