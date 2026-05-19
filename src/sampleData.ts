import type { CheckResult, Severity } from './types';

type StoreActions = {
  setInspectionType: (t: any) => void;
  updatePropertyInfo: (u: any) => void;
  updateWaterQuality: (u: any) => void;
  setItemResult: (id: string, r: CheckResult) => void;
  setItemSeverity: (id: string, s: Severity) => void;
  setItemNotes: (id: string, n: string) => void;
  updateSectionI: (u: any) => void;
};

export function applySampleData(store: StoreActions) {
  store.setInspectionType('commercial');
  store.updatePropertyInfo({
    inspectorName: 'James Hartley',
    inspectorLicense: 'CPO-CA-12345',
    inspectionDate: new Date().toISOString().split('T')[0],
    propertyAddress: '1234 Beachside Drive, Pismo Beach, CA 93449',
    clientName: 'Coastal Resorts LLC',
    clientEmail: 'manager@coastalresorts.com',
    clientPhone: '(805) 555-0177',
    poolType: 'Hotel',
    poolShape: 'Rectangular',
    poolSize: '50,000 gallons',
    poolAge: '12',
    lastInspectionDate: '2025-11-15',
    notes: 'Outdoor heated pool, operated year-round. Guest count averages 80/day in summer.',
  });
  store.updateWaterQuality({
    chlorine: '2.4',
    ph: '7.5',
    totalAlkalinity: '95',
    calciumHardness: '280',
    cyanuricAcid: '40',
    combinedChlorine: '0.1',
    filterPsi: '18',
  });

  const passIds = ['A1','A2','A3','A4','A5','A6','B1','B2','B3','B4','B5','B7','B8','B9','B10','C1','C2','C7','C8','D1','D2','D3','D4','D5','D6','D7','D11','E1','E2','E4','E7','E9','E10','F1','F3','F8','F9','G1','G2','G3','G4','G5','G6','G9','G10','H1','H2','H3','H4'];
  const naIds = ['A8','B6','F5','F7','G7','G8','H5','H7','H8','H9'];

  for (const id of passIds) store.setItemResult(id, 'pass');
  for (const id of naIds) store.setItemResult(id, 'na');

  store.setItemResult('A7', 'fail');
  store.setItemSeverity('A7', 'moderate');
  store.setItemNotes('A7', 'Pool cover present but not ASTM F1346 certified. Manual cover, not motorized.');

  store.setItemResult('C3', 'fail');
  store.setItemSeverity('C3', 'critical');
  store.setItemNotes('C3', 'Single main drain observed. No dual drain or SVRS device confirmed. Requires immediate remediation per VGB Act.');

  store.setItemResult('C4', 'fail');
  store.setItemSeverity('C4', 'critical');
  store.setItemNotes('C4', 'No SVRS installed. Must be installed prior to reopening pool.');

  store.setItemResult('E3', 'fail');
  store.setItemSeverity('E3', 'moderate');
  store.setItemNotes('E3', 'North light fixture shows minor corrosion on exterior ring. Gasket appears intact but should be replaced within 30 days.');

  store.setItemResult('F2', 'pass');
  store.setItemNotes('F2', 'Sand filter, running at 18 PSI. Normal range 15-25 PSI.');

  store.setItemResult('H6', 'fail');
  store.setItemSeverity('H6', 'minor');
  store.setItemNotes('H6', 'Safety plan binder present but not posted. Should be displayed prominently in pool office.');

  store.updateSectionI({
    overallRating: 'fair',
    immediateActions: '1. Install SVRS or dual drain system (C3, C4) — CRITICAL, pool should not operate until resolved.\n2. Schedule licensed electrician to inspect underwater light fixture (E3).',
    recommendedFollowUp: '1. Replace pool cover with ASTM F1346 certified motorized safety cover within 60 days.\n2. Post safety plan prominently in pool office area.\n3. Schedule next inspection for November 2026.',
    additionalObservations: "Overall the facility is well-maintained. Chemical readings are within acceptable ranges. Equipment pad is clean and organized. Recommend installing a second set of safety equipment (life ring, shepherd's crook) at the east end of the pool.",
    nextInspectionDate: '2026-11-15',
  });
}
