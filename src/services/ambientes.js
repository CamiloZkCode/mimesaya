// src/services/ambientes.js
import API from "@/services/axios";

// 🔹 Obtener todos los ambientes
export async function obtenerAmbientes() {
  try {
    const res = await API.get("/ambientes/obtenerambientes");
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// 🔹 Obtener un ambiente por ID
export async function obtenerAmbientePorId(id) {
  try {
    const res = await API.get(`/ambientes/listarambientes/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// 🔹 Crear un nuevo ambiente (requiere token y rol administrador)
export async function crearAmbiente(data) {
  try {
    const res = await API.post("/ambientes/crear-ambientes", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// 🔹 Actualizar un ambiente por ID (requiere token y rol administrador)
export async function actualizarAmbiente(id, data) {
  try {
    const res = await API.post(`/ambientes/actualizar-ambientes/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// 🔹 (Opcional) Eliminar un ambiente
export async function eliminarAmbiente(id) {
  try {
    const res = await API.delete(`/ambientes/eliminar-ambiente/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
} 
