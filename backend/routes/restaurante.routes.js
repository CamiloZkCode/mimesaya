const express = require("express");
const router = express.Router();
const restauranteController = require("../controllers/restaurante.controller");

// Obtener todos los restaurantes (para cargar en un select)
router.get("/ver-restaurantes", restauranteController.obtenerRestaurantes);

// Obtener un restaurante por ID (perfil del restaurante logueado)
router.get("ver-restaurantes/:id", restauranteController.obtenerRestaurantePorId);

// Actualizar restaurante por ID
router.put("actulizar-restaurante/:id", restauranteController.actualizarRestaurante);

module.exports = router;