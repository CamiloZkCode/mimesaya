const db = require("../config/db");
const OcasionModel = require("../models/ocasion.models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const OcasionController = {
  async crearOcasion(req, res) {
    try {
      const id_admin = req.user.id_usuario;
      const { nombre_ocasion, precio_ocasion, moneda, duracion_min_horas } = req.body;

      // Validar entrada
      if (!nombre_ocasion || !precio_ocasion || !moneda || !duracion_min_horas) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
      }
      if (!Number.isInteger(duracion_min_horas) || duracion_min_horas < 1) {
        return res.status(400).json({ error: "La duración mínima debe ser un entero positivo" });
      }

      // Buscar el restaurante del admin
      const [restaurante] = await db.query(
        "SELECT id_restaurante FROM restaurantes WHERE id_admin = ?",
        [id_admin]
      );
      if (!restaurante || restaurante.length === 0) {
        return res.status(404).json({ error: "Restaurante no encontrado" });
      }

      const id_restaurante = restaurante[0].id_restaurante;

      // Crear producto y precio en Stripe
      const product = await stripe.products.create({
        name: nombre_ocasion,
        metadata: { restaurante_id: id_restaurante },
      });
      const price = await stripe.prices.create({
        unit_amount: Math.round(precio_ocasion * 100),
        currency: moneda.toLowerCase(),
        product: product.id,
      });

      // Crear la ocasión en la BD
      const id = await OcasionModel.crearOcasion({
        id_restaurante,
        nombre_ocasion,
        precio_ocasion,
        moneda,
        duracion_min_horas,
        stripe_product_id: product.id,
        stripe_price_id: price.id,
      });

      res.status(201).json({ id, message: "Ocasión creada con éxito" });
    } catch (err) {
      console.error("Error al crear ocasión:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async obtenerOcasionesAdmin(req, res) {
    try {
      const id_admin = req.user.id_usuario;
      const ocasiones = await OcasionModel.obtenerOcasionesPorAdmin(id_admin);
      res.json(ocasiones);
    } catch (err) {
      console.error("Error en obtenerOcasionesAdmin:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async obtenerOcasionesPorRestaurante(req, res) {
    try {
      const { id_restaurante } = req.params;
      const ocasiones = await OcasionModel.obtenerOcasionesPorRestaurante(id_restaurante);
      res.json(ocasiones);
    } catch (err) {
      console.error("Error en obtenerOcasionesPorRestaurante:", err);
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = OcasionController;