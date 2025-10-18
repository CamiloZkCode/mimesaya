<template>
  <main class="perfil-cliente">
    <!-- ===== INFO DEL CLIENTE ===== -->
    <section class="cliente-info">
      <div class="cliente-detalles">
        <h2>Perfil del Cliente</h2>
        <p><strong>Nombre:</strong> Laura Martínez</p>
        <p><strong>Correo:</strong> laura.martinez@example.com</p>
        <p><strong>Teléfono:</strong> +57 312 987 6543</p>
      </div>
    </section>

    <!-- ===== TABLA DE RESERVAS ===== -->
    <section class="reservas">
      <h2>Mis Reservas</h2>

      <!-- CONTENEDOR SCROLLABLE -->
      <div class="tabla-scroll">
        <table>
          <thead>
            <tr>
              <th>ID Reserva</th>
              <th>Restaurante</th>
              <th>Mesa</th>
              <th>Ocasión</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>#0012</td>
              <td>La Parrilla Gourmet</td>
              <td>Mesa 4</td>
              <td>Cumpleaños</td>
              <td>2025-10-20 18:00</td>
              <td>2025-10-20 20:00</td>
              <td><span class="estado pendiente">Pendiente</span></td>
              <td>
                <button class="btn-cancelar">Cancelar</button>
              </td>
            </tr>

            <tr>
              <td>#0013</td>
              <td>El Sabor del Mar</td>
              <td>Mesa 2</td>
              <td>Cena Romántica</td>
              <td>2025-09-28 19:00</td>
              <td>2025-09-28 21:00</td>
              <td><span class="estado confirmada">Confirmada</span></td>
              <td>
                <button class="btn-cancelar" disabled>Cancelar</button>
              </td>
            </tr>

            <tr>
              <td>#0014</td>
              <td>Café Central</td>
              <td>Mesa 1</td>
              <td>Reunión</td>
              <td>2025-09-10 10:00</td>
              <td>2025-09-10 11:30</td>
              <td><span class="estado cancelada">Cancelada</span></td>
              <td>
                <button class="btn-cancelar" disabled>Cancelar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
// Solo diseño visual con datos ficticios
</script>

<style scoped>
.perfil-cliente {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 4rem; /* más ancho */
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* ===== SECCIÓN CLIENTE ===== */
.cliente-info {
  background: #fff;
  padding: 2rem 4rem; /* más espacio horizontal */
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  width: 100%;
}

.cliente-detalles {
  max-width: 100%;
}

.cliente-detalles h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #222;
}

.cliente-detalles p {
  font-size: 1.3rem;
  color: #333;
  margin: 0.5rem 0;
}

/* ===== TABLA DE RESERVAS ===== */
.reservas {
  background: #fff;
  border-radius: 16px;
  padding: 2rem 4rem; /* más ancho */
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  width: 100%;
}

.reservas h2 {
  font-size: 1.8rem;
  margin-bottom: 1.2rem;
  color: #222;
}

/* Contenedor scroll */
.tabla-scroll {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  min-width: 800px;
}

th,
td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
  color: #333;
  font-size: 1.05rem;
}

.estado {
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  font-weight: 600;
  color: #fff;
}

.estado.pendiente {
  background-color: #f0ad4e;
}

.estado.confirmada {
  background-color: #28a745;
}

.estado.cancelada {
  background-color: #dc3545;
}

/* Botón cancelar */
.btn-cancelar {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 0.95rem;
}

.btn-cancelar:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-cancelar:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .perfil-cliente {
    padding: 2rem;
  }

  .cliente-info,
  .reservas {
    padding: 1.8rem 2rem;
  }
}

@media (max-width: 768px) {
  .perfil-cliente {
    padding: 1rem;
  }

  .cliente-info {
    text-align: center;
    padding: 1.5rem;
  }

  .reservas {
    padding: 1.5rem;
  }

  .tabla-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  table {
    font-size: 0.9rem;
    min-width: 700px;
  }

  th,
  td {
    padding: 0.6rem;
  }
}
</style>
