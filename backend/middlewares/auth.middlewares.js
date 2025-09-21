// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verificarToken(req, res, next) {
  try {
    const authHeader = req.header('Authorization') || req.header('authorization');

    if (!authHeader) {
      return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    const receivedToken = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    const decoded = jwt.verify(receivedToken, process.env.JWT_SECRET);
    req.user = decoded; // contiene id_usuario, correo, id_rol
    next();
  } catch (error) {
    console.error('Error en verificación de token:', error.message);
    return res.status(401).json({
      message: 'Token inválido o expirado',
      error: error.message
    });
  }
}

function verificarRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user?.id_rol) {
      return res.status(403).json({ message: 'Información de rol no disponible' });
    }

    if (!rolesPermitidos.includes(req.user.id_rol)) {
      return res.status(403).json({ message: 'No tienes permisos para esta acción' });
    }
    next();
  };
}

module.exports = { verificarToken, verificarRoles };
