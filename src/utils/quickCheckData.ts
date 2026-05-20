import type { Severity } from '../types';

export interface QuickCheckItemDef {
  id: string;
  label: string;
  defaultSeverity: Severity;
  recommendedAction: string;
  hasReading?: boolean; // e.g. chlorine ppm, pH
  readingLabel?: string;
}

export interface QuickCheckGroupDef {
  id: string;
  title: string;
  defaultSeverity: Severity;
  items: QuickCheckItemDef[];
}

export const QUICK_CHECK_GROUPS: QuickCheckGroupDef[] = [
  {
    id: 'G1',
    title: 'Group 1 — Immediate Safety Concerns',
    defaultSeverity: 'critical',
    items: [
      {
        id: 'QC-G1-1',
        label: 'Anti-entrapment drain cover: missing, cracked, or unsecured',
        defaultSeverity: 'critical',
        recommendedAction: 'Replace immediately — entrapment hazard per Virginia Graeme Baker Act',
      },
      {
        id: 'QC-G1-2',
        label: 'Safety barrier / fence: damaged, missing section, or gate not latching',
        defaultSeverity: 'critical',
        recommendedAction: 'Repair required per CA Health & Safety Code §115922',
      },
      {
        id: 'QC-G1-3',
        label: 'Electrical hazard observed (describe in notes)',
        defaultSeverity: 'critical',
        recommendedAction: 'Consult licensed electrician immediately — electrical hazard near water',
      },
      {
        id: 'QC-G1-4',
        label: 'GFCI outlet not functioning',
        defaultSeverity: 'critical',
        recommendedAction: 'Replace GFCI outlet — electrical hazard near water',
      },
      {
        id: 'QC-G1-5',
        label: 'No reaching pole or life ring accessible at pool',
        defaultSeverity: 'critical',
        recommendedAction: 'Install reaching pole (min 12 ft) and life ring/throw rope immediately',
      },
    ],
  },
  {
    id: 'G2',
    title: 'Group 2 — Water Safety',
    defaultSeverity: 'moderate',
    items: [
      {
        id: 'QC-G2-1',
        label: 'Chlorine level out of safe range',
        defaultSeverity: 'moderate',
        recommendedAction: 'Balance chlorine to 1–4 ppm. Schedule service visit.',
        hasReading: true,
        readingLabel: 'Measured (ppm)',
      },
      {
        id: 'QC-G2-2',
        label: 'pH out of range',
        defaultSeverity: 'moderate',
        recommendedAction: 'Adjust pH to 7.4–7.6. Schedule service visit.',
        hasReading: true,
        readingLabel: 'Measured',
      },
      {
        id: 'QC-G2-3',
        label: 'Water clarity impaired — cannot see main drain',
        defaultSeverity: 'moderate',
        recommendedAction: 'Pool should not be used. Schedule water clarification service.',
      },
      {
        id: 'QC-G2-4',
        label: 'Algae present',
        defaultSeverity: 'moderate',
        recommendedAction: 'Algae treatment required. Schedule service visit.',
      },
    ],
  },
  {
    id: 'G3',
    title: 'Group 3 — Equipment Issues',
    defaultSeverity: 'minor',
    items: [
      {
        id: 'QC-G3-1',
        label: 'Pump not operating or making unusual noise',
        defaultSeverity: 'moderate',
        recommendedAction: 'Diagnose and repair pump. Pool circulation required for water safety.',
      },
      {
        id: 'QC-G3-2',
        label: 'Filter pressure high — backwash/clean needed',
        defaultSeverity: 'minor',
        recommendedAction: 'Backwash or clean filter media. Schedule service.',
      },
      {
        id: 'QC-G3-3',
        label: 'Heater malfunction observed',
        defaultSeverity: 'minor',
        recommendedAction: 'Heater inspection and repair recommended.',
      },
      {
        id: 'QC-G3-4',
        label: 'Pool sweep / cleaner not functioning',
        defaultSeverity: 'minor',
        recommendedAction: 'Pool cleaner service or replacement recommended.',
      },
    ],
  },
  {
    id: 'G4',
    title: 'Group 4 — Structural & Deck',
    defaultSeverity: 'minor',
    items: [
      {
        id: 'QC-G4-1',
        label: 'Cracked or loose coping / tile',
        defaultSeverity: 'moderate',
        recommendedAction: 'Repair coping/tile to prevent injury and water damage.',
      },
      {
        id: 'QC-G4-2',
        label: 'Trip hazard on deck',
        defaultSeverity: 'moderate',
        recommendedAction: 'Address trip hazard — liability and injury risk.',
      },
      {
        id: 'QC-G4-3',
        label: 'Handrail loose or missing',
        defaultSeverity: 'moderate',
        recommendedAction: 'Secure or install handrail — required for safe pool entry/exit.',
      },
      {
        id: 'QC-G4-4',
        label: 'Pool surface rough or delaminating',
        defaultSeverity: 'minor',
        recommendedAction: 'Resurface recommended to prevent injury and maintain water quality.',
      },
    ],
  },
];

export function buildDefaultQuickCheckItems(): Record<string, import('../types').QuickCheckItem> {
  const items: Record<string, import('../types').QuickCheckItem> = {};
  for (const group of QUICK_CHECK_GROUPS) {
    for (const itemDef of group.items) {
      items[itemDef.id] = {
        id: itemDef.id,
        observed: null,
        severity: itemDef.defaultSeverity,
        notes: '',
        photos: [],
        recommendedAction: itemDef.recommendedAction,
        reading: '',
      };
    }
  }
  return items;
}

export function computeQuickCheckPriority(items: Record<string, import('../types').QuickCheckItem>): import('../types').QuickCheckPriority {
  const observed = Object.values(items).filter(i => i.observed === 'observed');
  if (observed.some(i => i.severity === 'critical')) return 'urgent';
  if (observed.some(i => i.severity === 'moderate')) return 'recommended';
  if (observed.some(i => i.severity === 'minor')) return 'advisory';
  return '';
}
