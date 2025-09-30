const db = require("../config/db");

const RestauranteModel = {
  // Para cargar en el select de filtros
  async obtenerRestaurantes() {
    const [rows] = await db.query(
      `SELECT id_restaurante, nombre_restaurante, logo_restaurante 
       FROM restaurantes`
    );
    return rows;
  },

  // Para cargar el perfil del restaurante logueado o mostrar detalle
  async obtenerRestaurantePorId(id) {
    const [rows] = await db.query(
      `SELECT id_restaurante, nit_restaurante, nombre_restaurante, direccion_restaurante, telefono_restaurante, logo_restaurante, id_admin, stripe_account_id
       FROM restaurantes
       WHERE id_restaurante = ?`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // Para que el admin actualice su restaurante
  async actualizarRestaurante(id, data) {
    await db.query(
      `UPDATE restaurantes SET
        nombre_restaurante=?, direccion_restaurante=?, telefono_restaurante=?, logo_restaurante=?
       WHERE id_restaurante=?`,
      [
        data.nombre_restaurante,
        data.direccion_restaurante,
        data.telefono_restaurante,
        data.logo_restaurante,
        id,
      ]
    );
    return true;
  },
};

module.exports = RestauranteModel;
