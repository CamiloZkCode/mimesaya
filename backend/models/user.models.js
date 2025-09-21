const db = require("../config/db");

async function crearUsuario({
  id_usuario,
  nombre,
  telefono,
  correo,
  contraseña_hash,
  id_rol,
}) {
  const [result] = await db.query(
    `INSERT INTO usuarios (id_usuario, nombre, telefono, correo, contraseña_hash, id_rol)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id_usuario, nombre, telefono, correo, contraseña_hash, id_rol]
  );
  return result.insertId;
}

async function busquedaxCorreoUsuario(correo) {
  const [rows] = await db.query(
    `SELECT u.id_usuario, u.nombre, u.telefono, u.correo, u.contraseña_hash, u.id_rol, r.rol
     FROM usuarios u
     JOIN roles r ON u.id_rol = r.id_rol
     WHERE u.correo = ?`,
    [correo]
  );
  return rows[0]; // devuelve el usuario con el rol
}

// Buscar por ID (cedula)
async function busquedaxIdUsuario(id_usuario) {
  const [rows] = await db.query(
    `SELECT u.id_usuario, u.nombre, u.telefono, u.correo, u.contraseña_hash, u.id_rol, r.rol
     FROM usuarios u
     JOIN roles r ON u.id_rol = r.id_rol
     WHERE u.id_usuario = ?`,
    [id_usuario]
  );
  return rows[0]; // devuelve un único usuario o undefined si no existe
}


// Exportar funciones del DAO
module.exports = {
  crearUsuario,
  busquedaxCorreoUsuario,
  busquedaxIdUsuario,
};
