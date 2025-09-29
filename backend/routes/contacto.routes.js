const express = require('express');
const router = express.Router();
const { enviarCorreo } = require('../models/contacto.models');

router.post('/enviar', enviarCorreo);

module.exports = router;