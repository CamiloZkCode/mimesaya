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

  async obtenerOcasionesPorAdmin(id_admin) {
    const [rows] = await db.query(
      `SELECT o.id_ocasion, o.nombre_ocasion, o.precio_ocasion, o.moneda, o.stripe_product_id, o.stripe_price_id
       FROM ocasion o
       INNER JOIN restaurantes r ON o.id_restaurante = r.id_restaurante
       WHERE r.id_admin = ?`,
      [id_admin]
    );
    return rows;
  }
};

module.exports = OcasionModel;