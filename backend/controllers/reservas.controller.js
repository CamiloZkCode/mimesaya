const moment = require("moment-timezone");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ReservaModel = require("../models/reservas.models");
const OcasionModel = require("../models/ocasion.models");
const RestauranteModel = require("../models/restaurante.models");
const { fechaHoraActual } = require("../utils/fechas");

const ReservaController = {
  async crearReserva(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Debes iniciar sesión para reservar." });
      }

      const { id_restaurante, id_mesa, id_ocasion, fecha_inicio, notas } = req.body;
      const id_usuario = req.user.id_usuario;

      // 1. Validar fecha_inicio
      if (!moment(fecha_inicio, "YYYY-MM-DD HH:mm:ss", true).isValid()) {
        return res.status(400).json({ message: "Fecha de inicio inválida" });
      }

      // 2. Calcular fecha_fin (4 horas después)
      const inicio = moment.tz(fecha_inicio, "America/Bogota");
      const fecha_fin = inicio.clone().add(4, "hours").format("YYYY-MM-DD HH:mm:ss");

      // 3. Validar disponibilidad
      const isAvailable = await ReservaModel.verificarDisponibilidad(id_mesa, fecha_inicio, fecha_fin);
      if (!isAvailable) {
        return res.status(400).json({ message: "La mesa no está disponible en el horario seleccionado." });
      }

      // 4. Validar ocasión
      const ocasion = await OcasionModel.obtenerOcasionPorId(id_ocasion);
      if (!ocasion || ocasion.id_restaurante !== parseInt(id_restaurante)) {
        return res.status(400).json({ message: "Ocasión inválida para este restaurante." });
      }

      // 5. Validar restaurante (Stripe)
      const restaurante = await RestauranteModel.obtenerRestaurantePorId(id_restaurante);
      if (!restaurante || !restaurante.stripe_account_id) {
        return res.status(400).json({ message: "El restaurante no tiene Stripe configurado." });
      }

      // 6. Crear reserva en estado pendiente_pago
      const reservaId = await ReservaModel.crearReserva({
        id_usuario,
        id_restaurante,
        id_mesa,
        id_ocasion,
        fecha_inicio,
        fecha_fin,
        notas,
        estado_reserva: "pendiente_pago",
      });

      // 7. Crear Checkout Session en Stripe
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price: ocasion.stripe_price_id,
            quantity: 1,
          },
        ],
        customer_email: req.user.email,
        success_url: `${process.env.FRONTEND_URL}/reserva/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/reserva/cancel`,
        payment_intent_data: {
          application_fee_amount: Math.round(ocasion.precio_ocasion * 0.05 * 100), // 5% comisión
          transfer_data: {
            destination: restaurante.stripe_account_id,
          },
        },
        metadata: {
          reserva_id: reservaId,
          restaurante_id: id_restaurante,
          usuario_id: id_usuario,
        },
      });

      res.status(201).json({ id: reservaId, checkoutUrl: session.url });
    } catch (err) {
      console.error("Error al crear reserva:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async obtenerHorariosDisponibles(req, res) {
    try {
      const { id_mesa, fecha } = req.query;

      // Validar fecha
      if (!moment(fecha, "YYYY-MM-DD", true).isValid()) {
        return res.status(400).json({ message: "Fecha inválida" });
      }

      const reservas = await ReservaModel.obtenerReservasPorMesaYFecha(id_mesa, fecha);
      const horariosBase = [
        "12:00", "13:00", "14:00", "15:00", "16:00",
        "17:00", "18:00", "19:00", "20:00", "21:00"
      ];

      const horariosOcupados = new Set();
      reservas.forEach((reserva) => {
        const inicio = moment.tz(reserva.fecha_inicio, "America/Bogota");
        let fin = moment.tz(reserva.fecha_fin, "America/Bogota");

        // Si está finalizada y ya pasó, no ocupa horarios
        if (reserva.estado_reserva === "finalizada" && fin.isBefore(fechaHoraActual())) {
          return;
        }

        // Marcar intervalos de 1 hora como ocupados
        let current = inicio.clone();
        while (current.isBefore(fin) || current.isSame(fin)) {
          const hora = current.format("HH:00");
          if (horariosBase.includes(hora)) horariosOcupados.add(hora);
          current.add(1, "hour");
        }
      });

      const horariosDisponibles = horariosBase.filter((hora) => !horariosOcupados.has(hora));
      res.json(horariosDisponibles);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = ReservaController;
