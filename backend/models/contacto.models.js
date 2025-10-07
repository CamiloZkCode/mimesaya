const nodemailer = require('nodemailer');
const path = require('path');

// Validación de correo
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const enviarCorreo = async (req, res) => {
  const { nombre, correo, telefono, mensaje } = req.body;

  if (!nombre || !correo || !mensaje) {
    return res.status(400).json({ error: 'Nombre, correo y mensaje son obligatorios' });
  }

  if (!isValidEmail(correo)) {
    return res.status(400).json({ error: 'El correo electrónico no tiene un formato válido' });
  }

  // Transportador Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CORREO,
      pass: process.env.CORREO_PASSWORD,
    },
  });

  // 📎 Ruta del logo dentro del backend
  const logoPath = path.join(__dirname, '../public/LogoConSin.png');

  // Opciones del correo
  const mailOptions = {
    from: `"MiMesaYa" <${process.env.CORREO}>`,
    to: process.env.CORREO,
    subject: `📩 Nuevo mensaje de ${nombre}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;
                  padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;
                  background-color: #f9f9f9;">
        <header style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
          <img src="cid:logoEmpresa" alt="Logo MiMesaYa" style="max-width: 160px; margin-bottom: 10px;" />
          <h2 style="color: #1a73e8; font-size: 22px; margin: 0;">Mensaje recibido</h2>
        </header>

        <main style="padding: 20px 0;">
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Correo:</strong> ${correo}</p>
          <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
          <p><strong>Mensaje:</strong><br>${mensaje}</p>
        </main>

        <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #777; font-size: 14px;">
          <p>Enviado desde <a href="https://mimesaya.com" style="color: #1a73e8; text-decoration: none;">MiMesaYa</a></p>
          <p>Contáctanos en 
            <a href="mailto:${process.env.CORREO}" style="color: #1a73e8; text-decoration: none;">
              ${process.env.CORREO}
            </a>
          </p>
        </footer>
      </div>
    `,
    attachments: [
      {
        filename: 'LogoConSin.png',
        path: logoPath,
        cid: 'logoEmpresa', // usado en el <img src="cid:logoEmpresa" />
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({
      error: 'Error al enviar el correo',
      details: error.message || 'Error desconocido en el servidor',
    });
  }
};

module.exports = { enviarCorreo };
