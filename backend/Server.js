const express = require("express");
const cors = require("cors");
const cron = require("node-cron"); // Importar node-cron
require("dotenv").config();
process.env.TZ = "America/Bogota";
const moment = require("moment-timezone");


const authRoutes = require("./routes/auth.routes");
const ambientesRoutes = require("./routes/ambientes.routes");
const contactoRoutes = require('./routes/contacto.routes');
const RestauranteRoutes = require('./routes/restaurante.routes');
const MesaRoutes = require('./routes/mesa.routes');
const reservarRoutes = require('./routes/reservas.routes');
const ocasionRoutes = require('./routes/ocasion.routes');
const stripeWebhookRoutes = require('./routes/stripeWebhook.routes');



const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/ambientes", ambientesRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/restaurantes', RestauranteRoutes);
app.use('/api/mesas', MesaRoutes);
app.use('/api/reservas',reservarRoutes );
app.use('/api/ocasion',ocasionRoutes );
app.use('/api/stripe', stripeWebhookRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
