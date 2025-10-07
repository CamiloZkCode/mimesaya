const moment = require("moment-timezone");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ReservaModel = require("../models/reservas.models");
const OcasionModel = require("../models/ocasion.models");
const MesaModel = require("../models/mesa.models");
const RestauranteModel = require("../models/restaurante.models");
const { busquedaxIdUsuario } = require("../models/user.models");
const { fechaHoraActual } = require("../utils/fechas");
const db = require("../config/db");

const ReservaController = {
  async crearReserva(req, res) {
    try {
      // ===== VALIDACIÓN DE USUARIO =====
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Debes iniciar sesión para realizar una reserva." });
      }

      const { id_restaurante, id_mesa, id_ocasion, fecha_inicio, notas } =
        req.body;
      const id_usuario = req.user.id_usuario;

      const usuario = await busquedaxIdUsuario(id_usuario);
      if (!usuario)
        return res.status(404).json({ message: "Usuario no encontrado." });

      if (!moment(fecha_inicio, "YYYY-MM-DD HH:mm:ss", true).isValid()) {
        return res.status(400).json({ message: "Fecha de inicio inválida." });
      }

      // ===== VALIDAR MESA =====
      const mesa = await MesaModel.obtenerMesaPorId(id_mesa);
      if (!mesa)
        return res.status(404).json({ message: "Mesa no encontrada." });

      // ===== OBTENER OCASIÓN =====
      let ocasion;
      if (id_ocasion) {
        ocasion = await OcasionModel.obtenerOcasionPorId(id_ocasion);
        if (!ocasion || ocasion.id_restaurante !== parseInt(id_restaurante)) {
          return res
            .status(400)
            .json({ message: "Ocasión inválida para este restaurante." });
        }
      } else {
        // Si no se especifica, usar “Reserva General”
        const ocasiones =
          await OcasionModel.obtenerOcasionesPorRestaurante(id_restaurante);
        ocasion = ocasiones.find(
          (o) => o.nombre_ocasion === "Reserva General"
        ) || {
          id_ocasion: null,
          nombre_ocasion: "Reserva General",
          precio_ocasion: 700, // Precio base default para restaurante
          duracion_min_horas: 2,
        };
      }

      // ===== CALCULAR DURACIÓN =====
      const minHoras = ocasion.duracion_min_horas || 2;
      const extraMin = 20 * mesa.capacidad;
      const totalMin = minHoras * 60 + extraMin;
      const totalHoras = Math.ceil(totalMin / 60);

      const inicio = moment.tz(fecha_inicio, "America/Bogota");
      const fecha_fin = inicio
        .clone()
        .add(totalHoras, "hours")
        .format("YYYY-MM-DD HH:mm:ss");

      // ===== VALIDAR DISPONIBILIDAD =====
      const disponible = await ReservaModel.verificarDisponibilidad(
        id_mesa,
        fecha_inicio,
        fecha_fin
      );
      if (!disponible) {
        return res.status(400).json({
          message: "La mesa no está disponible en el horario seleccionado.",
        });
      }

      // ===== CALCULAR PRECIOS =====
      const precioOcasion = parseInt(Number(ocasion.precio_ocasion) || 0);
      const comisionMiMesaYa = 1500; // siempre 1500 COP
      const precioFinal = precioOcasion + comisionMiMesaYa; // total cliente
      const totalStripeAmount = precioFinal * 100; // en centavos
      const transferAmount = precioOcasion * 100; // lo que recibe el restaurante

      const restaurante =
        await RestauranteModel.obtenerRestaurantePorId(id_restaurante);
      if (!restaurante || !restaurante.stripe_account_id) {
        return res.status(400).json({
          message:
            "El restaurante no tiene configurada una cuenta de Stripe conectada.",
        });
      }

      // ===== CREAR RESERVA EN BASE DE DATOS =====
      const reservaId = await ReservaModel.crearReserva({
        id_usuario,
        id_restaurante,
        id_mesa,
        id_ocasion: ocasion.id_ocasion || null,
        fecha_inicio,
        fecha_fin,
        notas: `Cliente: ${usuario.nombre} | Tel: ${usuario.telefono} | Correo: ${usuario.correo} | Notas: ${
          notas || "N/A"
        }`,
        estado_reserva: "pendiente_pago",
      });

      // ===== CREAR SESIÓN DE PAGO STRIPE =====
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "cop",
              product_data: {
                name: `${ocasion.nombre_ocasion} en ${restaurante.nombre_restaurante}`,
              },
              unit_amount: totalStripeAmount,
            },
            quantity: 1,
          },
        ],
        customer_email: usuario.correo,
        success_url: `${process.env.FRONTEND_URL}/reserva/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/reserva/cancel`,
        payment_intent_data: {
          application_fee_amount: comisionMiMesaYa * 100,
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

      res.status(201).json({
        id: reservaId,
        checkoutUrl: session.url,
        precio: precioFinal,
        comisionMiMesaYa,
        precioOcasion,
      });
    } catch (err) {
      console.error("Error al crear reserva:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // ===== HORARIOS DISPONIBLES =====
  async obtenerHorariosDisponibles(req, res) {
    try {
      const { id_mesa, fecha, id_ocasion } = req.query;
      if (!moment(fecha, "YYYY-MM-DD", true).isValid())
        return res.status(400).json({ message: "Fecha inválida." });

      const mesa = await MesaModel.obtenerMesaPorId(id_mesa);
      if (!mesa)
        return res.status(404).json({ message: "Mesa no encontrada." });

      let ocasion;
      if (id_ocasion) {
        ocasion = await OcasionModel.obtenerOcasionPorId(id_ocasion);
        if (!ocasion || ocasion.id_restaurante !== mesa.id_restaurante)
          return res
            .status(400)
            .json({ message: "Ocasión inválida para este restaurante." });
      } else {
        const ocasiones = await OcasionModel.obtenerOcasionesPorRestaurante(
          mesa.id_restaurante
        );
        ocasion = ocasiones.find(
          (o) => o.nombre_ocasion === "Reserva General"
        ) || {
          id_ocasion: null,
          nombre_ocasion: "Reserva General",
          precio_ocasion: 700,
          duracion_min_horas: 2,
        };
      }

      const minHoras = ocasion.duracion_min_horas || 2;
      const extraMin = 20 * mesa.capacidad;
      const totalMin = minHoras * 60 + extraMin;
      const duracionHoras = Math.ceil(totalMin / 60);

      const reservas = await ReservaModel.obtenerReservasPorMesaYFecha(
        id_mesa,
        fecha
      );
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

      const horariosOcupados = new Set();
      reservas.forEach((reserva) => {
        const inicio = moment.tz(reserva.fecha_inicio, "America/Bogota");
        const fin = moment.tz(reserva.fecha_fin, "America/Bogota");
        if (
          reserva.estado_reserva === "finalizada" &&
          fin.isBefore(fechaHoraActual())
        )
          return;

        let current = inicio.clone();
        while (current.isBefore(fin) || current.isSame(fin)) {
          const hora = current.format("HH:00");
          if (horariosBase.includes(hora)) horariosOcupados.add(hora);
          current.add(duracionHoras, "hours");
        }
      });

      const horariosDisponibles = horariosBase.filter(
        (hora) => !horariosOcupados.has(hora)
      );
      res.json(horariosDisponibles);
    } catch (err) {
      console.error("Error al obtener horarios:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // ===== CONFIRMAR RESERVA =====
  async confirmarReserva(req, res) {
    try {
      const { session_id } = req.query;
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status === "paid") {
        const reservaId = session.metadata.reserva_id;
        await ReservaModel.actualizarEstadoReserva(reservaId, "activa");
        await ReservaModel.crearPago({
          id_reserva: reservaId,
          stripe_payment_id: session.payment_intent,
          stripe_charge_id: session.payment_intent,
          monto: session.amount_total / 100,
          moneda: session.currency.toUpperCase(),
          metodo: "card",
          estado: "pagado",
        });
        res.json({ message: "Reserva confirmada exitosamente.", reservaId });
      } else {
        res.status(400).json({ message: "Pago no completado." });
      }
    } catch (err) {
      console.error("Error al confirmar reserva:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // ===== WEBHOOK STRIPE =====
  async stripeWebhook(req, res) {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Error al verificar webhook:", err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.payment_status === "paid") {
        const reservaId = session.metadata.reserva_id;
        await ReservaModel.actualizarEstadoReserva(reservaId, "activa");
        await ReservaModel.crearPago({
          id_reserva: reservaId,
          stripe_payment_id: session.payment_intent,
          stripe_charge_id: session.payment_intent,
          monto: session.amount_total / 100,
          moneda: session.currency.toUpperCase(),
          metodo: "card",
          estado: "pagado",
        });
        console.log(`✅ Reserva ${reservaId} confirmada y pago registrado.`);
      }
    }

    res.json({ received: true });
  },

  // ===== FACTURA =====
  async getFactura(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT r.*, 
            res.nombre_restaurante, 
            res.logo_restaurante,  -- agregamos el logo
            m.id_mesa AS id_mesa_reserva,
            m.nombre_mesa AS nombre_mesa,
            m.capacidad, 
            o.nombre_ocasion, 
            o.precio_ocasion,
            TIME(r.fecha_inicio) AS hora_reserva,
            COALESCE(SUM(p.monto), 0) AS total_pagado
       FROM reserva r
       LEFT JOIN restaurantes res ON r.id_restaurante = res.id_restaurante
       LEFT JOIN mesa m ON r.id_mesa = m.id_mesa
       LEFT JOIN ocasion o ON r.id_ocasion = o.id_ocasion
       LEFT JOIN pagos p ON r.id_reserva = p.id_reserva AND p.estado = 'pagado'
       WHERE r.id_reserva = ?
       GROUP BY r.id_reserva`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Reserva no encontrada." });

    const reserva = rows[0];
    const precioOcasion = parseInt(Number(reserva.precio_ocasion) || 0);
    const comisionMiMesaYa = 1500;
    const precioTotal = precioOcasion + comisionMiMesaYa;

    res.json({
      ...reserva,
      precio_ocasion: precioOcasion,
      comisionMiMesaYa,
      precio_total: precioTotal,
      hora_reserva: reserva.hora_reserva,
      id_mesa: reserva.id_mesa_reserva,
      nombre_mesa: reserva.nombre_mesa,
      logo_restaurante: reserva.logo_restaurante, // agregamos el logo al JSON
    });
  } catch (err) {
    console.error("Error al obtener factura:", err);
    res.status(500).json({ error: err.message });
  }
},
};

module.exports = ReservaController;
