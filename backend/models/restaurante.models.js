const db = require("../config/db");

const RestauranteModel = {
  
    // === Obtener todos los tipos de restaurante ===
  async obtenerTiposRestaurante() {
    const [rows] = await db.query(
      `SELECT id_tipo, nombre_tipo 
       FROM tipo_restaurante
       ORDER BY nombre_tipo ASC`
    );
    return rows;
  },

  // === Cargar todos los restaurantes (para filtros o listado) ===
  async obtenerRestaurantes() {
    const [rows] = await db.query(
      `SELECT r.id_restaurante, r.nombre_restaurante, r.logo_restaurante, t.nombre_tipo
       FROM restaurantes r
       LEFT JOIN tipo_restaurante t ON r.id_tipo = t.id_tipo`
    );
    return rows;
  },

  // === Obtener restaurante por ID (perfil o detalle) ===
  async obtenerRestaurantePorId(id) {
    const [rows] = await db.query(
      `SELECT 
          r.id_restaurante,
          r.nit_restaurante,
          r.nombre_restaurante,
          r.direccion_restaurante,
          r.telefono_restaurante,
          r.logo_restaurante,
          r.id_admin,
          r.stripe_account_id,
          r.id_tipo,
          t.nombre_tipo
       FROM restaurantes r
       LEFT JOIN tipo_restaurante t ON r.id_tipo = t.id_tipo
       WHERE r.id_restaurante = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // === Registrar nuevo restaurante ===
  async crearRestaurante(data) {
    const [result] = await db.query(
      `INSERT INTO restaurantes 
        (nit_restaurante, nombre_restaurante, direccion_restaurante, telefono_restaurante, logo_restaurante, id_admin, stripe_account_id, id_tipo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nit_restaurante,
        data.nombre_restaurante,
        data.direccion_restaurante,
        data.telefono_restaurante,
        data.logo_restaurante,
        data.id_admin,
        data.stripe_account_id,
        data.id_tipo,
      ]
    );
    return result.insertId;
  },

  // === Actualizar restaurante (por el admin) ===
  async actualizarRestaurante(id, data) {
    await db.query(
      `UPDATE restaurantes SET
        nombre_restaurante = ?,
        direccion_restaurante = ?,
        telefono_restaurante = ?,
        logo_restaurante = ?,
        id_tipo = ?
       WHERE id_restaurante = ?`,
      [
        data.nombre_restaurante,
        data.direccion_restaurante,
        data.telefono_restaurante,
        data.logo_restaurante,
        data.id_tipo,
        id,
      ]
    );
    return true;
  },
};

module.exports = RestauranteModel;
