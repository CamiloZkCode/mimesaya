const express = require("express");
const router = express.Router();
const ReservaController = require("../controllers/reservas.controller");
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');


// Rutas para reservas
router.post("/crear-reserva",  verificarToken, verificarRoles, ReservaController.crearReserva);
router.get("/ver-reservas", ReservaController.obtenerHorariosDisponibles);

module.exports = router;