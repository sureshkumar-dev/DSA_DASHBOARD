import type {
  AppState, LevelId, LeetCodeProblem, RevisionItem,
  ExerciseAttempt, AssessmentAttempt
} from '../types';
import { calculateUnlockStatus } from '../engine/unlockEngine';

export type Action =
  | { type: 'COMPLETE_TOPIC'; topicId: string }
  | { type: 'UNCOMPLETE_TOPIC'; topicId: string }
  | { type: 'SUBMIT_EXERCISE'; exerciseId: string; attempt: ExerciseAttempt }
  | { type: 'SUBMIT_ASSESSMENT'; assessmentId: string; attempt: AssessmentAttempt }
  | { type: 'SET_CURRENT_LEVEL'; levelId: LevelId }
  | { type: 'SET_ACTIVE_PHASE'; phaseId: string | null }
  | { type: 'SET_ACTIVE_TOPIC'; topicId: string | null }
  | { type: 'SET_ACTIVE_EXERCISE'; exerciseId: string | null }
  | { type: 'SET_BOOKMARK'; topicId: string; bookmarked: boolean }
  | { type: 'SET_NOTE'; topicId: string; note: string }
  | { type: 'SET_LAST_STUDIED'; id: string }
  | { type: 'ADD_LEETCODE_PROBLEM'; problem: LeetCodeProblem }
  | { type: 'UPDATE_LEETCODE_PROBLEM'; problem: LeetCodeProblem }
  | { type: 'DELETE_LEETCODE_PROBLEM'; id: string }
  | { type: 'ADD_REVISION_ITEM'; item: RevisionItem }
  | { type: 'COMPLETE_REVISION_ITEM'; id: string }
  | { type: 'RESTORE_BACKUP'; state: AppState }
  | { type: 'RESET_ALL' };

function recalculateLevels(state: AppState): AppState {
  const unlockStatus = calculateUnlockStatus(state);
  const newLevels = { ...state.levels };
  for (const [levelId, status] of Object.entries(unlockStatus)) {
    const id = levelId as LevelId;
    newLevels[id] = {
      ...newLevels[id],
      unlocked: status.unlocked,
    };
  }
  return { ...state, levels: newLevels };
}

export function reducer(state: AppState, action: Action): AppState {
  let newState: AppState;

  switch (action.type) {
    case 'COMPLETE_TOPIC': {
      newState = {
        ...state,
        topics: {
          ...state.topics,
          [action.topicId]: {
            ...state.topics[action.topicId],
            topicId: action.topicId,
            completed: true,
            completedAt: new Date().toISOString(),
          },
        },
      };
      return recalculateLevels(newState);
    }

    case 'UNCOMPLETE_TOPIC': {
      newState = {
        ...state,
        topics: {
          ...state.topics,
          [action.topicId]: {
            ...state.topics[action.topicId],
            topicId: action.topicId,
            completed: false,
            completedAt: undefined,
          },
        },
      };
      return recalculateLevels(newState);
    }

    case 'SUBMIT_EXERCISE': {
      const existing = state.exercises[action.exerciseId];
      const attempts = [...(existing?.attempts ?? []), action.attempt];
      const bestScore = Math.max(...attempts.map(a => a.score / a.total * 100));
      const passed = attempts.some(a => a.passed);
      newState = {
        ...state,
        exercises: {
          ...state.exercises,
          [action.exerciseId]: {
            exerciseId: action.exerciseId,
            attempts,
            bestScore,
            passed,
            lastCode: action.attempt.code,
          },
        },
      };
      return recalculateLevels(newState);
    }

    case 'SUBMIT_ASSESSMENT': {
      const existing = state.assessments[action.assessmentId];
      const attempts = [...(existing?.attempts ?? []), action.attempt];
      const bestScore = Math.max(...attempts.map(a => a.score));
      const passed = attempts.some(a => a.passed);
      newState = {
        ...state,
        assessments: {
          ...state.assessments,
          [action.assessmentId]: {
            assessmentId: action.assessmentId,
            attempts,
            bestScore,
            passed,
          },
        },
      };
      return recalculateLevels(newState);
    }

    case 'SET_CURRENT_LEVEL':
      return { ...state, currentLevel: action.levelId };

    case 'SET_ACTIVE_PHASE':
      return { ...state, activePhaseId: action.phaseId };

    case 'SET_ACTIVE_TOPIC':
      return { ...state, activeTopicId: action.topicId };

    case 'SET_ACTIVE_EXERCISE':
      return { ...state, activeExerciseId: action.exerciseId };

    case 'SET_BOOKMARK':
      return {
        ...state,
        topics: {
          ...state.topics,
          [action.topicId]: {
            ...state.topics[action.topicId],
            topicId: action.topicId,
            completed: state.topics[action.topicId]?.completed ?? false,
            bookmarked: action.bookmarked,
          },
        },
      };

    case 'SET_NOTE':
      return {
        ...state,
        topics: {
          ...state.topics,
          [action.topicId]: {
            ...state.topics[action.topicId],
            topicId: action.topicId,
            completed: state.topics[action.topicId]?.completed ?? false,
            notes: action.note,
          },
        },
      };

    case 'SET_LAST_STUDIED':
      return { ...state, lastStudied: action.id };

    case 'ADD_LEETCODE_PROBLEM':
      return { ...state, leetcodeProblems: [...state.leetcodeProblems, action.problem] };

    case 'UPDATE_LEETCODE_PROBLEM':
      return {
        ...state,
        leetcodeProblems: state.leetcodeProblems.map(p =>
          p.id === action.problem.id ? action.problem : p
        ),
      };

    case 'DELETE_LEETCODE_PROBLEM':
      return {
        ...state,
        leetcodeProblems: state.leetcodeProblems.filter(p => p.id !== action.id),
      };

    case 'ADD_REVISION_ITEM':
      return { ...state, revisionItems: [...state.revisionItems, action.item] };

    case 'COMPLETE_REVISION_ITEM':
      return {
        ...state,
        revisionItems: state.revisionItems.map(r =>
          r.id === action.id ? { ...r, completed: true } : r
        ),
      };

    case 'RESTORE_BACKUP':
      return recalculateLevels(action.state);

    case 'RESET_ALL':
      return {
        ...state,
        topics: {},
        exercises: {},
        assessments: {},
        levels: {
          beginner: { levelId: 'beginner', unlocked: true, completed: false, finalAssessmentPassed: false },
          intermediate: { levelId: 'intermediate', unlocked: false, completed: false, finalAssessmentPassed: false },
          advanced: { levelId: 'advanced', unlocked: false, completed: false, finalAssessmentPassed: false },
          interviewMaster: { levelId: 'interviewMaster', unlocked: false, completed: false, finalAssessmentPassed: false },
        },
        currentLevel: 'beginner',
        lastStudied: null,
      };

    default:
      return state;
  }
}
