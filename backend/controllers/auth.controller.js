const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { busquedaxCorreoUsuario, crearUsuario, busquedaxIdUsuario} = require('../models/user.models');

async function login(req, res) {
  try {
    const { correo, contraseña } = req.body;

    const usuario = await busquedaxCorreoUsuario(correo);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const esValido = await bcrypt.compare(contraseña, usuario.contraseña_hash);
    if (!esValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, correo: usuario.correo, id_rol: usuario.id_rol, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      user: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

async function registrar(req, res) {
  try {
    const { id_usuario, nombre, telefono, correo, contraseña } = req.body;

    // Verificar si la cédula ya existe
    const usuarioExistente = await busquedaxIdUsuario(id_usuario);
    if (usuarioExistente) {
      return res.status(400).json({ message: 'La cédula ya está registrada' });
    }

    // Verificar si el correo ya existe
    const existeCorreo = await busquedaxCorreoUsuario(correo);
    if (existeCorreo) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const id_rol = 2; // Cliente por defecto
    const contraseña_hash = await bcrypt.hash(contraseña, 10);

    await crearUsuario({ id_usuario, nombre, telefono, correo, contraseña_hash, id_rol });

    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}


module.exports = { login, registrar };
