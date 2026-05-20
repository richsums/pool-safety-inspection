import type { DraftMeta, DraftData, InspectionState } from '../types';
import { CHECKLIST_SECTIONS } from '../checklistData';
import { QUICK_CHECK_GROUPS } from './quickCheckData';

const DRAFT_PREFIX = 'pool-inspection-draft-';

function calcProgress(state: Partial<InspectionState>): number {
  if (!state) return 0;
  if (state.inspectionType === null && state.quickCheckState) {
    // Quick check
    const items = Object.values(state.quickCheckState.items ?? {});
    if (!items.length) return 0;
    return Math.round(items.filter(i => i.observed !== null).length / items.length * 100);
  } else if (state.items) {
    const items = Object.values(state.items);
    if (!items.length) return 0;
    return Math.round(items.filter(i => i.result !== null).length / items.length * 100);
  }
  return 0;
}

function getAddress(state: Partial<InspectionState>): string {
  if (state.quickCheckState?.propertyInfo?.propertyAddress) {
    return state.quickCheckState.propertyInfo.propertyAddress;
  }
  return state.propertyInfo?.propertyAddress ?? '';
}

export function listDrafts(): DraftMeta[] {
  try {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(DRAFT_PREFIX))
      .map(key => {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) return null;
          const d: DraftData = JSON.parse(raw);
          return { key: d.key, inspectionType: d.inspectionType, propertyAddress: d.propertyAddress, savedAt: d.savedAt, percentComplete: d.percentComplete };
        } catch { return null; }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b!.savedAt).getTime() - new Date(a!.savedAt).getTime()) as DraftMeta[];
  } catch { return []; }
}

export function saveDraft(state: Partial<InspectionState>, existingKey?: string): string {
  const key = existingKey ?? `${DRAFT_PREFIX}${Date.now()}`;
  const isQC = !!state.quickCheckState && !state.inspectionType;
  const draft: DraftData = {
    key,
    inspectionType: isQC ? 'quick-check' : (state.inspectionType ?? null),
    propertyAddress: getAddress(state),
    savedAt: new Date().toISOString(),
    percentComplete: calcProgress(state),
    state,
  };
  localStorage.setItem(key, JSON.stringify(draft));
  return key;
}

export function loadDraft(key: string): DraftData | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as DraftData;
  } catch { return null; }
}

export function deleteDraft(key: string): void {
  localStorage.removeItem(key);
}

export function draftLabel(meta: DraftMeta): string {
  const addr = meta.propertyAddress?.trim();
  const typeLabel: Record<string, string> = {
    commercial: 'Commercial',
    'real-estate': 'Real Estate',
    homeowner: 'Homeowner',
    'quick-check': 'Quick Check',
  };
  const type = meta.inspectionType ? typeLabel[meta.inspectionType] ?? meta.inspectionType : 'Draft';
  return addr ? `${addr}` : `${type} — Draft`;
}

// Compute total checklist items for a given inspection type
export function totalItemCount(inspectionType: string | null): number {
  if (inspectionType === 'quick-check') {
    return QUICK_CHECK_GROUPS.reduce((sum, g) => sum + g.items.length, 0);
  }
  return CHECKLIST_SECTIONS.filter(s => !s.commercialOnly || inspectionType === 'commercial')
    .reduce((sum, s) => sum + s.items.length, 0);
}
