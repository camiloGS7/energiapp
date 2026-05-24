import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportarDashboardPDF({
  usuario,
  periodo,
  totalKwh,
  series,
  labels
}) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15
  let y = margin

  // ── Encabezado ──
  pdf.setFillColor(31, 56, 100)
  pdf.rect(0, 0, pageWidth, 28, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text('EnergiApp', margin, 12)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Reporte de consumo energético', margin, 20)
  pdf.text(new Date().toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric'
  }), pageWidth - margin, 20, { align: 'right' })

  y = 38

  // ── Info del usuario y período ──
  pdf.setTextColor(50, 50, 50)
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Usuario:', margin, y)
  pdf.setFont('helvetica', 'normal')
  pdf.text(usuario || 'No especificado', margin + 22, y)
  y += 7

  pdf.setFont('helvetica', 'bold')
  pdf.text('Período:', margin, y)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`${periodo.desde} al ${periodo.hasta}`, margin + 22, y)
  y += 7

  pdf.setFont('helvetica', 'bold')
  pdf.text('Total consumido:', margin, y)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`${totalKwh} kWh`, margin + 38, y)
  y += 12

  // ── Línea separadora ──
  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, y, pageWidth - margin, y)
  y += 8

  // ── Tabla de consumo por dispositivo ──
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(31, 56, 100)
  pdf.text('Consumo por dispositivo', margin, y)
  y += 8

  // Encabezado de tabla
  pdf.setFillColor(217, 225, 242)
  pdf.rect(margin, y, pageWidth - margin * 2, 8, 'F')
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(50, 50, 50)
  pdf.text('Dispositivo', margin + 3, y + 5.5)
  pdf.text('Consumo (kWh)', pageWidth - margin - 50, y + 5.5)
  pdf.text('% del total', pageWidth - margin - 18, y + 5.5)
  y += 8

  // Filas de tabla
  pdf.setFont('helvetica', 'normal')
  series.forEach((s, i) => {
    const consumoDisp = parseFloat(
      s.data.reduce((sum, v) => sum + (v ?? 0), 0).toFixed(1)
    )
    const porcentaje = totalKwh > 0
      ? ((consumoDisp / totalKwh) * 100).toFixed(1)
      : '0.0'

    if (i % 2 === 0) {
      pdf.setFillColor(248, 250, 252)
      pdf.rect(margin, y, pageWidth - margin * 2, 7, 'F')
    }

    pdf.text(s.nombre, margin + 3, y + 5)
    pdf.text(String(consumoDisp), pageWidth - margin - 50, y + 5)
    pdf.text(`${porcentaje}%`, pageWidth - margin - 18, y + 5)
    y += 7

    if (y > pageHeight - 30) {
      pdf.addPage()
      y = margin
    }
  })

  y += 8

  // ── Línea separadora ──
  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, y, pageWidth - margin, y)
  y += 8

  // ── Resumen de primeros 10 días ──
  if (labels && labels.length > 0) {
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(31, 56, 100)
    pdf.text('Consumo diario (primeros 10 días del período)', margin, y)
    y += 8

    pdf.setFillColor(217, 225, 242)
    pdf.rect(margin, y, pageWidth - margin * 2, 8, 'F')
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(50, 50, 50)
    pdf.text('Fecha', margin + 3, y + 5.5)
    pdf.text('Consumo total (kWh)', pageWidth - margin - 45, y + 5.5)
    y += 8

    pdf.setFont('helvetica', 'normal')
    const diasMostrar = Math.min(10, labels.length)
    for (let i = 0; i < diasMostrar; i++) {
      const consumoDia = parseFloat(
        series.reduce((sum, s) => sum + (s.data[i] ?? 0), 0).toFixed(1)
      )
      if (i % 2 === 0) {
        pdf.setFillColor(248, 250, 252)
        pdf.rect(margin, y, pageWidth - margin * 2, 7, 'F')
      }
      pdf.text(labels[i], margin + 3, y + 5)
      pdf.text(String(consumoDia), pageWidth - margin - 45, y + 5)
      y += 7

      if (y > pageHeight - 30) {
        pdf.addPage()
        y = margin
      }
    }
  }

  // ── Pie de página ──
  const totalPages = pdf.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text(
      `EnergiApp — Reporte generado automáticamente — Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    )
  }

  // ── Descargar ──
  const nombreArchivo = `EnergiApp_Reporte_${periodo.desde}_${periodo.hasta}.pdf`
  pdf.save(nombreArchivo)
}
