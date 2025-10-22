// stores/exportExcel.js
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function exportarExcel(datos, nombreArchivo = "Reporte.xlsx") {
  if (!datos || datos.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reservas");

  // ===== Encabezados =====
  worksheet.columns = Object.keys(datos[0]).map((key) => ({
    header: key,
    key,
    width: 20,
  }));

  // ===== Añadir datos =====
  datos.forEach((row) => worksheet.addRow(row));

  // ===== Estilo encabezados =====
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF6B7280" }, // gris
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  // ===== Estilo filas =====
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // saltar encabezados
    row.eachCell((cell) => {
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });
  });

  // ===== Calcular resumen =====
  const totalReservas = datos.length;
const canceladas = datos.filter(r => r.Estado.toLowerCase() === "cancelada").length;
const finalizadas = datos.filter(r => r.Estado.toLowerCase() === "finalizada").length;

  const resumen = [
    { Concepto: "Total Reservas", Cantidad: totalReservas },
    { Concepto: "Total Canceladas", Cantidad: canceladas },
    { Concepto: "Total Finalizadas", Cantidad: finalizadas },
  ];

  // ===== Añadir 3 espacios antes del resumen =====
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([]);

  // ===== Definir columnas del resumen =====
  const startRowResumen = worksheet.lastRow.number + 1;
  worksheet.getColumn(1).width = 25; // Concepto
  worksheet.getColumn(2).width = 15; // Cantidad

  // ===== Añadir resumen =====
  resumen.forEach((r) => {
    const row = worksheet.addRow([r.Concepto, r.Cantidad]);
    row.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF6B7280" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });
  });

  // ===== Exportar =====
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), nombreArchivo);
}
