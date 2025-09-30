// routes/stripeWebhook.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
const db = require("../config/db");

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const reservaId = session.metadata.reserva_id;

        await db.query(
          "UPDATE reserva SET estado_reserva = 'pagada' WHERE id_reserva = ?",
          [reservaId]
        );
      }

      res.json({ received: true });
    } catch (err) {
      console.error("⚠️  Webhook error:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

module.exports = router;
