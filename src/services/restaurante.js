import API from "@/services/axios";

// Obtener todos los restaurantes (para cargar en select)
export async function obtenerRestaurantes() {
  try {
    const res = await API.get("/restaurantes/ver-restaurantes");
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// Obtener restaurante por ID (perfil logueado)
export async function obtenerRestaurantePorId(id) {
  try {
    const res = await API.get(`/restaurantes/ver-restaurantes/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// Actualizar restaurante por ID
export async function actualizarRestaurante(id, data) {
  try {
    const res = await API.put(`/restaurantes/actulizar-restaurante/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
