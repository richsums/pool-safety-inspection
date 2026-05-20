import jsPDF from 'jspdf';
import type { InspectionState, WaterQualityReadings } from '../types';
import { CHECKLIST_SECTIONS } from '../checklistData';

const BLUE = '#1B3D8F';
const GOLD = '#F5A623';
const DARK = '#1e3a5f';

function hex2rgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export async function generatePDF(
  store: InspectionState & Record<string, unknown>,
  returnBlob = false
): Promise<Blob | void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const { propertyInfo, waterQuality, sectionI, items, inspectorSignature, clientSignature, inspectionType } = store;

  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  let y = 0;

  const addPage = () => { doc.addPage(); y = 20; };
  const checkNewPage = (needed: number) => { if (y + needed > ph - 20) addPage(); };

  // === COVER PAGE ===
  doc.setFillColor(...hex2rgb(BLUE));
  doc.rect(0, 0, pw, 45, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('VIP POOLS', pw / 2, 18, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('CENTRAL COAST CALIFORNIA', pw / 2, 25, { align: 'center' });

  doc.setFillColor(...hex2rgb(GOLD));
  doc.rect(0, 42, pw, 3, 'F');

  doc.setTextColor(...hex2rgb(DARK));
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('SWIMMING POOL SAFETY', pw / 2, 65, { align: 'center' });
  doc.text('INSPECTION REPORT', pw / 2, 75, { align: 'center' });

  const typeLabels: Record<string, string> = {
    commercial: 'Commercial Pool Inspection',
    'real-estate': 'Real Estate Sale Inspection',
    homeowner: 'Homeowner Safety Audit',
  };
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(typeLabels[(inspectionType as string) || 'homeowner'] || '', pw / 2, 85, { align: 'center' });

  const ratingColors: Record<string, string> = {
    excellent: '#16a34a', good: '#ca8a04', fair: '#ea580c', poor: '#dc2626',
  };
  if (sectionI.overallRating) {
    const rc = ratingColors[sectionI.overallRating] || '#888';
    doc.setFillColor(...hex2rgb(rc));
    doc.roundedRect(pw / 2 - 30, 90, 60, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Overall: ${sectionI.overallRating.toUpperCase()}`, pw / 2, 98, { align: 'center' });
  }

  // Property details box
  doc.setDrawColor(...hex2rgb(BLUE));
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 108, pw - 30, 70, 3, 3);
  doc.setTextColor(...hex2rgb(DARK));
  doc.setFontSize(9);

  const infoRows: [string, string][] = [
    ['Property Address', propertyInfo.propertyAddress],
    ['Client', propertyInfo.clientName],
    ['Client Email', propertyInfo.clientEmail],
    ['Client Phone', propertyInfo.clientPhone],
    ['Inspector', propertyInfo.inspectorName + (propertyInfo.inspectorLicense ? ` (CPO: ${propertyInfo.inspectorLicense})` : '')],
    ['Inspection Date', propertyInfo.inspectionDate],
    ['Pool Type', propertyInfo.poolType],
    ['Pool Size', propertyInfo.poolSize],
  ];

  let iy = 116;
  for (const [label, value] of infoRows) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hex2rgb(DARK));
    doc.text(label + ':', 20, iy);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(value || '—', 70, iy);
    iy += 7;
  }

  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text('VIP Pools — Swimming Pool Safety Inspection · California Health & Safety Code §115922', pw / 2, ph - 10, { align: 'center' });

  // === CHECKLIST PAGES ===
  addPage();

  const sectionsToShow = CHECKLIST_SECTIONS.filter(s => !s.commercialOnly || inspectionType === 'commercial');

  for (const section of sectionsToShow) {
    checkNewPage(15);
    doc.setFillColor(...hex2rgb(BLUE));
    doc.rect(10, y, pw - 20, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, 15, y + 5.5);
    y += 12;

    for (const itemDef of section.items) {
      const item = (items as Record<string, any>)[itemDef.id];
      if (!item) continue;
      const result = item.result;

      checkNewPage(12);

      const icon = result === 'pass' ? '✓' : result === 'fail' ? '✗' : result === 'na' ? '—' : '□';
      const iconColor: [number, number, number] = result === 'pass' ? [22, 163, 74] : result === 'fail' ? [220, 38, 38] : [150, 150, 150];
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...iconColor);
      doc.text(icon, 14, y + 3);

      doc.setTextColor(...hex2rgb(DARK));
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(itemDef.label, pw - 50) as string[];
      doc.text(lines, 22, y + 3);

      if (result === 'fail' && item.severity) {
        const sc: Record<string, [number, number, number]> = {
          minor: [234, 179, 8], moderate: [234, 88, 12], critical: [220, 38, 38],
        };
        const sc2 = sc[item.severity] || [150, 150, 150] as [number, number, number];
        doc.setFillColor(...sc2);
        doc.roundedRect(pw - 45, y - 1, 30, 6, 1, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text(item.severity.toUpperCase(), pw - 30, y + 3.5, { align: 'center' });
      }

      y += lines.length * 4 + 3;

      if (itemDef.waterQualityField) {
        const wqVal = (waterQuality as WaterQualityReadings)[itemDef.waterQualityField];
        if (wqVal) {
          checkNewPage(6);
          doc.setTextColor(80, 80, 80);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'italic');
          doc.text(`  Measured: ${wqVal}`, 22, y);
          y += 5;
        }
      }

      if (item.notes) {
        checkNewPage(8);
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'italic');
        const noteLines = doc.splitTextToSize(`Notes: ${item.notes}`, pw - 35) as string[];
        doc.text(noteLines, 22, y);
        y += noteLines.length * 4 + 2;
      }

      if (item.photos && item.photos.length > 0) {
        checkNewPage(35);
        let px = 22;
        for (const photo of item.photos.slice(0, 4)) {
          try {
            doc.addImage(photo.dataUrl, 'JPEG', px, y, 30, 25);
            px += 33;
            if (px > pw - 30) { px = 22; y += 28; checkNewPage(30); }
          } catch { /* skip bad image */ }
        }
        y += 28;
      }

      y += 2;
    }
    y += 5;
  }

  // === SUMMARY PAGE ===
  addPage();

  doc.setFillColor(...hex2rgb(BLUE));
  doc.rect(0, 0, pw, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('INSPECTION SUMMARY', pw / 2, 13, { align: 'center' });
  y = 28;

  if (sectionI.immediateActions) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(252, 165, 165);
    doc.roundedRect(10, y, pw - 20, 5, 1, 1);
    doc.setTextColor(153, 27, 27);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('IMMEDIATE ACTION REQUIRED', 14, y + 3.5);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...hex2rgb(DARK));
    const lines = doc.splitTextToSize(sectionI.immediateActions, pw - 30) as string[];
    doc.text(lines, 14, y);
    y += lines.length * 4 + 6;
  }

  if (sectionI.recommendedFollowUp) {
    doc.setTextColor(...hex2rgb(DARK));
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommended Follow-Up', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const lines = doc.splitTextToSize(sectionI.recommendedFollowUp, pw - 30) as string[];
    doc.text(lines, 14, y);
    y += lines.length * 4 + 8;
  }

  if (sectionI.additionalObservations) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Additional Observations', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const lines = doc.splitTextToSize(sectionI.additionalObservations, pw - 30) as string[];
    doc.text(lines, 14, y);
    y += lines.length * 4 + 8;
  }

  if (inspectorSignature || clientSignature) {
    y += 5;
    doc.setDrawColor(...hex2rgb(BLUE));
    doc.setLineWidth(0.3);
    doc.line(10, y, pw - 10, y);
    y += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hex2rgb(DARK));
    doc.text('SIGNATURES', pw / 2, y, { align: 'center' });
    y += 8;

    const sigY = y;
    if (inspectorSignature) {
      try {
        doc.addImage(inspectorSignature, 'PNG', 15, sigY, 60, 25);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`Inspector: ${propertyInfo.inspectorName}`, 15, sigY + 28);
        doc.text(`Date: ${propertyInfo.inspectionDate}`, 15, sigY + 33);
        doc.line(15, sigY + 26, 75, sigY + 26);
      } catch { /* skip */ }
    }
    if (clientSignature) {
      try {
        doc.addImage(clientSignature, 'PNG', pw / 2 + 5, sigY, 60, 25);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`Client: ${propertyInfo.clientName}`, pw / 2 + 5, sigY + 28);
        doc.text(`Date: ${propertyInfo.inspectionDate}`, pw / 2 + 5, sigY + 33);
        doc.line(pw / 2 + 5, sigY + 26, pw / 2 + 65, sigY + 26);
      } catch { /* skip */ }
    }
    y = sigY + 40;
  }

  y += 5;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 120, 120);
  const disclaimer = 'This report represents conditions observed on the date of inspection only. It is not a warranty or guarantee of future performance. Conditions may change after the date of inspection. VIP Pools recommends regular professional inspections to maintain pool safety and compliance.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pw - 30) as string[];
  doc.text(disclaimerLines, 15, y);

  // Page numbers
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${totalPages}`, pw - 15, ph - 8, { align: 'right' });
    doc.text('VIP Pools — Swimming Pool Safety Inspection', 15, ph - 8);
  }

  if (returnBlob) {
    return doc.output('blob');
  } else {
    const filename = `VIPPools-Inspection-${propertyInfo.propertyAddress.replace(/[^a-z0-9]/gi, '_').slice(0, 30)}-${propertyInfo.inspectionDate}.pdf`;
    doc.save(filename);
  }
}
