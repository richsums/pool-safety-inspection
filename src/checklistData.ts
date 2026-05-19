import type { WaterQualityReadings } from './types';

export interface ChecklistItemDef {
  id: string;
  label: string;
  hint?: string;
  waterQualityField?: keyof WaterQualityReadings;
}

export interface SectionDef {
  id: string;
  title: string;
  items: ChecklistItemDef[];
  commercialOnly?: boolean;
}

export const CHECKLIST_SECTIONS: SectionDef[] = [
  {
    id: 'A',
    title: 'Section A — Barrier & Enclosure Requirements',
    items: [
      { id: 'A1', label: 'Pool barrier (fence/wall) minimum 60 inches high on all sides' },
      { id: 'A2', label: 'No gaps, openings, or handholds/footholds in barrier that allow climbing' },
      { id: 'A3', label: 'All gates are self-closing and self-latching' },
      { id: 'A4', label: 'Gate latch is on pool side of gate, minimum 54 inches from bottom or enclosed' },
      { id: 'A5', label: 'No direct access from house to pool area without barrier gate' },
      { id: 'A6', label: 'Barrier free of damage, rot, rust, or structural compromise' },
      { id: 'A7', label: 'Pool cover (if present): ASTM F1346 compliant motorized safety cover' },
      { id: 'A8', label: 'Pool cover operates fully without obstruction' },
      { id: 'A9', label: 'Distance from top of barrier to grade is no more than 2 inches at bottom' },
    ],
  },
  {
    id: 'B',
    title: 'Section B — Water Safety Equipment',
    items: [
      { id: 'B1', label: 'Reaching pole present and accessible (minimum 12 ft)' },
      { id: 'B2', label: 'Life ring/throw rope present and accessible' },
      { id: 'B3', label: "Life hook/shepherd's crook present and accessible (commercial: required)" },
      { id: 'B4', label: 'First aid kit present and stocked' },
      { id: 'B5', label: 'AED (defibrillator) present (commercial required; residential recommended)' },
      { id: 'B6', label: 'Emergency phone or call box accessible at pool deck (commercial required)' },
      { id: 'B7', label: 'Safety signage visible: "No Lifeguard on Duty," "No Diving," depth markers' },
      { id: 'B8', label: 'Pool depth markers visible at all changes in depth' },
      { id: 'B9', label: '"No Diving" markers at shallow end (< 5 ft)' },
      { id: 'B10', label: 'Emergency shutoff for circulation pump accessible and labeled' },
    ],
  },
  {
    id: 'C',
    title: 'Section C — Drain & Suction Safety',
    items: [
      { id: 'C1', label: 'Main drains have ANSI/ASME A112.19.8 compliant anti-entrapment covers' },
      { id: 'C2', label: 'Anti-entrapment covers are not cracked, broken, or missing screws' },
      { id: 'C3', label: 'Dual main drain system OR approved anti-entrapment device installed' },
      { id: 'C4', label: 'SVRS (Safety Vacuum Release System) installed and tested' },
      { id: 'C5', label: 'No flat grates over suction outlets (must be dome or approved profile)' },
      { id: 'C6', label: 'All suction outlet covers inspected for suction entrapment hazard' },
      { id: 'C7', label: 'Skimmer baskets clean and in place' },
      { id: 'C8', label: 'Pump strainer basket clean and in place' },
    ],
  },
  {
    id: 'D',
    title: 'Section D — Water Quality & Chemical Safety',
    items: [
      { id: 'D1', label: 'Free chlorine level: 1.0–3.0 ppm (commercial: 2.0–4.0 ppm)', hint: 'Record measured value', waterQualityField: 'chlorine' },
      { id: 'D2', label: 'pH level: 7.4–7.6', hint: 'Record measured value', waterQualityField: 'ph' },
      { id: 'D3', label: 'Total alkalinity: 80–120 ppm', hint: 'Record measured value', waterQualityField: 'totalAlkalinity' },
      { id: 'D4', label: 'Calcium hardness: 200–400 ppm', hint: 'Record measured value', waterQualityField: 'calciumHardness' },
      { id: 'D5', label: 'Cyanuric acid (stabilizer): 30–50 ppm outdoor / 0 ppm indoor', hint: 'Record measured value', waterQualityField: 'cyanuricAcid' },
      { id: 'D6', label: 'Combined chlorine (chloramines): < 0.2 ppm', hint: 'Record measured value', waterQualityField: 'combinedChlorine' },
      { id: 'D7', label: 'Water clarity: can clearly see main drain from pool deck' },
      { id: 'D8', label: 'Chemical storage area secure, locked, and ventilated' },
      { id: 'D9', label: 'Chemicals stored separately (oxidizers away from chlorine)' },
      { id: 'D10', label: 'SDS/MSDS sheets available for all chemicals (commercial required)' },
      { id: 'D11', label: 'Test kit or test strips on site and within expiry' },
    ],
  },
  {
    id: 'E',
    title: 'Section E — Electrical Safety (NEC 680 / California Title 24)',
    items: [
      { id: 'E1', label: 'All electrical outlets within 20 ft of pool are GFCI protected' },
      { id: 'E2', label: 'All pool lighting is low-voltage (< 15V) or approved line voltage with GFCI' },
      { id: 'E3', label: 'Underwater lights: lens intact, no corrosion, gasket seal intact' },
      { id: 'E4', label: 'Pool pump motor properly bonded and grounded' },
      { id: 'E5', label: 'Bonding wire visible and intact at pump, heater, and handrail connections' },
      { id: 'E6', label: 'No overhead electrical wires within 10 ft horizontally or 22.5 ft vertically of pool' },
      { id: 'E7', label: 'No extension cords in use near pool area' },
      { id: 'E8', label: 'Pool heater electrical connections: no corrosion, no exposed wiring' },
      { id: 'E9', label: 'Electrical panel for pool equipment: labeled, accessible, no moisture intrusion' },
      { id: 'E10', label: 'GFCI outlets tested and confirmed operational' },
    ],
  },
  {
    id: 'F',
    title: 'Section F — Equipment & Mechanical',
    items: [
      { id: 'F1', label: 'Circulation pump operational, no unusual noise or vibration' },
      { id: 'F2', label: 'Filter system: pressure within normal range', hint: 'Record filter type and PSI', waterQualityField: 'filterPsi' },
      { id: 'F3', label: 'Filter pressure gauge operational and reading correctly' },
      { id: 'F4', label: 'Backwash valve (if applicable): operational, no leaks' },
      { id: 'F5', label: 'Pool heater (if present): operational, no gas leaks, flue clear' },
      { id: 'F6', label: 'Automatic chlorinator/feeder: operational, properly set' },
      { id: 'F7', label: 'Pool sweep/cleaner (if present): operational' },
      { id: 'F8', label: 'Timer for pump: operational, set to run minimum 6–8 hrs/day' },
      { id: 'F9', label: 'All valves accessible and operational' },
      { id: 'F10', label: 'No visible leaks at equipment pad' },
    ],
  },
  {
    id: 'G',
    title: 'Section G — Pool Structure & Deck',
    items: [
      { id: 'G1', label: 'Pool deck free of trip hazards, cracks, or uneven surfaces' },
      { id: 'G2', label: 'Pool deck slip-resistant surface in good condition' },
      { id: 'G3', label: 'Coping (pool edge) intact, no broken or loose tiles/coping stones' },
      { id: 'G4', label: 'Pool interior surface: no cracks, delamination, staining, or rough spots' },
      { id: 'G5', label: 'Steps and ladders: secure, slip-resistant treads in good condition' },
      { id: 'G6', label: 'Handrails present and secure at steps (required if > 24 inches depth)' },
      { id: 'G7', label: 'Diving board (if present): properly mounted, non-slip surface, no cracks' },
      { id: 'G8', label: 'Slide (if present): properly anchored, no sharp edges' },
      { id: 'G9', label: 'Pool lights: all operational, no moisture inside fixture' },
      { id: 'G10', label: 'Deck drains operational, no standing water on deck' },
    ],
  },
  {
    id: 'H',
    title: 'Section H — Commercial-Only Requirements',
    commercialOnly: true,
    items: [
      { id: 'H1', label: 'Current health department permit posted' },
      { id: 'H2', label: 'Operator log / chemical test records on site (last 30 days)' },
      { id: 'H3', label: 'CPO (Certified Pool Operator) name and certification on file' },
      { id: 'H4', label: 'Bather load posted (maximum occupancy)' },
      { id: 'H5', label: 'Lifeguard requirements met per county regulations' },
      { id: 'H6', label: 'Safety plan posted and accessible to staff' },
      { id: 'H7', label: 'Pool closed and locked when not supervised (if no lifeguard)' },
      { id: 'H8', label: 'Drowning incident response plan posted' },
      { id: 'H9', label: 'Inspection records available for last 2 years' },
    ],
  },
];
