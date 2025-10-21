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

export async function obtenerFactura(id) {
  try {
    const res = await API.get(`/reservas/factura/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error al obtener la factura" };
  }
}


export async function CancelarReserva(id) {
  try {
    const res = await API.put(`/reservas/cancelar/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error al cancelar la reserva" };
  }
}

export async function obtenerReservasCliente() {
  try {
    const res = await API.get(`/reservas/mis-reservas`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error al obtener las reservas" };

  }
}



// === ADMINISTRADOR ===

export async function obtenerReservasRestaurante() {
  try {
    const res = await API.get(`/reservas/reservas-restaurante`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error al obtener las reservas del restaurante" };
  }
}

export async function cancelarReservaAdmin(id) {
  try {
    const res = await API.put(`/reservas/admin/reservas/${id}/cancelar`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error al cancelar la reserva del restaurante" };
  }
}

export async function finalizarReservaAdmin(id) {
  try {
    const res = await API.put(`/reservas/admin/reservas/${id}/finalizar`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error al finalizar la reserva del restaurante" };
  }
}
