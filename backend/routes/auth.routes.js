const express = require('express');
const router = express.Router();
const { login,registrar, registrarAdministrador, obtenerUsuario} = require('../controllers/auth.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

// Ruta para login
router.post('/login', login);

// Ruta para registrar usuario normal
router.post('/registrar-cliente', registrar);

// Ruta para registrar administrador 
router.post('/registrar-administrador', registrarAdministrador);

router.get('/me', verificarToken, obtenerUsuario);



module.exports = router;