import jsPDF from 'jspdf';
import type { QuickCheckState, Severity } from '../types';
import { QUICK_CHECK_GROUPS, computeQuickCheckPriority } from './quickCheckData';

const BLUE = '#1B3D8F';
const GOLD = '#F5A623';
const DARK = '#1e3a5f';

function hex2rgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

const severityColors: Record<Severity, string> = {
  critical: '#DC2626',
  moderate: '#EA580C',
  minor: '#CA8A04',
};

export async function generateQuickCheckPdf(qc: QuickCheckState): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  let y = 0;

  const addPage = () => { doc.addPage(); y = 20; };
  const checkY = (needed: number) => { if (y + needed > ph - 20) addPage(); };

  const priority = computeQuickCheckPriority(qc.items);
  const observedItems = Object.values(qc.items).filter(i => i.observed === 'observed');
  const hasCritical = observedItems.some(i => i.severity === 'critical');
  const allItemDefs = QUICK_CHECK_GROUPS.flatMap(g => g.items);

  // ─── HEADER ──────────────────────────────────────────────────────────────
  doc.setFillColor(...hex2rgb(BLUE));
  doc.rect(0, 0, pw, 42, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('VIP POOLS', pw / 2, 14, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('CENTRAL COAST CALIFORNIA', pw / 2, 20, { align: 'center' });

  doc.setFillColor(...hex2rgb(GOLD));
  doc.rect(0, 39, pw, 2.5, 'F');

  doc.setTextColor(...hex2rgb(DARK));
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('SWIMMING POOL SAFETY DEFICIENCY NOTICE', pw / 2, 54, { align: 'center' });

  y = 62;

  // ─── PROPERTY INFO ────────────────────────────────────────────────────────
  doc.setDrawColor(...hex2rgb(BLUE));
  doc.setLineWidth(0.4);
  doc.roundedRect(10, y, pw - 20, 36, 2, 2);

  const infoRows: [string, string][] = [
    ['Client', qc.propertyInfo.clientName],
    ['Property', qc.propertyInfo.propertyAddress],
    ['Service Tech', qc.propertyInfo.techName],
    ['Date', qc.propertyInfo.date],
    ['Email', qc.propertyInfo.clientEmail],
    ['Phone', qc.propertyInfo.clientPhone],
  ];

  let iy = y + 8;
  const col2 = pw / 2 + 5;
  for (let i = 0; i < infoRows.length; i++) {
    const [label, value] = infoRows[i];
    const x = i % 2 === 0 ? 15 : col2;
    if (i % 2 === 0 && i > 0) iy += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...hex2rgb(DARK));
    doc.text(`${label}:`, x, iy);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(value || '—', x + (i % 2 === 0 ? 22 : 18), iy);
  }

  y += 40;

  // ─── CRITICAL CALLOUT ─────────────────────────────────────────────────────
  if (hasCritical) {
    checkY(18);
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(1);
    doc.roundedRect(10, y, pw - 20, 14, 2, 2, 'FD');
    doc.setTextColor(153, 27, 27);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠  IMMEDIATE ACTION REQUIRED — CRITICAL SAFETY ISSUES OBSERVED', pw / 2, y + 9, { align: 'center' });
    y += 18;
    doc.setLineWidth(0.4);
  }

  // ─── DEFICIENCY TABLE ─────────────────────────────────────────────────────
  checkY(20);

  // Table header
  doc.setFillColor(...hex2rgb(BLUE));
  doc.rect(10, y, pw - 20, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DEFICIENCY ITEM', 14, y + 5.5);
  doc.text('SEVERITY', pw - 70, y + 5.5);
  doc.text('NOTES', pw - 50, y + 5.5);
  y += 10;

  for (const group of QUICK_CHECK_GROUPS) {
    const groupObserved = group.items.filter(def => qc.items[def.id]?.observed === 'observed');
    if (groupObserved.length === 0) continue;

    checkY(9);
    doc.setFillColor(239, 246, 255);
    doc.rect(10, y, pw - 20, 7, 'F');
    doc.setTextColor(...hex2rgb(BLUE));
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(group.title, 14, y + 4.5);
    y += 9;

    for (const itemDef of group.items) {
      const item = qc.items[itemDef.id];
      if (!item || item.observed !== 'observed') continue;

      const sevColor = hex2rgb(severityColors[item.severity]);
      const labelLines = doc.splitTextToSize(itemDef.label, pw - 80) as string[];
      const rowH = Math.max(10, labelLines.length * 4.5 + 4);

      checkY(rowH);

      // Row background
      doc.setFillColor(253, 253, 253);
      doc.rect(10, y, pw - 20, rowH, 'F');
      doc.setDrawColor(230, 230, 230);
      doc.line(10, y + rowH, pw - 10, y + rowH);

      // Item label
      doc.setTextColor(...hex2rgb(DARK));
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text(labelLines, 14, y + 5);

      // Severity badge
      doc.setFillColor(...sevColor);
      doc.roundedRect(pw - 72, y + 2, 22, 6, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.text(item.severity.toUpperCase(), pw - 61, y + 6.5, { align: 'center' });

      // Notes / reading
      const noteText = [item.reading ? `Measured: ${item.reading}` : '', item.notes].filter(Boolean).join(' · ');
      if (noteText) {
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'italic');
        doc.text(doc.splitTextToSize(noteText, pw - 90) as string[], pw - 47, y + 5);
      }

      y += rowH;

      // Recommended action
      if (item.recommendedAction) {
        checkY(8);
        doc.setFillColor(239, 246, 255);
        doc.rect(12, y, pw - 24, 7, 'F');
        doc.setTextColor(...hex2rgb(BLUE));
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'italic');
        const recLines = doc.splitTextToSize(`→ ${item.recommendedAction}`, pw - 32) as string[];
        doc.text(recLines, 16, y + 4.5);
        y += 9;
      }

      // Photos
      if (item.photos && item.photos.length > 0) {
        checkY(32);
        let px = 14;
        for (const photo of item.photos.slice(0, 3)) {
          try {
            doc.addImage(photo.dataUrl, 'JPEG', px, y, 28, 22);
            px += 30;
          } catch { /* skip */ }
        }
        y += 25;
      }

      y += 2;
    }
    y += 3;
  }

  // ─── REPAIR QUOTE CTA ─────────────────────────────────────────────────────
  checkY(20);
  doc.setFillColor(...hex2rgb(GOLD));
  doc.roundedRect(10, y, pw - 20, 16, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Contact VIP Pools to schedule repairs', pw / 2, y + 7, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('info@vippools.com  |  Central Coast California', pw / 2, y + 13, { align: 'center' });
  y += 20;

  // ─── SIGNATURE ────────────────────────────────────────────────────────────
  if (qc.techSignature) {
    checkY(35);
    doc.setTextColor(...hex2rgb(DARK));
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Technician Signature', 14, y + 6);
    try {
      doc.addImage(qc.techSignature, 'PNG', 14, y + 8, 60, 20);
    } catch { /* skip */ }
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(qc.propertyInfo.techName, 14, y + 31);
    doc.text(`Date: ${qc.propertyInfo.date}`, 14, y + 36);
    doc.line(14, y + 29, 74, y + 29);
    y += 40;
  }

  // ─── DISCLAIMER ───────────────────────────────────────────────────────────
  checkY(16);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(130, 130, 130);
  const disclaimer = `This notice documents safety observations made during routine service on ${qc.propertyInfo.date}. VIP Pools recommends prompt remediation of all noted deficiencies. This notice does not constitute a warranty or guarantee.`;
  doc.text(doc.splitTextToSize(disclaimer, pw - 28) as string[], 14, y);

  // ─── PAGE NUMBERS ─────────────────────────────────────────────────────────
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(170, 170, 170);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${totalPages}`, pw - 14, ph - 8, { align: 'right' });
    doc.text('VIP Pools — Pool Safety Deficiency Notice', 14, ph - 8);
  }

  const addr = qc.propertyInfo.propertyAddress?.replace(/[^a-z0-9]/gi, '_').slice(0, 30) || 'QuickCheck';
  doc.save(`VIPPools-QuickCheck-${addr}-${qc.propertyInfo.date}.pdf`);
}
