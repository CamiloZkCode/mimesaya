const express = require("express");
const router = express.Router();
const OcasionController = require("../controllers/ocasion.controller");
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

// Crear ocasión (solo restaurantes logueados deberían poder)
router.post("/crear-ocasion", verificarToken,verificarRoles(1), OcasionController.crearOcasion);
// Obtener ocasiones de un restaurante
router.get("/obtener-ocacion/:id_restaurante", OcasionController.obtenerOcasionesPorRestaurante);

router.get("/mis-ocasiones", verificarToken, verificarRoles(1), OcasionController.obtenerOcasionesAdmin);

module.exports = router;
