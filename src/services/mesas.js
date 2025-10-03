import API from "@/services/axios";

// Ver todas las mesas
export async function obtenerMesas() {
  try {
    const res = await API.get("/mesas/ver-mesas");
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// Obtener mesas disponibles
export async function obtenerMesasDisponibles(params) {
  try {
    const res = await API.get("/mesas/mesas-disponibles", { params });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}


// Ver una mesa por ID
export async function obtenerMesaPorId(id) {
  try {
    const res = await API.get(`/mesas/ver-mesa/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// Crear mesa
export async function crearMesa(data) {
  try {
    const res = await API.post("/mesas/crear-mesa", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// Actualizar mesa
export async function actualizarMesa(id, data) {
  try {
    const res = await API.put(`/mesas/actualizar-mesa/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// Eliminar mesa
export async function eliminarMesa(id) {
  try {
    const res = await API.delete(`/mesas/eliminar-mesa/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}


// Obtener mesas del admin logueado
export async function obtenerMisMesas() {
  try {
    const res = await API.get("/mesas/mis-mesas"); // coincide con tu ruta protegida en backend
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}


