const express = require("express");
const router = express.Router();
const ReservaController = require("../controllers/reservas.controller");
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

router.post("/crear-reserva", verificarToken, verificarRoles(2), ReservaController.crearReserva);
router.get("/ver-reservas", ReservaController.obtenerHorariosDisponibles); // Asumiendo que existe
router.get("/confirmar-reserva", ReservaController.confirmarReserva);
router.get("/factura/:id", verificarToken, ReservaController.getFactura);

module.exports = router;