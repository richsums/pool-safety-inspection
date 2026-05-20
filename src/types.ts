export type InspectionType = 'commercial' | 'real-estate' | 'homeowner';
export type CheckResult = 'pass' | 'fail' | 'na' | null;
export type Severity = 'minor' | 'moderate' | 'critical';
export type OverallRating = 'excellent' | 'good' | 'fair' | 'poor';

export interface PhotoAttachment {
  id: string;
  dataUrl: string;
  caption?: string;
}

export interface CheckItem {
  id: string;
  result: CheckResult;
  notes: string;
  severity?: Severity;
  photos: PhotoAttachment[];
}

export interface PropertyInfo {
  inspectorName: string;
  inspectorLicense: string;
  inspectionDate: string;
  propertyAddress: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  poolType: string;
  poolShape: string;
  poolSize: string;
  poolAge: string;
  lastInspectionDate: string;
  notes: string;
}

export interface WaterQualityReadings {
  chlorine: string;
  ph: string;
  totalAlkalinity: string;
  calciumHardness: string;
  cyanuricAcid: string;
  combinedChlorine: string;
  filterPsi: string;
}

export interface SectionI {
  overallRating: OverallRating | '';
  immediateActions: string;
  recommendedFollowUp: string;
  additionalObservations: string;
  nextInspectionDate: string;
}

export interface InspectionState {
  inspectionType: InspectionType | null;
  propertyInfo: PropertyInfo;
  waterQuality: WaterQualityReadings;
  sectionI: SectionI;
  items: Record<string, CheckItem>;
  inspectorSignature: string;
  clientSignature: string;
  lastSaved: string | null;
  quickCheckState: QuickCheckState | null;
  currentDraftKey: string | null;
}

// ─── Quick Safety Check ───────────────────────────────────────────────────────

export type QuickCheckObserved = 'observed' | 'not-observed' | 'na' | null;
export type QuickCheckPriority = 'urgent' | 'recommended' | 'advisory' | '';

export interface QuickCheckItem {
  id: string;
  observed: QuickCheckObserved;
  severity: Severity;
  notes: string;
  photos: PhotoAttachment[];
  recommendedAction: string;
  reading?: string;
}

export interface QuickCheckPropertyInfo {
  clientName: string;
  propertyAddress: string;
  techName: string;
  date: string;
  clientEmail: string;
  clientPhone: string;
}

export interface QuickCheckState {
  propertyInfo: QuickCheckPropertyInfo;
  items: Record<string, QuickCheckItem>;
  techSignature: string;
}

// ─── Drafts ───────────────────────────────────────────────────────────────────

export interface DraftMeta {
  key: string;
  inspectionType: string | null;
  propertyAddress: string;
  savedAt: string;
  percentComplete: number;
}

export interface DraftData extends DraftMeta {
  state: Partial<InspectionState>;
}
