const PerfilModel = require("../models/perfilUsuarios.models");

const PerfilController = {
  async obtenerPerfil(req, res) {
    try {
      const { id_admin } = req.params; // viene de la ruta /perfil/:id_admin
      const perfil = await PerfilModel.obtenerPerfilAdministrador(id_admin);

      if (!perfil) {
        return res.status(404).json({ mensaje: "Perfil no encontrado" });
      }

      // generar el enlace de configuración de Stripe Connect (solo si tiene cuenta)
      let enlaceStripe = null;
      if (perfil.stripe_account_id) {
        enlaceStripe = `https://dashboard.stripe.com/${perfil.stripe_account_id}`;
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
          enlaceStripe, // Enlace a Stripe
        },
      });
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  },
};

module.exports = PerfilController;
