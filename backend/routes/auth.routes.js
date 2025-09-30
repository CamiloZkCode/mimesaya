const express = require('express');
const router = express.Router();
const { login,registrar, registrarAdministrador} = require('../controllers/auth.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

// Ruta para login
router.post('/login', login);

// Ruta para registrar usuario normal
router.post('/registrar-cliente', registrar);

// Ruta para registrar administrador 
router.post('/registrar-administrador', registrarAdministrador);


module.exports = router;