const db = require("../config/db");

const PerfilModel = {
  // Obtener perfil completo del administrador (datos personales + restaurante)
  async obtenerPerfilAdministrador(id_admin) {
    const [rows] = await db.query(
      `SELECT 
          u.id_usuario,
          u.nombre AS nombre_admin,
          u.telefono AS telefono_admin,
          u.correo AS correo_admin,
          r.id_restaurante,
          r.nit_restaurante,
          r.nombre_restaurante,
          r.direccion_restaurante,
          r.telefono_restaurante,
          r.logo_restaurante,
          r.stripe_account_id
      FROM usuarios u
      INNER JOIN restaurantes r ON u.id_usuario = r.id_admin
      WHERE u.id_usuario = ?`,
      [id_admin]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  async obtenerPerfilCliente(id_usuario) {
    const [rows] = await db.query(
      `SELECT 
    id_usuario,
    nombre,
    telefono,
    correo
    FROM usuarios
    WHERE id_usuario = ? AND id_rol = 2`,
      [id_usuario]
    );
    return rows.length > 0 ? rows[0] : null;
  },
};

module.exports = PerfilModel;
