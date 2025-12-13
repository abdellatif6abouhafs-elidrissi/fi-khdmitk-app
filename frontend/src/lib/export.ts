import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type ExportType = 'users' | 'artisans' | 'bookings' | 'all';

export async function fetchExportData(type: ExportType) {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/admin/export?type=${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des données');
  }

  const result = await response.json();
  return result.data;
}

export function exportToExcel(data: Record<string, any[]>, filename: string) {
  const workbook = XLSX.utils.book_new();

  Object.entries(data).forEach(([sheetName, sheetData]) => {
    if (sheetData && sheetData.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(sheetData);

      // Auto-size columns
      const colWidths = Object.keys(sheetData[0]).map((key) => ({
        wch: Math.max(
          key.length,
          ...sheetData.map((row) => String(row[key] || '').length)
        ) + 2,
      }));
      worksheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }
  });

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToPDF(data: Record<string, any[]>, filename: string, title: string) {
  const doc = new jsPDF('landscape');

  let yOffset = 20;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129); // Emerald color
  doc.text(title, 14, yOffset);
  yOffset += 10;

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`, 14, yOffset);
  yOffset += 15;

  Object.entries(data).forEach(([sectionName, sectionData], index) => {
    if (sectionData && sectionData.length > 0) {
      // Add new page if needed
      if (index > 0) {
        doc.addPage();
        yOffset = 20;
      }

      // Section title
      doc.setFontSize(14);
      doc.setTextColor(0);
      const sectionTitles: Record<string, string> = {
        users: 'Utilisateurs',
        artisans: 'Artisans',
        bookings: 'Réservations',
      };
      doc.text(sectionTitles[sectionName] || sectionName, 14, yOffset);
      yOffset += 10;

      // Table
      const headers = Object.keys(sectionData[0]);
      const rows = sectionData.map((item) => headers.map((h) => String(item[h] || '')));

      autoTable(doc, {
        startY: yOffset,
        head: [headers],
        body: rows,
        theme: 'striped',
        headStyles: {
          fillColor: [16, 185, 129],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        margin: { left: 14, right: 14 },
      });
    }
  });

  doc.save(`${filename}.pdf`);
}
