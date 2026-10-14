import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { AppState, LevelId, LevelUnlockStatus } from '../types';
import { reducer, type Action } from './reducer';
import { loadState, saveState } from './storageAdapter';
import { calculateUnlockStatus, getLevelProgress, getNextRequiredAction } from '../engine/unlockEngine';
import type { LevelProgressSummary } from '../types';

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  unlockStatus: Record<LevelId, LevelUnlockStatus>;
  getLevelProgressSummary: (levelId: LevelId) => LevelProgressSummary;
  getNextAction: (levelId: LevelId) => string | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  // Persist to localStorage on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const unlockStatus = calculateUnlockStatus(state);

  const getLevelProgressSummary = useCallback(
    (levelId: LevelId) => getLevelProgress(levelId, state),
    [state]
  );

  const getNextAction = useCallback(
    (levelId: LevelId) => getNextRequiredAction(levelId, state),
    [state]
  );

  return (
    <AppContext.Provider value={{ state, dispatch, unlockStatus, getLevelProgressSummary, getNextAction }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
