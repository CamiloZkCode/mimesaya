// controllers/mesa.controller.js
const MesaModel = require("../models/mesa.models");
const ReservaModel = require("../models/reservas.models");
const moment = require("moment-timezone");
const { fechaHoy } = require("../utils/fechas");

const MesaController = {
  async getMesasDisponibles(req, res) {
    try {
      const { id_restaurante, id_ambiente, min_capacidad, fecha } = req.query;

      // Validar parámetros
      if (!fecha || !moment(fecha, "YYYY-MM-DD", true).isValid()) {
        return res.status(400).json({ error: "Fecha inválida" });
      }

      const mesas = await MesaModel.obtenerMesasDisponibles({
        id_restaurante,
        id_ambiente,
        min_capacidad,
      });

      const horariosBase = [
        '12:00', '13:00', '14:00', '15:00', '16:00',
        '17:00', '18:00', '19:00', '20:00', '21:00'
      ];

      const mesasDisponibles = [];
      for (const mesa of mesas) {
        // Obtener reservas de la mesa para la fecha
        const reservas = await ReservaModel.obtenerReservasPorMesaYFecha(mesa.id_mesa, fecha);
        const horariosOcupados = new Set();

        // Calcular horarios ocupados
        reservas.forEach(reserva => {
          const inicio = moment.tz(reserva.fecha_inicio, "America/Bogota");
          let fin = moment.tz(reserva.fecha_fin, "America/Bogota");

          // Si la reserva está finalizada y ya pasó, no ocupa horarios
          if (reserva.estado_reserva === 'finalizada' && fin.isBefore(fechaHoy())) {
            return;
          }

          // Marcar horarios ocupados en intervalos de 1 hora
          let current = inicio.clone();
          while (current.isBefore(fin) || current.isSame(fin)) {
            const hora = current.format('HH:00');
            if (horariosBase.includes(hora)) horariosOcupados.add(hora);
            current.add(1, 'hour');
          }
        });

        // Si hay al menos un horario disponible, incluir la mesa
        const horariosDisponibles = horariosBase.filter(hora => !horariosOcupados.has(hora));
        if (horariosDisponibles.length > 0) {
          mesasDisponibles.push(mesa);
        }
      }

      res.json(mesasDisponibles);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getMesas(req, res) {
    try {
      const mesas = await MesaModel.obtenerMesas();
      res.json(mesas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getMesaById(req, res) {
    try {
      const mesa = await MesaModel.obtenerMesaPorId(req.params.id);
      if (!mesa) return res.status(404).json({ message: "Mesa no encontrada" });
      res.json(mesa);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createMesa(req, res) {
    try {
      const id = await MesaModel.crearMesa(req.body);
      res.status(201).json({ id, ...req.body });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateMesa(req, res) {
    try {
      await MesaModel.actualizarMesa(req.params.id, req.body);
      res.json({ id: req.params.id, ...req.body });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async deleteMesa(req, res) {
    try {
      await MesaModel.eliminarMesa(req.params.id);
      res.json({ message: "Mesa eliminada" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = MesaController;