const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const {
  busquedaxCorreoUsuario,
  crearUsuario,
  busquedaxIdUsuario,
  crearAdmin,
  crearRestaurante,
} = require("../models/user.models");

async function login(req, res) {
  try {
    const { correo, contraseña } = req.body;

    const usuario = await busquedaxCorreoUsuario(correo);
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const esValido = await bcrypt.compare(contraseña, usuario.contraseña_hash);
    if (!esValido) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        id_rol: usuario.id_rol,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      user: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

async function registrar(req, res) {
  try {
    const { id_usuario, nombre, telefono, correo, contraseña } = req.body;

    const usuarioExistente = await busquedaxIdUsuario(id_usuario);
    if (usuarioExistente) {
      return res.status(400).json({ message: "La cédula ya está registrada" });
    }

    const existeCorreo = await busquedaxCorreoUsuario(correo);
    if (existeCorreo) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const id_rol = 2; // Cliente por defecto
    const contraseña_hash = await bcrypt.hash(contraseña, 10);

    await crearUsuario({
      id_usuario,
      nombre,
      telefono,
      correo,
      contraseña_hash,
      id_rol,
    });

    res.status(201).json({ mensaje: "Usuario registrado con éxito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
}

async function registrarAdministrador(req, res) {
  try {
    const { usuario, restaurante } = req.body;

    // 1️⃣ Crear hash de contraseña
    const contraseña_hash = await bcrypt.hash(usuario.password, 10);

    // 2️⃣ Crear admin en BD
    const id_admin = await crearAdmin({
      id_usuario: usuario.cedula,
      nombre: usuario.nombre,
      telefono: usuario.telefono,
      correo: usuario.correo,
      contraseña_hash,
    });

    // 3️⃣ Crear cuenta Stripe Express
    const account = await stripe.accounts.create({
      type: "express",
      country: "CO",
      email: usuario.correo,
      business_type: "individual", // si cada admin es persona natural
      capabilities: {
        transfers: { requested: true },
      },
      tos_acceptance: {
        service_agreement: "recipient",
      },
    });

    // 4️⃣ Guardar restaurante con id_admin y stripe_account_id
    await crearRestaurante({
      nit: restaurante.nit,
      nombre_restaurante: restaurante.nombre,
      direccion: restaurante.direccion,
      telefono: restaurante.telefono,
      logo: restaurante.logo,
      id_tipo: restaurante.id_tipo,
      id_admin,
      stripe_account_id: account.id,
    });

    // 5️⃣ Generar URL de onboarding de Stripe
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "http://localhost:5173/stripe/refresh",
      return_url: "http://localhost:5173/stripe/success",
      type: "account_onboarding",
    });

    res.status(201).json({
      mensaje: "Administrador y restaurante creados correctamente",
      stripeOnboardingUrl: accountLink.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


const obtenerUsuario = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const usuario = await busquedaxIdUsuario(id_usuario);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({
      user: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        telefono: usuario.telefono,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener datos del usuario' });
  }
};

module.exports = { login, registrar, registrarAdministrador, obtenerUsuario };
