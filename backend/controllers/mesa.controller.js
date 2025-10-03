const MesaModel = require("../models/mesa.models");
const ReservaModel = require("../models/reservas.models");
const moment = require("moment-timezone");
const { fechaHoy } = require("../utils/fechas");
const db = require("../config/db");

const MesaController = {
  async getMesasDisponibles(req, res) {
    try {
      const { id_restaurante, id_ambiente, min_capacidad, fecha } = req.query;

      if (!fecha || !moment(fecha, "YYYY-MM-DD", true).isValid()) {
        return res.status(400).json({ error: "Fecha inválida" });
      }

      const mesas = await MesaModel.obtenerMesasDisponibles({
        id_restaurante,
        id_ambiente,
        min_capacidad,
      });

      const horariosBase = [
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
      ];

      const mesasDisponibles = [];
      for (const mesa of mesas) {
        const reservas = await ReservaModel.obtenerReservasPorMesaYFecha(mesa.id_mesa, fecha);
        const horariosOcupados = new Set();

        reservas.forEach((reserva) => {
          const inicio = moment.tz(reserva.fecha_inicio, "America/Bogota");
          let fin = moment.tz(reserva.fecha_fin, "America/Bogota");

          if (reserva.estado_reserva === "finalizada" && fin.isBefore(fechaHoy())) {
            return;
          }

          let current = inicio.clone();
          while (current.isBefore(fin) || current.isSame(fin)) {
            const hora = current.format("HH:00");
            if (horariosBase.includes(hora)) horariosOcupados.add(hora);
            current.add(1, "hour");
          }
        });

        const horariosDisponibles = horariosBase.filter((hora) => !horariosOcupados.has(hora));
        if (horariosDisponibles.length > 0) {
          mesasDisponibles.push({ ...mesa, horariosDisponibles });
        }
      }

      res.json(mesasDisponibles);
    } catch (err) {
      console.error("Error al obtener mesas disponibles:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getMesas(req, res) {
    try {
      const mesas = await MesaModel.obtenerMesas();
      res.json(mesas);
    } catch (err) {
      console.error("Error al obtener mesas:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getMesaById(req, res) {
    try {
      const mesa = await MesaModel.obtenerMesaPorId(req.params.id);
      if (!mesa) return res.status(404).json({ error: "Mesa no encontrada" });
      res.json(mesa);
    } catch (err) {
      console.error("Error al obtener mesa por ID:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async createMesa(req, res) {
    try {
      const id_admin = req.user.id_usuario;
      const { nombre_mesa, id_ambiente, capacidad, ubicacion, foto_url } = req.body;

      // Buscar el restaurante del admin
      const [restaurante] = await db.query(
        "SELECT id_restaurante FROM restaurantes WHERE id_admin = ?",
        [id_admin]
      );
      if (!restaurante || restaurante.length === 0) {
        return res.status(404).json({ error: "Restaurante no encontrado" });
      }

      const id_restaurante = restaurante[0].id_restaurante;
      console.log("ID Restaurante:", id_restaurante);

      if (!nombre_mesa || !id_ambiente || !capacidad) {
        return res.status(400).json({ error: "Faltan campos obligatorios: nombre_mesa, id_ambiente, capacidad" });
      }

      const id = await MesaModel.crearMesa({
        nombre_mesa,
        id_ambiente,
        id_restaurante,
        capacidad,
        ubicacion,
        foto_url,
      });
      res.status(201).json({ id, message: "Mesa creada con éxito" });
    } catch (err) {
      console.error("Error al crear mesa:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async updateMesa(req, res) {
    try {
      const { id } = req.params;
      const id_admin = req.user.id_usuario;
      const { nombre_mesa, id_ambiente, capacidad, ubicacion, foto_url } = req.body;

      // Buscar el restaurante del admin
      const [restaurante] = await db.query(
        "SELECT id_restaurante FROM restaurantes WHERE id_admin = ?",
        [id_admin]
      );
      console.log("Restaurante encontrado:", restaurante);
      if (!restaurante || restaurante.length === 0) {
        return res.status(404).json({ error: "Restaurante no encontrado" });
      }

      const id_restaurante = restaurante[0].id_restaurante;

      if (!nombre_mesa || !id_ambiente || !capacidad) {
        return res.status(400).json({ error: "Faltan campos obligatorios: nombre_mesa, id_ambiente, capacidad" });
      }

      const mesaExists = await MesaModel.obtenerMesaPorId(id);
      if (!mesaExists) {
        return res.status(404).json({ error: "Mesa no encontrada" });
      }

      await MesaModel.actualizarMesa(id, {
        nombre_mesa,
        id_ambiente,
        id_restaurante,
        capacidad,
        ubicacion,
        foto_url,
      });
      res.json({ message: "Mesa actualizada con éxito" });
    } catch (err) {
      console.error("Error al actualizar mesa:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async deleteMesa(req, res) {
    try {
      const { id } = req.params;

      const mesaExists = await MesaModel.obtenerMesaPorId(id);
      if (!mesaExists) {
        return res.status(404).json({ error: "Mesa no encontrada" });
      }

      const reservas = await ReservaModel.obtenerReservasPorMesaYFecha(id, fechaHoy());
      if (reservas.length > 0) {
        return res.status(400).json({ error: "No se puede eliminar la mesa porque tiene reservas asociadas" });
      }

      await MesaModel.eliminarMesa(id);
      res.json({ message: "Mesa eliminada con éxito" });
    } catch (err) {
      console.error("Error al eliminar mesa:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async obtenerMisMesas(req, res) {
    try {
      const id_admin = req.user.id_usuario;

      const [restaurante] = await db.query(
        "SELECT id_restaurante FROM restaurantes WHERE id_admin = ?",
        [id_admin]
      );
      if (!restaurante || restaurante.length === 0) {
        return res.status(404).json({ error: "Restaurante no encontrado" });
      }

      const id_restaurante = restaurante[0].id_restaurante;

      const mesas = await MesaModel.obtenerMesasDisponibles({ id_restaurante });

      res.json(mesas);
    } catch (err) {
      console.error("Error en obtenerMisMesas:", err);
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = MesaController;
