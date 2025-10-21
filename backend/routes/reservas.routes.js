const express = require("express");
const router = express.Router();
const ReservaController = require("../controllers/reservas.controller");
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

router.post("/crear-reserva", verificarToken, verificarRoles(2), ReservaController.crearReserva);
router.get("/ver-reservas", ReservaController.obtenerHorariosDisponibles); // Asumiendo que existe
router.get("/confirmar-reserva", ReservaController.confirmarReserva);
router.get("/factura/:id", verificarToken, ReservaController.getFactura);
router.get("/mis-reservas", verificarToken, ReservaController.obtenerReservasCliente); //Endpoint para ver las reservas de los clientes en el perfil
router.put("/cancelar/:id", verificarToken, ReservaController.cancelarReserva); //cancelar reserva 

// ==== ADMINISTRADOR ====
router.get("/reservas-restaurante",verificarToken,verificarRoles(1),ReservaController.obtenerReservasRestauranteAdmin);
router.put("/admin/reservas/:id/cancelar",verificarToken,verificarRoles(1),ReservaController.cancelarReservaPorAdmin);
router.put("/admin/reservas/:id/finalizar",verificarToken,verificarRoles(1),ReservaController.finalizarReservaPorAdmin);
module.exports = router;