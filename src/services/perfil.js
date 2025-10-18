import API from "@/services/axios";

// Obtener perfil del administrador (requiere id del administrador logueado)
export async function obtenerPerfil(id_admin) {
  try {
    const res = await API.get(`/perfil/${id_admin}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}
