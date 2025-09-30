import API from "@/services/axios";

// Crear ocasión (requiere token y rol restaurante)
export async function crearOcasion(data) {
  try {
    const res = await API.post("/ocasion/crear-ocasion", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// Obtener ocasiones por restaurante
export async function obtenerOcasionesPorRestaurante(id_restaurante) {
  try {
    const res = await API.get(`/ocasion/obtener-ocacion/${id_restaurante}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
