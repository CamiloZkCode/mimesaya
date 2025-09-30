const express = require('express');
const router = express.Router();
const MesaController = require('../controllers/mesa.controller');

//Rutas para mesas
router.get('/mesas-disponibles', MesaController.getMesasDisponibles); // Ver mesas disponibles 
router.get('/ver-mesas', MesaController.getMesas); // Ver todas las mesas
router.get('/ver-mesa/:id', MesaController.getMesaById); // Ver una mesa por ID
router.post('/crear-mesa', MesaController.createMesa); // Crear una nueva mesa
router.put('/actualizar-mesa/:id', MesaController.updateMesa); // Actualizar una mesa por ID
router.delete('/eliminar-mesa/:id', MesaController.deleteMesa); // Eliminar una mesa por ID


module.exports = router;