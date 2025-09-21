const express = require('express');
const router = express.Router();
const { login,registrar } = require('../controllers/auth.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

router.post('/login', login);
router.post('/registrar-cliente', registrar);


module.exports = router;