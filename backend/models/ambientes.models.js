const db = require("../config/db");

const AmbienteModel = {

  //Para cargar en el select de filtros y en el home
  async obtenerAmbientes() {
    const [rows] = await db.query("SELECT * FROM ambientes");
    return rows;
  },

  //Para cargar el perfil del ambiente seleccionado
  async obtenerAmbientexId(id) {
    const [rows] = await db.query("SELECT * FROM ambientes WHERE id_ambiente = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  //creacion y actualizacion de ambientes por el admin
  async CrearAmbiente(data) {
    const [result] = await db.query(
      `INSERT INTO ambientes 
      (nombre_ambiente, descripcion_ambiente, capacidad_min, capacidad_max, imagen_ambiente, caracteristica, insignia)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.nombre_ambiente,
        data.descripcion_ambiente,
        data.capacidad_min,
        data.capacidad_max,
        data.imagen_ambiente,
        data.caracteristica,
        data.insignia
      ]
    );
    return result.insertId;
  },

  async ActualizarAmbientes(id, data) {
    await db.query(
      `UPDATE ambientes SET 
      nombre_ambiente=?, descripcion_ambiente=?, capacidad_min=?, capacidad_max=?, imagen_ambiente=?, caracteristica=?, insignia=?
      WHERE id_ambiente=?`,
      [
        data.nombre_ambiente,
        data.descripcion_ambiente,
        data.capacidad_min,
        data.capacidad_max,
        data.imagen_ambiente,
        data.caracteristica,
        data.insignia,
        id
      ]
    );
    return true;
  },
};

module.exports = AmbienteModel;