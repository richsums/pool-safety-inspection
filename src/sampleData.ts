import type { CheckResult, Severity } from './types';
type StoreActions = {
  setInspectionType: (t: any) => void;
  updatePropertyInfo: (u: any) => void;
  updateWaterQuality: (u: any) => void;
  setItemResult: (id: string, r: CheckResult) => void;
  setItemSeverity: (id: string, s: Severity) => void;
  setItemNotes: (id: string, n: string) => void;
  addItemPhoto: (id: string, p: { id: string; dataUrl: string }) => void;
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
  store.addItemPhoto('A7', { id: 'sample-a7-photo', dataUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzJkNGEyZCIvPjxyYWRpYWxHcmFkaWVudCBpZD0idmlnIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI3MCUiPjxzdG9wIG9mZnNldD0iNjAlIiBzdG9wLWNvbG9yPSJ0cmFuc3BhcmVudCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iYmxhY2siIHN0b3Atb3BhY2l0eT0iMC40NSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjdmlnKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTMwIiBmb250LXNpemU9IjY0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7wn4+KPC90ZXh0PjxyZWN0IHg9IjIwIiB5PSIxNjUiIHdpZHRoPSIzNjAiIGhlaWdodD0iMzgiIHJ4PSI0IiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjYiLz48dGV4dCB4PSIyMDAiIHk9IjE4OSIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwgc2Fucy1zZXJpZiI+UG9vbCBDb3ZlciAtIE5PVCBBU1RNIEYxMzQ2IENlcnRpZmllZDwvdGV4dD48cmVjdCB4PSIyMCIgeT0iMjA4IiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjI4IiByeD0iNCIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC40Ii8+PHRleHQgeD0iMjAwIiB5PSIyMjciIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmMGYwZjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCBzYW5zLXNlcmlmIj5NYW51YWwgY292ZXIgcHJlc2VudC4gTm8gbW90b3JpemVkIHNhZmV0eSBtZWNoYW5pc20uPC90ZXh0PjxyZWN0IHg9IjAiIHk9IjI2NSIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzNSIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC43Ii8+PHRleHQgeD0iMTAiIHk9IjI4NyIgZm9udC1zaXplPSIxMSIgZmlsbD0iIzAwZmY4OCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSI+MjAyNi0wNS0xOSAwOToxNDoyMiAgQ0FNLTE8L3RleHQ+PHRleHQgeD0iMzkwIiB5PSIyODciIGZvbnQtc2l6ZT0iMTEiIGZpbGw9IiNmZmNjMDAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIHRleHQtYW5jaG9yPSJlbmQiPlZJUCBQT09MUzwvdGV4dD48L3N2Zz4=` });

  store.setItemResult('C3', 'fail');
  store.setItemSeverity('C3', 'critical');
  store.setItemNotes('C3', 'Single main drain observed. No dual drain or SVRS device confirmed. Requires immediate remediation per VGB Act.');
  store.addItemPhoto('C3', { id: 'sample-c3-photo', dataUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRhMWExYSIvPjxyYWRpYWxHcmFkaWVudCBpZD0idmlnIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI3MCUiPjxzdG9wIG9mZnNldD0iNjAlIiBzdG9wLWNvbG9yPSJ0cmFuc3BhcmVudCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iYmxhY2siIHN0b3Atb3BhY2l0eT0iMC40NSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjdmlnKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTMwIiBmb250LXNpemU9IjY0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7imqA8L3RleHQ+PHJlY3QgeD0iMjAiIHk9IjE2NSIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIzOCIgcng9IjQiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNiIvPjx0ZXh0IHg9IjIwMCIgeT0iMTg5IiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCBzYW5zLXNlcmlmIj5TSU5HTEUgTUFJTiBEUkFJTiAtIFZHQiBOb24tQ29tcGxpYW50PC90ZXh0PjxyZWN0IHg9IjIwIiB5PSIyMDgiIHdpZHRoPSIzNjAiIGhlaWdodD0iMjgiIHJ4PSI0IiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjQiLz48dGV4dCB4PSIyMDAiIHk9IjIyNyIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2YwZjBmMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIHNhbnMtc2VyaWYiPk5vIGR1YWwgZHJhaW4gb3IgU1ZSUyBvYnNlcnZlZC4gQ1JJVElDQUwgSEFaQVJELjwvdGV4dD48cmVjdCB4PSIwIiB5PSIyNjUiIHdpZHRoPSI0MDAiIGhlaWdodD0iMzUiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNyIvPjx0ZXh0IHg9IjEwIiB5PSIyODciIGZvbnQtc2l6ZT0iMTEiIGZpbGw9IiMwMGZmODgiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiPjIwMjYtMDUtMTkgMDk6MzE6MDUgIENBTS0yPC90ZXh0Pjx0ZXh0IHg9IjM5MCIgeT0iMjg3IiBmb250LXNpemU9IjExIiBmaWxsPSIjZmZjYzAwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiB0ZXh0LWFuY2hvcj0iZW5kIj5WSVAgUE9PTFM8L3RleHQ+PC9zdmc+` });

  store.setItemResult('C4', 'fail');
  store.setItemSeverity('C4', 'critical');
  store.setItemNotes('C4', 'No SVRS installed. Must be installed prior to reopening pool.');
  store.addItemPhoto('C4', { id: 'sample-c4-photo', dataUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRhMWExYSIvPjxyYWRpYWxHcmFkaWVudCBpZD0idmlnIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI3MCUiPjxzdG9wIG9mZnNldD0iNjAlIiBzdG9wLWNvbG9yPSJ0cmFuc3BhcmVudCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iYmxhY2siIHN0b3Atb3BhY2l0eT0iMC40NSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjdmlnKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTMwIiBmb250LXNpemU9IjY0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7wn5qrPC90ZXh0PjxyZWN0IHg9IjIwIiB5PSIxNjUiIHdpZHRoPSIzNjAiIGhlaWdodD0iMzgiIHJ4PSI0IiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjYiLz48dGV4dCB4PSIyMDAiIHk9IjE4OSIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwgc2Fucy1zZXJpZiI+Tk8gU1ZSUyBERVZJQ0UgSU5TVEFMTEVEPC90ZXh0PjxyZWN0IHg9IjIwIiB5PSIyMDgiIHdpZHRoPSIzNjAiIGhlaWdodD0iMjgiIHJ4PSI0IiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjQiLz48dGV4dCB4PSIyMDAiIHk9IjIyNyIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2YwZjBmMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIHNhbnMtc2VyaWYiPlNhZmV0eSBWYWN1dW0gUmVsZWFzZSBTeXN0ZW0gYWJzZW50LiBQb29sIG11c3Qgbm90IG9wZXJhdGUuPC90ZXh0PjxyZWN0IHg9IjAiIHk9IjI2NSIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzNSIgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMC43Ii8+PHRleHQgeD0iMTAiIHk9IjI4NyIgZm9udC1zaXplPSIxMSIgZmlsbD0iIzAwZmY4OCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSI+MjAyNi0wNS0xOSAwOTozMzo0NCAgQ0FNLTI8L3RleHQ+PHRleHQgeD0iMzkwIiB5PSIyODciIGZvbnQtc2l6ZT0iMTEiIGZpbGw9IiNmZmNjMDAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIHRleHQtYW5jaG9yPSJlbmQiPlZJUCBQT09MUzwvdGV4dD48L3N2Zz4=` });

  store.setItemResult('E3', 'fail');
  store.setItemSeverity('E3', 'moderate');
  store.setItemNotes('E3', 'North light fixture shows minor corrosion on exterior ring. Gasket appears intact but should be replaced within 30 days.');
  store.addItemPhoto('E3', { id: 'sample-e3-photo', dataUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFhMmE0YSIvPjxyYWRpYWxHcmFkaWVudCBpZD0idmlnIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI3MCUiPjxzdG9wIG9mZnNldD0iNjAlIiBzdG9wLWNvbG9yPSJ0cmFuc3BhcmVudCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iYmxhY2siIHN0b3Atb3BhY2l0eT0iMC40NSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjdmlnKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTMwIiBmb250LXNpemU9IjY0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7wn5KhPC90ZXh0PjxyZWN0IHg9IjIwIiB5PSIxNjUiIHdpZHRoPSIzNjAiIGhlaWdodD0iMzgiIHJ4PSI0IiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjYiLz48dGV4dCB4PSIyMDAiIHk9IjE4OSIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwgc2Fucy1zZXJpZiI+VW5kZXJ3YXRlciBMaWdodCAtIENvcnJvc2lvbiBvbiBGaXh0dXJlIFJpbmc8L3RleHQ+PHJlY3QgeD0iMjAiIHk9IjIwOCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIyOCIgcng9IjQiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjx0ZXh0IHg9IjIwMCIgeT0iMjI3IiBmb250LXNpemU9IjEyIiBmaWxsPSIjZjBmMGYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwgc2Fucy1zZXJpZiI+Tm9ydGggbGlnaHQuIEV4dGVyaW9yIHJpbmcgY29ycm9zaW9uLiBHYXNrZXQgaW50YWN0LjwvdGV4dD48cmVjdCB4PSIwIiB5PSIyNjUiIHdpZHRoPSI0MDAiIGhlaWdodD0iMzUiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNyIvPjx0ZXh0IHg9IjEwIiB5PSIyODciIGZvbnQtc2l6ZT0iMTEiIGZpbGw9IiMwMGZmODgiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiPjIwMjYtMDUtMTkgMTA6MDI6MTcgIENBTS0zPC90ZXh0Pjx0ZXh0IHg9IjM5MCIgeT0iMjg3IiBmb250LXNpemU9IjExIiBmaWxsPSIjZmZjYzAwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiB0ZXh0LWFuY2hvcj0iZW5kIj5WSVAgUE9PTFM8L3RleHQ+PC9zdmc+` });

  store.setItemResult('H6', 'fail');
  store.setItemSeverity('H6', 'minor');
  store.setItemNotes('H6', 'Safety plan binder present but not posted. Should be displayed prominently in pool office.');
  store.addItemPhoto('H6', { id: 'sample-h6-photo', dataUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzNhMmExYSIvPjxyYWRpYWxHcmFkaWVudCBpZD0idmlnIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI3MCUiPjxzdG9wIG9mZnNldD0iNjAlIiBzdG9wLWNvbG9yPSJ0cmFuc3BhcmVudCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iYmxhY2siIHN0b3Atb3BhY2l0eT0iMC40NSIvPjwvcmFkaWFsR3JhZGllbnQ+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjdmlnKSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTMwIiBmb250LXNpemU9IjY0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj7wn5OLPC90ZXh0PjxyZWN0IHg9IjIwIiB5PSIxNjUiIHdpZHRoPSIzNjAiIGhlaWdodD0iMzgiIHJ4PSI0IiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjYiLz48dGV4dCB4PSIyMDAiIHk9IjE4OSIgZm9udC1zaXplPSIxNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwgc2Fucy1zZXJpZiI+U2FmZXR5IFBsYW4gLSBOb3QgUG9zdGVkPC90ZXh0PjxyZWN0IHg9IjIwIiB5PSIyMDgiIHdpZHRoPSIzNjAiIGhlaWdodD0iMjgiIHJ4PSI0IiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjQiLz48dGV4dCB4PSIyMDAiIHk9IjIyNyIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2YwZjBmMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIHNhbnMtc2VyaWYiPkJpbmRlciBpbiBzdG9yYWdlLiBOb3QgZGlzcGxheWVkIGluIHBvb2wgb2ZmaWNlLjwvdGV4dD48cmVjdCB4PSIwIiB5PSIyNjUiIHdpZHRoPSI0MDAiIGhlaWdodD0iMzUiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNyIvPjx0ZXh0IHg9IjEwIiB5PSIyODciIGZvbnQtc2l6ZT0iMTEiIGZpbGw9IiMwMGZmODgiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiPjIwMjYtMDUtMTkgMTA6NDU6MzMgIENBTS00PC90ZXh0Pjx0ZXh0IHg9IjM5MCIgeT0iMjg3IiBmb250LXNpemU9IjExIiBmaWxsPSIjZmZjYzAwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiB0ZXh0LWFuY2hvcj0iZW5kIj5WSVAgUE9PTFM8L3RleHQ+PC9zdmc+` });

  store.setItemResult('F2', 'pass');
  store.setItemNotes('F2', 'Sand filter, running at 18 PSI. Normal range 15-25 PSI.');

  store.updateSectionI({
    overallRating: 'fair',
    immediateActions: '1. Install SVRS or dual drain system (C3, C4) — CRITICAL, pool should not operate until resolved.\n2. Schedule licensed electrician to inspect underwater light fixture (E3).',
    recommendedFollowUp: '1. Replace pool cover with ASTM F1346 certified motorized safety cover within 60 days.\n2. Post safety plan prominently in pool office area.\n3. Schedule next inspection for November 2026.',
    additionalObservations: `Overall the facility is well-maintained. Chemical readings are within acceptable ranges. Equipment pad is clean and organized. Recommend installing a second set of safety equipment (life ring, shepherd's crook) at the east end of the pool.`,
    nextInspectionDate: '2026-11-15',
  });
}
