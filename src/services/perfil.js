import API from "@/services/axios";

// Obtener perfil del administrador (requiere id del administrador logueado)
export async function obtenerPerfil() {
  try {
    const res = await API.get(`/perfil`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function obtenerPerfilCliente() {
  try {
    const res = await API.get(`/perfil/cliente`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}