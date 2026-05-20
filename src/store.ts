import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  InspectionState, InspectionType, CheckResult, Severity,
  PhotoAttachment, PropertyInfo, WaterQualityReadings, SectionI, CheckItem,
  QuickCheckState, QuickCheckPropertyInfo, QuickCheckObserved,
} from './types';
import { CHECKLIST_SECTIONS } from './checklistData';
import { buildDefaultQuickCheckItems } from './utils/quickCheckData';

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
  chlorine: '', ph: '', totalAlkalinity: '',
  calciumHardness: '', cyanuricAcid: '',
  combinedChlorine: '', filterPsi: '',
};

const defaultSectionI: SectionI = {
  overallRating: '', immediateActions: '',
  recommendedFollowUp: '', additionalObservations: '',
  nextInspectionDate: '',
};

const defaultQuickCheckPropertyInfo: QuickCheckPropertyInfo = {
  clientName: '', propertyAddress: '', techName: '',
  date: new Date().toISOString().split('T')[0],
  clientEmail: '', clientPhone: '',
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

function buildDefaultQuickCheckState(): QuickCheckState {
  return {
    propertyInfo: { ...defaultQuickCheckPropertyInfo, date: new Date().toISOString().split('T')[0] },
    items: buildDefaultQuickCheckItems(),
    techSignature: '',
  };
}

interface Actions {
  // Full inspection
  setInspectionType: (t: InspectionType | null) => void;
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
  // Quick check
  initQuickCheck: () => void;
  updateQuickCheckPropertyInfo: (updates: Partial<QuickCheckPropertyInfo>) => void;
  setQuickCheckItemObserved: (id: string, observed: QuickCheckObserved) => void;
  setQuickCheckItemNotes: (id: string, notes: string) => void;
  setQuickCheckItemSeverity: (id: string, severity: Severity) => void;
  setQuickCheckItemRecommendedAction: (id: string, action: string) => void;
  setQuickCheckItemReading: (id: string, reading: string) => void;
  addQuickCheckItemPhoto: (id: string, photo: PhotoAttachment) => void;
  removeQuickCheckItemPhoto: (id: string, photoId: string) => void;
  setQuickCheckTechSignature: (sig: string) => void;
  resetQuickCheck: () => void;
  // Drafts
  setCurrentDraftKey: (key: string | null) => void;
  loadFromState: (data: Partial<InspectionState>) => void;
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
  quickCheckState: null,
  currentDraftKey: null,
};

export const useStore = create<InspectionState & Actions>()(
  persist(
    (set) => ({
      ...initialState,

      // Full inspection
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
      resetInspection: () => set({ ...initialState, items: buildDefaultItems(), quickCheckState: null, currentDraftKey: null }),
      markSaved: () => set({ lastSaved: new Date().toISOString() }),

      // Quick check
      initQuickCheck: () => set({ quickCheckState: buildDefaultQuickCheckState(), inspectionType: null }),
      updateQuickCheckPropertyInfo: (updates) =>
        set((s) => ({
          quickCheckState: s.quickCheckState
            ? { ...s.quickCheckState, propertyInfo: { ...s.quickCheckState.propertyInfo, ...updates } }
            : null,
        })),
      setQuickCheckItemObserved: (id, observed) =>
        set((s) => ({
          quickCheckState: s.quickCheckState ? {
            ...s.quickCheckState,
            items: { ...s.quickCheckState.items, [id]: { ...s.quickCheckState.items[id], observed } },
          } : null,
        })),
      setQuickCheckItemNotes: (id, notes) =>
        set((s) => ({
          quickCheckState: s.quickCheckState ? {
            ...s.quickCheckState,
            items: { ...s.quickCheckState.items, [id]: { ...s.quickCheckState.items[id], notes } },
          } : null,
        })),
      setQuickCheckItemSeverity: (id, severity) =>
        set((s) => ({
          quickCheckState: s.quickCheckState ? {
            ...s.quickCheckState,
            items: { ...s.quickCheckState.items, [id]: { ...s.quickCheckState.items[id], severity } },
          } : null,
        })),
      setQuickCheckItemRecommendedAction: (id, action) =>
        set((s) => ({
          quickCheckState: s.quickCheckState ? {
            ...s.quickCheckState,
            items: { ...s.quickCheckState.items, [id]: { ...s.quickCheckState.items[id], recommendedAction: action } },
          } : null,
        })),
      setQuickCheckItemReading: (id, reading) =>
        set((s) => ({
          quickCheckState: s.quickCheckState ? {
            ...s.quickCheckState,
            items: { ...s.quickCheckState.items, [id]: { ...s.quickCheckState.items[id], reading } },
          } : null,
        })),
      addQuickCheckItemPhoto: (id, photo) =>
        set((s) => ({
          quickCheckState: s.quickCheckState ? {
            ...s.quickCheckState,
            items: { ...s.quickCheckState.items, [id]: { ...s.quickCheckState.items[id], photos: [...(s.quickCheckState.items[id].photos ?? []), photo] } },
          } : null,
        })),
      removeQuickCheckItemPhoto: (id, photoId) =>
        set((s) => ({
          quickCheckState: s.quickCheckState ? {
            ...s.quickCheckState,
            items: { ...s.quickCheckState.items, [id]: { ...s.quickCheckState.items[id], photos: s.quickCheckState.items[id].photos.filter(p => p.id !== photoId) } },
          } : null,
        })),
      setQuickCheckTechSignature: (sig) =>
        set((s) => ({ quickCheckState: s.quickCheckState ? { ...s.quickCheckState, techSignature: sig } : null })),
      resetQuickCheck: () => set({ quickCheckState: null }),

      // Drafts
      setCurrentDraftKey: (key) => set({ currentDraftKey: key }),
      loadFromState: (data) => set(data as Partial<InspectionState & Actions>),
    }),
    { name: 'vip-pools-inspection' }
  )
);
