export { beginnerLevel } from './beginner';
export { intermediateLevel } from './intermediate';
export { advancedLevel } from './advanced';
export { interviewMasterLevel } from './interviewMaster';
import { beginnerLevel } from './beginner';
import { intermediateLevel } from './intermediate';
import { advancedLevel } from './advanced';
import { interviewMasterLevel } from './interviewMaster';
import type { Level, LevelId } from '../types';

export const CURRICULUM_VERSION = '1.0.0';

export const ALL_LEVELS: Level[] = [
  beginnerLevel,
  intermediateLevel,
  advancedLevel,
  interviewMasterLevel,
];

export const LEVELS_MAP: Record<LevelId, Level> = {
  beginner: beginnerLevel,
  intermediate: intermediateLevel,
  advanced: advancedLevel,
  interviewMaster: interviewMasterLevel,
};

export const LEVEL_ORDER: LevelId[] = ['beginner','intermediate','advanced','interviewMaster'];
