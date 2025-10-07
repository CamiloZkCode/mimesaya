const db = require("../config/db");
const OcasionModel = require("../models/ocasion.models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//Crear Usuario como cliente normal
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

// Buscar por correo
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

//CREACION DE ADMIN, RESTAURANTE Y STRIPE

// Crear usuario administrador
async function crearAdmin({
  id_usuario,
  nombre,
  telefono,
  correo,
  contraseña_hash,
}) {
  // Verificar si ya existe
  const [existe] = await db.query(
    "SELECT id_usuario FROM usuarios WHERE id_usuario = ?",
    [id_usuario]
  );
  if (existe.length > 0) {
    throw new Error("La cédula ya está registrada");
  }

  // Insertar admin
  await db.query(
    `INSERT INTO usuarios (id_usuario, nombre, telefono, correo, contraseña_hash, id_rol)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id_usuario, nombre, telefono, correo, contraseña_hash, 1] // 1 = Admin
  );

  return id_usuario; // Usamos la cédula como PK
}

// Crear restaurante asociado al admin
async function crearRestaurante({
  nit,
  nombre_restaurante,
  direccion,
  telefono,
  logo,
  id_admin,
  stripe_account_id,
   id_tipo,
}) {
  // Verificar NIT duplicado
  const [existe] = await db.query(
    "SELECT id_restaurante FROM restaurantes WHERE nit_restaurante = ?",
    [nit]
  );
  if (existe.length > 0) {
    throw new Error("El NIT ya está registrado");
  }

  const [result] = await db.query(
    `INSERT INTO restaurantes 
     (nit_restaurante, nombre_restaurante, direccion_restaurante, telefono_restaurante, logo_restaurante, id_admin, stripe_account_id, id_tipo)
     VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
    [
      nit,
      nombre_restaurante,
      direccion,
      telefono,
      logo,
      id_admin,
      stripe_account_id,
       id_tipo,
    ]
  );

  const id_restaurante = result.insertId;

  // NUEVA LÓGICA: Crear ocasión default después de insertar el restaurante
  try {
    await OcasionModel.crearOcasionDefault(id_restaurante);
  } catch (error) {
    console.error('Error al crear ocasión default:', error);
    // Opcional: Lanzar error o continuar (aquí continuamos, pero puedes throw si es crítico)
  }

  return id_restaurante; // Ahora retorna el ID del restaurante
}

// Crear cuenta Stripe Express
async function crearCuentaStripeExpress(email) {
  const account = await stripe.accounts.create({
    type: "express",
    country: "CO", // Cambié a CO para Colombia
    email,
    business_type: "individual", // Asumiendo persona natural
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    tos_acceptance: {
      service_agreement: "recipient",
    },
  });

  return account.id;
}

// Exportar funciones del DAO
module.exports = {
  crearUsuario,
  busquedaxCorreoUsuario,
  busquedaxIdUsuario,
  crearAdmin,
  crearRestaurante,
  crearCuentaStripeExpress,
};
