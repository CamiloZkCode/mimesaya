const express = require('express');
const router = express.Router();
const  AmbientesController = require('../controllers/ambientes.controller');
const { verificarToken, verificarRoles } = require('../middlewares/auth.middlewares');

router.get('/obtenerambientes', AmbientesController.getAmbientes);
router.get('/listarambientes/:id_ambiente', AmbientesController.getAmbienteById);
router.post('/crear-ambientes', verificarToken, verificarRoles('administrador'), AmbientesController.crearAmbientes);
router.post('/actualizar-ambientes/:id_ambiente', verificarToken, verificarRoles('administrador'), AmbientesController.actualizarAmbientes);
// router.delete('/eliminar-ambiente/:id_ambiente', verificarToken, verificarRoles('admin'), AmbientesController.deleteAmbiente);


module.exports = router;