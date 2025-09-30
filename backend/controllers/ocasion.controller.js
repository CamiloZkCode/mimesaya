// controllers/ocasion.controller.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const OcasionModel = require("../models/ocasion.models");

const OcasionController = {
  async crearOcasion(req, res) {
    try {
      const { id_restaurante, nombre_ocasion, precio_ocasion, moneda } = req.body;

      // Crear producto en Stripe
      const product = await stripe.products.create({
        name: nombre_ocasion,
        metadata: { restaurante_id: id_restaurante },
      });

      // Crear precio en Stripe
      const price = await stripe.prices.create({
        unit_amount: Math.round(precio_ocasion * 100), // en centavos
        currency: moneda.toLowerCase(),
        product: product.id,
      });

      const id = await OcasionModel.crearOcasion({
        id_restaurante,
        nombre_ocasion,
        precio_ocasion,
        moneda,
        stripe_product_id: product.id,
        stripe_price_id: price.id,
      });

      res.status(201).json({ id, message: "Ocasión creada con éxito" });
    } catch (err) {
      console.error("Error al crear ocasión:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async obtenerOcasionesPorRestaurante(req, res) {
    try {
      const { id_restaurante } = req.params;
      const ocasiones = await OcasionModel.obtenerOcasionesPorRestaurante(id_restaurante);
      res.json(ocasiones);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = OcasionController;
