import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InspectionState, InspectionType, CheckResult, Severity, PhotoAttachment, PropertyInfo, WaterQualityReadings, SectionI, CheckItem } from './types';
import { CHECKLIST_SECTIONS } from './checklistData';

const defaultPropertyInfo: PropertyInfo = {
  inspectorName: '',
  inspectorLicense: '',
  inspectionDate: new Date().toISOString().split('T')[0],
  propertyAddress: '',
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  poolType: 'Residential',
  poolShape: 'Rectangular',
  poolSize: '',
  poolAge: '',
  lastInspectionDate: '',
  notes: '',
};

const defaultWaterQuality: WaterQualityReadings = {
  chlorine: '',
  ph: '',
  totalAlkalinity: '',
  calciumHardness: '',
  cyanuricAcid: '',
  combinedChlorine: '',
  filterPsi: '',
};

const defaultSectionI: SectionI = {
  overallRating: '',
  immediateActions: '',
  recommendedFollowUp: '',
  additionalObservations: '',
  nextInspectionDate: '',
};

function buildDefaultItems(): Record<string, CheckItem> {
  const items: Record<string, CheckItem> = {};
  for (const section of CHECKLIST_SECTIONS) {
    for (const item of section.items) {
      items[item.id] = { id: item.id, result: null, notes: '', photos: [] };
    }
  }
  return items;
}

interface Actions {
  setInspectionType: (t: InspectionType) => void;
  updatePropertyInfo: (updates: Partial<PropertyInfo>) => void;
  updateWaterQuality: (updates: Partial<WaterQualityReadings>) => void;
  updateSectionI: (updates: Partial<SectionI>) => void;
  setItemResult: (id: string, result: CheckResult) => void;
  setItemNotes: (id: string, notes: string) => void;
  setItemSeverity: (id: string, severity: Severity) => void;
  addItemPhoto: (id: string, photo: PhotoAttachment) => void;
  removeItemPhoto: (id: string, photoId: string) => void;
  setInspectorSignature: (sig: string) => void;
  setClientSignature: (sig: string) => void;
  resetInspection: () => void;
  markSaved: () => void;
}

const initialState: InspectionState = {
  inspectionType: null,
  propertyInfo: defaultPropertyInfo,
  waterQuality: defaultWaterQuality,
  sectionI: defaultSectionI,
  items: buildDefaultItems(),
  inspectorSignature: '',
  clientSignature: '',
  lastSaved: null,
};

export const useStore = create<InspectionState & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setInspectionType: (t) => set({ inspectionType: t }),
      updatePropertyInfo: (updates) =>
        set((s) => ({ propertyInfo: { ...s.propertyInfo, ...updates } })),
      updateWaterQuality: (updates) =>
        set((s) => ({ waterQuality: { ...s.waterQuality, ...updates } })),
      updateSectionI: (updates) =>
        set((s) => ({ sectionI: { ...s.sectionI, ...updates } })),
      setItemResult: (id, result) =>
        set((s) => ({ items: { ...s.items, [id]: { ...s.items[id], result } } })),
      setItemNotes: (id, notes) =>
        set((s) => ({ items: { ...s.items, [id]: { ...s.items[id], notes } } })),
      setItemSeverity: (id, severity) =>
        set((s) => ({ items: { ...s.items, [id]: { ...s.items[id], severity } } })),
      addItemPhoto: (id, photo) =>
        set((s) => ({ items: { ...s.items, [id]: { ...s.items[id], photos: [...s.items[id].photos, photo] } } })),
      removeItemPhoto: (id, photoId) =>
        set((s) => ({ items: { ...s.items, [id]: { ...s.items[id], photos: s.items[id].photos.filter(p => p.id !== photoId) } } })),
      setInspectorSignature: (sig) => set({ inspectorSignature: sig }),
      setClientSignature: (sig) => set({ clientSignature: sig }),
      resetInspection: () => set({ ...initialState, items: buildDefaultItems() }),
      markSaved: () => set({ lastSaved: new Date().toISOString() }),
    }),
    { name: 'vip-pools-inspection' }
  )
);
