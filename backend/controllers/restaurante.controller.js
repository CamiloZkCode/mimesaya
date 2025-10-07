// controllers/restauranteController.js
const RestauranteModel = require("../models/restaurante.models");

const restauranteController = {

   async obtenerTiposRestaurante(req, res) {
    try {
      const tipos = await RestauranteModel.obtenerTiposRestaurante();
      res.json(tipos);
    } catch (error) {
      console.error("Error al obtener tipos de restaurante:", error);
      res.status(500).json({ error: "Error al obtener los tipos de restaurante" });
    }
  },
  
  // Obtener todos los restaurantes (para cargar el select)
  async obtenerRestaurantes(req, res) {
    try {
      const restaurantes = await RestauranteModel.obtenerRestaurantes();
      res.json(restaurantes);
    } catch (error) {
      console.error("Error al obtener restaurantes:", error);
      res.status(500).json({ error: "Error al obtener los restaurantes" });
    }
  },

  // Obtener un restaurante por ID (ej: perfil del restaurante logueado)
  async obtenerRestaurantePorId(req, res) {
    try {
      const { id } = req.params;
      const restaurante = await RestauranteModel.obtenerRestaurantePorId(id);

      if (!restaurante) {
        return res.status(404).json({ error: "Restaurante no encontrado" });
      }

      res.json(restaurante);
    } catch (error) {
      console.error("Error al obtener restaurante por ID:", error);
      res.status(500).json({ error: "Error al obtener el restaurante" });
    }
  },

  // Actualizar información del restaurante
  async actualizarRestaurante(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      const actualizado = await RestauranteModel.actualizarRestaurante(id, data);

      if (!actualizado) {
        return res.status(404).json({ error: "Restaurante no encontrado" });
      }

      res.json({ message: "Restaurante actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar restaurante:", error);
      res.status(500).json({ error: "Error al actualizar el restaurante" });
    }
  },
};

module.exports = restauranteController;
