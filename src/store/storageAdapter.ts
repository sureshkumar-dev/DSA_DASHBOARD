import type { AppState, LevelId, LevelRecord } from '../types';
import { CURRICULUM_VERSION } from '../curriculum';

const STORAGE_KEY = 'dsa_dashboard_v1';

const DEFAULT_LEVEL_RECORD = (levelId: LevelId, unlocked: boolean): LevelRecord => ({
  levelId,
  unlocked,
  completed: false,
  finalAssessmentPassed: false,
});

export const DEFAULT_STATE: AppState = {
  version: CURRICULUM_VERSION,
  currentLevel: 'beginner',
  activePhaseId: null,
  activeTopicId: null,
  activeExerciseId: null,
  levels: {
    beginner: DEFAULT_LEVEL_RECORD('beginner', true),
    intermediate: DEFAULT_LEVEL_RECORD('intermediate', false),
    advanced: DEFAULT_LEVEL_RECORD('advanced', false),
    interviewMaster: DEFAULT_LEVEL_RECORD('interviewMaster', false),
  },
  topics: {},
  exercises: {},
  assessments: {},
  lastStudied: null,
  leetcodeProblems: [],
  revisionItems: [],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as AppState;
    // Merge with defaults to handle new fields across versions
    return {
      ...DEFAULT_STATE,
      ...parsed,
      levels: { ...DEFAULT_STATE.levels, ...parsed.levels },
      topics: parsed.topics || {},
      exercises: parsed.exercises || {},
      assessments: parsed.assessments || {},
      leetcodeProblems: parsed.leetcodeProblems || [],
      revisionItems: parsed.revisionItems || [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail if storage is full
  }
}

export function exportBackup(state: AppState): string {
  const backup = {
    meta: {
      exportedAt: new Date().toISOString(),
      version: CURRICULUM_VERSION,
      app: 'DSA Zero-to-Hero Dashboard',
    },
    state,
  };
  return JSON.stringify(backup, null, 2);
}

export interface ImportResult {
  success: boolean;
  state?: AppState;
  error?: string;
}

export function importBackup(json: string): ImportResult {
  try {
    const backup = JSON.parse(json);
    if (!backup.state) {
      return { success: false, error: 'Invalid backup: missing state field' };
    }
    const state = backup.state as AppState;
    // Validate required fields
    if (!state.currentLevel || !state.levels) {
      return { success: false, error: 'Invalid backup: missing required state fields' };
    }
    // Warn about version mismatch but still import
    const restored: AppState = {
      ...DEFAULT_STATE,
      ...state,
      version: CURRICULUM_VERSION, // always use current version
      levels: { ...DEFAULT_STATE.levels, ...state.levels },
      topics: state.topics || {},
      exercises: state.exercises || {},
      assessments: state.assessments || {},
      leetcodeProblems: state.leetcodeProblems || [],
      revisionItems: state.revisionItems || [],
    };
    return { success: true, state: restored };
  } catch (e) {
    return { success: false, error: `Parse error: ${String(e)}` };
  }
}

export function downloadBackup(state: AppState): void {
  const json = exportBackup(state);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dsa-dashboard-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
