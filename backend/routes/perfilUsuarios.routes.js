const express = require("express");
const router = express.Router();
const PerfilController = require("../controllers/perfilUsuarios.controller");
const { verificarToken, verificarRoles } = require("../middlewares/auth.middlewares");

// Solo un usuario con rol ADMIN puede acceder
router.get("/", verificarToken, verificarRoles(1), PerfilController.obtenerPerfil);
router.get("/cliente", verificarToken, verificarRoles(2), PerfilController.obtenerPerfilCliente);


module.exports = router;
