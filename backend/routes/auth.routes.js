const express = require('express');
const router = express.Router();
const { login,registrar, registrarAdministrador} = require('../controllers/auth.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

router.post('/login', login);
router.post('/registrar-cliente', registrar);
router.post('/registrar-administrador', registrarAdministrador);


module.exports = router;