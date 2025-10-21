const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const PerfilModel = require("../models/perfilUsuarios.models");

const PerfilController = {
  async obtenerPerfil(req, res) {
    try {
      const id_admin = req.user.id_usuario;
      const perfil = await PerfilModel.obtenerPerfilAdministrador(id_admin);

      if (!perfil) {
        return res.status(404).json({ mensaje: "Perfil no encontrado" });
      }

      let enlaceStripe = null;

      // ===== Crear cuenta Stripe si no existe =====
      if (!perfil.stripe_account_id) {
        const cuenta = await stripe.accounts.create({
          type: "express",
          country: "CO",
          email: perfil.correo_admin,
          business_type: "individual",
          capabilities: { transfers: { requested: true } },
        });

        await PerfilModel.actualizarStripeAccountId(perfil.id_restaurante, cuenta.id);
        perfil.stripe_account_id = cuenta.id;

        // Crear enlace de onboarding (primera vez)
        const accountLink = await stripe.accountLinks.create({
          account: cuenta.id,
          refresh_url: "http://localhost:5173/perfil",
          return_url: "http://localhost:5173/perfil",
          type: "account_onboarding",
        });

        enlaceStripe = accountLink.url;
      } else {
        // Si ya tiene cuenta, crear un enlace de inicio de sesión para editar datos
        const loginLink = await stripe.accounts.createLoginLink(perfil.stripe_account_id);
        enlaceStripe = loginLink.url;
      }

      res.json({
        admin: {
          id_usuario: perfil.id_usuario,
          nombre: perfil.nombre_admin,
          telefono: perfil.telefono_admin,
          correo: perfil.correo_admin,
        },
        restaurante: {
          id_restaurante: perfil.id_restaurante,
          nit_restaurante: perfil.nit_restaurante,
          nombre_restaurante: perfil.nombre_restaurante,
          direccion_restaurante: perfil.direccion_restaurante,
          telefono_restaurante: perfil.telefono_restaurante,
          logo_restaurante: perfil.logo_restaurante,
          enlaceStripe,
          tieneCuentaStripe: Boolean(perfil.stripe_account_id),
        },
      });
    } catch (error) {
      console.error("Error al obtener perfil general:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  },

    async obtenerPerfilCliente(req, res) {
    try {
      const id_cliente = req.user.id_usuario;
      const cliente = await PerfilModel.obtenerPerfilCliente(id_cliente);

      if (!cliente) {
        return res.status(404).json({ mensaje: "Perfil no encontrado" });
      }

      res.json({
        cliente: {
          id_usuario: cliente.id_usuario,
          nombre: cliente.nombre,
          telefono: cliente.telefono,
          correo: cliente.correo,
        },
      });
    } catch (error) {
      console.error("Error al obtener perfil del cliente:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  },
};

module.exports = PerfilController;
