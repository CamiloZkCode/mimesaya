// controllers/ambientesController.js
const AmbienteModel = require("../models/ambientes.models");

const AmbientesController = {
  async getAmbientes(req, res) {
    try {
      const ambientes = await AmbienteModel.obtenerAmbientes();
      res.json(ambientes);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener ambientes" });
    }
  },

  async getAmbienteById(req, res) {
    try {
      const ambiente = await AmbienteModel.obtenerAmbientexId(req.params.id);
      if (!ambiente) return res.status(404).json({ error: "No encontrado" });
      res.json(ambiente);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el ambiente" });
    }
  },

  async crearAmbientes(req, res) {
    try {
      const id = await AmbienteModel.CrearAmbiente(req.body);
      res.status(201).json({ message: "Ambiente creado", id });
    } catch (error) {
      res.status(500).json({ error: "Error al crear ambiente" });
    }
  },

  async actualizarAmbientes(req, res) {
    try {
      await AmbienteModel.ActualizarAmbientes(req.params.id, req.body);
      res.json({ message: "Ambiente actualizado" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar ambiente" });
    }
  },
};

module.exports = AmbientesController;
