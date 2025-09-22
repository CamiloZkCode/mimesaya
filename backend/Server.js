const express = require("express");
const cors = require("cors");
const cron = require("node-cron"); // Importar node-cron
require("dotenv").config();
process.env.TZ = "America/Bogota";
const moment = require("moment-timezone");


const authRoutes = require("./routes/auth.routes");
const ambientesRoutes = require("./routes/ambientes.routes");


const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/ambientes", ambientesRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
