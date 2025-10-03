// services/reservas.js
import API from "@/services/axios";

export async function crearReserva(data) {
  try {
    const res = await API.post("/reservas/crear-reserva", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function obtenerHorariosDisponibles(id_mesa, fecha) {
  try {
    const res = await API.get("/reservas/ver-reservas", { params: { id_mesa, fecha } });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export async function confirmarReserva(sessionId) {
  try {
    const res = await API.get(`/reservas/confirmar-reserva?session_id=${sessionId}`);
    return res.data; // Devuelve { message }
  } catch (err) {
    throw err.response?.data || { message: "Error al confirmar la reserva" };
  }
}