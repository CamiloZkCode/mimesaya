import API from "@/services/axios";

// Función: Registrar usuario ,accede a ruta en el backend
export async function registrarUsuario(usuario) {
  try {
    const res = await API.post("/auth/registrar-cliente", usuario);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}