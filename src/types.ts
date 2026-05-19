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
}
