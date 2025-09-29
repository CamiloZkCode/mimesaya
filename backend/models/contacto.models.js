const nodemailer = require('nodemailer');

// Función para validar formato de correo electrónico
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const enviarCorreo = async (req, res) => {
  const { nombre, correo, telefono, mensaje } = req.body;

  // Validar entrada
  if (!nombre || !correo || !mensaje) {
    return res.status(400).json({ error: 'Nombre, correo y mensaje son obligatorios' });
  }

  if (!isValidEmail(correo)) {
    return res.status(400).json({ error: 'El correo electrónico no tiene un formato válido' });
  }

  // Configurar transporte de Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CORREO,
      pass: process.env.CORREO_PASSWORD,
    },
  });

  // Opciones del correo
  const mailOptions = {
    from: `"Formulario de MiMesaYa" <${process.env.CORREO}>`,
    to: process.env.CORREO,
    subject: `Nuevo mensaje desde MiMesaYa de ${nombre}`,
    text: `
      Nombre: ${nombre}
      Correo: ${correo}
      Teléfono: ${telefono || 'No proporcionado'}
      Mensaje: ${mensaje}
      Enviado desde: MiMesaYa[](https://mimesaya.com)
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <header style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
          <h1 style="color: #1a73e8; font-size: 24px; margin: 0;">MiMesaYa</h1>
          <p style="color: #555; font-size: 16px; margin: 5px 0;">Nuevo mensaje de contacto</p>
        </header>
        <main style="padding: 20px 0;">
          <p style="margin: 10px 0;"><strong>Nombre:</strong> ${nombre}</p>
          <p style="margin: 10px 0;"><strong>Correo:</strong> ${correo}</p>
          <p style="margin: 10px 0;"><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
          <p style="margin: 10px 0;"><strong>Mensaje:</strong> ${mensaje}</p>
        </main>
        <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #777; font-size: 14px;">
          <p>Enviado desde <a href="https://mimesaya.com" style="color: #1a73e8; text-decoration: none;">MiMesaYa</a></p>
          <p>¿Tienes preguntas? Contáctanos en <a href="mailto:${process.env.CORREO}" style="color: #1a73e8; text-decoration: none;">${process.env.CORREO}</a></p>
        </footer>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ 
      error: 'Error al enviar el correo', 
      details: error.message || 'Error desconocido en el servidor' 
    });
  }
};

module.exports = { enviarCorreo };