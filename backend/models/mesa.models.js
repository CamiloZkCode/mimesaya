// models/mesa.models.js
const db = require("../config/db");

const MesaModel = {
  async obtenerMesas() {
    const [rows] = await db.query(
      `SELECT  
          m.id_mesa, 
          m.nombre_mesa, 
          m.capacidad, 
          m.ubicacion,
          m.foto_url,
          a.nombre_ambiente, 
          r.nombre_restaurante,
          m.id_ambiente,
          m.id_restaurante
       FROM mesa m
       LEFT JOIN ambientes a ON m.id_ambiente = a.id_ambiente
       LEFT JOIN restaurantes r ON m.id_restaurante = r.id_restaurante`
    );
    return rows;
  },

  async obtenerMesasDisponibles({ id_restaurante, id_ambiente, min_capacidad }) {
    let query = `
      SELECT  
          m.id_mesa, 
          m.nombre_mesa, 
          m.capacidad, 
          m.ubicacion,
          m.foto_url,
          a.nombre_ambiente, 
          r.nombre_restaurante,
          m.id_ambiente,
          m.id_restaurante
       FROM mesa m
       LEFT JOIN ambientes a ON m.id_ambiente = a.id_ambiente
       LEFT JOIN restaurantes r ON m.id_restaurante = r.id_restaurante
       WHERE 1=1`;
    
    const params = [];
    
    if (id_restaurante) {
      query += ` AND m.id_restaurante = ?`;
      params.push(id_restaurante);
    }
    if (id_ambiente) {
      query += ` AND m.id_ambiente = ?`;
      params.push(id_ambiente);
    }
    if (min_capacidad) {
      query += ` AND m.capacidad >= ?`;
      params.push(min_capacidad);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  async obtenerMesaPorId(id_mesa) {
    const [rows] = await db.query(
      `SELECT  
          m.id_mesa, 
          m.nombre_mesa, 
          m.capacidad, 
          m.ubicacion,
          m.foto_url,
          a.nombre_ambiente, 
          r.nombre_restaurante,
          m.id_ambiente,
          m.id_restaurante
       FROM mesa m
       LEFT JOIN ambientes a ON m.id_ambiente = a.id_ambiente
       LEFT JOIN restaurantes r ON m.id_restaurante = r.id_restaurante
       WHERE m.id_mesa = ?`,
      [id_mesa]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  async crearMesa(data) {
    const [result] = await db.query(
      `INSERT INTO mesa 
        (nombre_mesa, id_ambiente, id_restaurante, capacidad, ubicacion, foto_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.nombre_mesa,
        data.id_ambiente,
        data.id_restaurante,
        data.capacidad,
        data.ubicacion,
        data.foto_url || null,
      ]
    );
    return result.insertId;
  },

  async actualizarMesa(id, data) {
    await db.query(
      `UPDATE mesa SET
        nombre_mesa = ?, 
        id_ambiente = ?, 
        id_restaurante = ?, 
        capacidad = ?, 
        ubicacion = ?, 
        foto_url = ?
       WHERE id_mesa = ?`,
      [
        data.nombre_mesa,
        data.id_ambiente,
        data.id_restaurante,
        data.capacidad,
        data.ubicacion,
        data.foto_url || null,
        id,
      ]
    );
    return true;
  },

  async eliminarMesa(id) {
    await db.query("DELETE FROM mesa WHERE id_mesa = ?", [id]);
    return true;
  },
};

module.exports = MesaModel;