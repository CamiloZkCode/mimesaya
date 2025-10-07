const db = require("../config/db");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const OcasionModel = {
  async crearOcasion(data) {
    const [result] = await db.query(
      `INSERT INTO ocasion 
        (id_restaurante, nombre_ocasion, precio_ocasion, moneda, stripe_product_id, stripe_price_id, duracion_min_horas) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.id_restaurante,
        data.nombre_ocasion,
        data.precio_ocasion,
        data.moneda || "COP",
        data.stripe_product_id,
        data.stripe_price_id,
        data.duracion_min_horas,
      ]
    );
    return result.insertId;
  },

  async obtenerOcasionesPorRestaurante(id_restaurante) {
    const [rows] = await db.query(
      `SELECT 
          id_ocasion, 
          nombre_ocasion, 
          precio_ocasion, 
          moneda, 
          stripe_product_id, 
          stripe_price_id,
          duracion_min_horas
       FROM ocasion
       WHERE id_restaurante = ?`,
      [id_restaurante]
    );
    return rows;
  },

  async obtenerOcasionPorId(id_ocasion) {
    const [rows] = await db.query(
      `SELECT 
          id_ocasion, 
          id_restaurante, 
          nombre_ocasion, 
          precio_ocasion, 
          moneda, 
          stripe_product_id, 
          stripe_price_id,
          duracion_min_horas
       FROM ocasion
       WHERE id_ocasion = ?`,
      [id_ocasion]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  async obtenerOcasionesPorAdmin(id_admin) {
    const [rows] = await db.query(
      `SELECT 
          o.id_ocasion, 
          o.nombre_ocasion, 
          o.precio_ocasion, 
          o.moneda, 
          o.stripe_product_id, 
          o.stripe_price_id,
          o.duracion_min_horas
       FROM ocasion o
       INNER JOIN restaurantes r ON o.id_restaurante = r.id_restaurante
       WHERE r.id_admin = ?`,
      [id_admin]
    );
    return rows;
  },

//Crear ocasión por defecto
  async crearOcasionDefault(id_restaurante) {
    // Verificar si ya existe la ocasión default para este restaurante (evitar duplicados)
    const [existe] = await db.query(
      `SELECT id_ocasion FROM ocasion WHERE id_restaurante = ? AND nombre_ocasion = 'Reserva General'`,
      [id_restaurante]
    );
    if (existe.length > 0) {
      console.log(`Ocasión default ya existe para restaurante ${id_restaurante}`);
      return existe[0].id_ocasion; // Retorna el ID existente
    }

    // Crear producto en Stripe
    const product = await stripe.products.create({
      name: 'Reserva General',
      metadata: { restaurante_id: id_restaurante },
    });

    const price = await stripe.prices.create({
      unit_amount: 70000, // 0 COP
      currency: 'cop',
      product: product.id,
    });

    // Insertar en BD
    const [result] = await db.query(
      `INSERT INTO ocasion 
        (id_restaurante, nombre_ocasion, precio_ocasion, moneda, stripe_product_id, stripe_price_id, duracion_min_horas) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_restaurante,
        'Reserva General',
        700, // Precio
        'COP',
        product.id,
        price.id,
        2, // 2 hora por defecto 
      ]
    );

    console.log(`Ocasión default creada para restaurante ${id_restaurante}: ID ${result.insertId}`);
    return result.insertId;
  },
};

module.exports = OcasionModel;
