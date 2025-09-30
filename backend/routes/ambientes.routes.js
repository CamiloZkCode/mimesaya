const express = require('express');
const router = express.Router();
const  AmbientesController = require('../controllers/ambientes.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

//Rutas para ambientes
router.get('/obtenerambientes', AmbientesController.getAmbientes);

// Ver un ambiente por ID
router.get('/listarambientes/:id_ambiente', AmbientesController.getAmbienteById);

// Crear un nuevo ambiente
router.post('/crear-ambientes', verificarToken, verificarRoles('administrador'), AmbientesController.crearAmbientes);

// Actualizar un ambiente por ID
router.post('/actualizar-ambientes/:id_ambiente', verificarToken, verificarRoles('administrador'), AmbientesController.actualizarAmbientes);
// router.delete('/eliminar-ambiente/:id_ambiente', verificarToken, verificarRoles('admin'), AmbientesController.deleteAmbiente);


module.exports = router;