const express = require("express");
const router = express.Router();
const MesaController = require("../controllers/mesa.controller");
const { verificarToken, verificarRoles } = require("../middlewares/auth.middlewares");

// Rutas públicas (para clientes)
router.get("/mesas-disponibles", MesaController.getMesasDisponibles); // Ver mesas disponibles
router.get("/ver-mesas", MesaController.getMesas); // Ver todas las mesas
router.get("/ver-mesa/:id", MesaController.getMesaById); // Ver una mesa por ID

// Rutas protegidas (solo administradores, id_rol = 1)
router.post("/crear-mesa", verificarToken, verificarRoles(1), MesaController.createMesa); // Crear una nueva mesa
router.put("/actualizar-mesa/:id", verificarToken, verificarRoles(1), MesaController.updateMesa); // Actualizar una mesa por ID
router.delete("/eliminar-mesa/:id", verificarToken, verificarRoles(1), MesaController.deleteMesa); // Eliminar una mesa por ID
router.get("/mis-mesas", verificarToken, verificarRoles(1), MesaController.obtenerMisMesas); // Obtener mesas del admin logueado

module.exports = router;
