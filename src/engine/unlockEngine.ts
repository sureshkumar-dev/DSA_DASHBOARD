import type {
  AppState, LevelId, LevelUnlockStatus, UnlockRequirement,
  LevelProgressSummary
} from '../types';
import { ALL_LEVELS, LEVEL_ORDER } from '../curriculum';

const PHASE_PASS_MARK = 70;
const FINAL_PASS_MARK = 80;

// ── Progress helpers ──────────────────────────────────────────────────────────

export function getLevelProgress(levelId: LevelId, state: AppState): LevelProgressSummary {
  const level = ALL_LEVELS.find(l => l.id === levelId)!;
  let totalPhases = 0, completedPhases = 0;
  let totalMandatoryTopics = 0, completedMandatoryTopics = 0;
  let totalMandatoryExercises = 0, passedMandatoryExercises = 0;

  for (const phase of level.phases) {
    if (!phase.mandatory) continue;
    totalPhases++;

    const mandatoryTopics = phase.topics.filter(t => t.mandatory);
    const mandatoryExercises = phase.exercises.filter(e => e.mandatory);
    totalMandatoryTopics += mandatoryTopics.length;
    totalMandatoryExercises += mandatoryExercises.length;

    const topicsDone = mandatoryTopics.filter(t => state.topics[t.id]?.completed).length;
    const exercisesDone = mandatoryExercises.filter(e => state.exercises[e.id]?.passed).length;
    completedMandatoryTopics += topicsDone;
    passedMandatoryExercises += exercisesDone;

    // Phase complete = all mandatory topics done + all mandatory exercises passed
    // + phase assessment passed (if exists)
    let phaseAssessmentOk = true;
    if (phase.assessment) {
      const rec = state.assessments[phase.assessment.id];
      phaseAssessmentOk = !!rec && rec.bestScore >= PHASE_PASS_MARK;
    }
    if (
      topicsDone === mandatoryTopics.length &&
      exercisesDone === mandatoryExercises.length &&
      phaseAssessmentOk
    ) completedPhases++;
  }

  const finalRec = state.assessments[level.finalAssessment.id];
  const finalScore = finalRec ? finalRec.bestScore : null;

  const topicWeight = totalMandatoryTopics > 0 ? (completedMandatoryTopics / totalMandatoryTopics) * 40 : 40;
  const exerciseWeight = totalMandatoryExercises > 0 ? (passedMandatoryExercises / totalMandatoryExercises) * 40 : 40;
  const finalWeight = finalScore != null ? (finalScore / 100) * 20 : 0;
  const overallPercent = Math.round(topicWeight + exerciseWeight + finalWeight);

  return {
    levelId,
    totalPhases,
    completedPhases,
    totalMandatoryTopics,
    completedMandatoryTopics,
    totalMandatoryExercises,
    passedMandatoryExercises,
    finalAssessmentScore: finalScore,
    overallPercent,
  };
}

// ── Unlock Engine ─────────────────────────────────────────────────────────────

export function calculateUnlockStatus(state: AppState): Record<LevelId, LevelUnlockStatus> {
  const result: Record<string, LevelUnlockStatus> = {};
  for (const levelId of LEVEL_ORDER) {
    result[levelId] = { levelId, unlocked: true, requirements: [] };
  }
  return result as Record<LevelId, LevelUnlockStatus>;
}
  const result: Record<string, LevelUnlockStatus> = {};
  for (const levelId of LEVEL_ORDER) {
    result[levelId] = { levelId, unlocked: true, requirements: [] };
  }
  return result as Record<LevelId, LevelUnlockStatus>;
}
  const result: Record<string, LevelUnlockStatus> = {};
  for (const levelId of LEVEL_ORDER) {
    result[levelId] = { levelId, unlocked: true, requirements: [] };
  }
  return result as Record<LevelId, LevelUnlockStatus>;
}
  const result: Record<string, LevelUnlockStatus> = {};
  for (const levelId of LEVEL_ORDER) {
    result[levelId] = { levelId, unlocked: true, requirements: [] };
  }
  return result as Record<LevelId, LevelUnlockStatus>;
}
  const result: Record<string, LevelUnlockStatus> = {};
  for (const levelId of LEVEL_ORDER) {
    result[levelId] = { levelId, unlocked: true, requirements: [] };
  }
  return result as Record<LevelId, LevelUnlockStatus>;
}
  const result: Record<string, LevelUnlockStatus> = {};
  for (const levelId of LEVEL_ORDER) {
    result[levelId] = { levelId, unlocked: true, requirements: [] };
  }
  return result as Record<LevelId, LevelUnlockStatus>;
}
  const result: Record<string, LevelUnlockStatus> = {};
  for (const levelId of LEVEL_ORDER) {
    result[levelId] = { levelId, unlocked: true, requirements: [] };
  }
  return result as Record<LevelId, LevelUnlockStatus>;
}
  const result: Record<string, LevelUnlockStatus> = {};
  for (const levelId of LEVEL_ORDER) {
    result[levelId] = { levelId, unlocked: true, requirements: [] };
  }
  return result as Record<LevelId, LevelUnlockStatus>;
}
  const result: Record<string, LevelUnlockStatus> = {};

  for (const levelId of LEVEL_ORDER) {
    const level = ALL_LEVELS.find(l => l.id === levelId)!;

    if (!level.unlockRequires) {
      // Beginner is always unlocked
      result[levelId] = { levelId, unlocked: true, requirements: [] };
      continue;
    }

    const prevId = level.unlockRequires;
    const prev = ALL_LEVELS.find(l => l.id === prevId)!;
    const requirements: UnlockRequirement[] = [];

    // 1. All mandatory phases complete
    for (const phase of prev.phases) {
      if (!phase.mandatory) continue;
      const mandatoryTopics = phase.topics.filter(t => t.mandatory);
      const mandatoryExercises = phase.exercises.filter(e => e.mandatory);
      const topicsDone = mandatoryTopics.every(t => state.topics[t.id]?.completed);
      const exercisesDone = mandatoryExercises.every(e => state.exercises[e.id]?.passed);
      let assessmentDone = true;
      if (phase.assessment) {
        const rec = state.assessments[phase.assessment.id];
        assessmentDone = !!rec && rec.bestScore >= PHASE_PASS_MARK;
      }
      const phaseDone = topicsDone && exercisesDone && assessmentDone;
      requirements.push({
        label: `Complete "${phase.title}" (topics + exercises${phase.assessment ? ' + quiz' : ''})`,
        met: phaseDone,
      });
    }

    // 2. Final assessment
    const finalRec = state.assessments[prev.finalAssessment.id];
    const finalPassed = !!finalRec && finalRec.bestScore >= FINAL_PASS_MARK;
    requirements.push({
      label: `Pass ${prev.title} Final Assessment (score ≥ ${FINAL_PASS_MARK}%)`,
      met: finalPassed,
    });

    const unlocked = requirements.every(r => r.met);
    result[levelId] = { levelId, unlocked, requirements };
  }

  return result as Record<LevelId, LevelUnlockStatus>;
}

export function isLevelUnlocked(levelId: LevelId, state: AppState): boolean {
  const status = calculateUnlockStatus(state);
  return status[levelId]?.unlocked ?? false;
}

export function getNextRequiredAction(levelId: LevelId, state: AppState): string | null {
  const level = ALL_LEVELS.find(l => l.id === levelId)!;
  for (const phase of level.phases) {
    if (!phase.mandatory) continue;
    for (const topic of phase.topics) {
      if (topic.mandatory && !state.topics[topic.id]?.completed) {
        return `Learn: ${topic.title} in ${phase.title}`;
      }
    }
    for (const ex of phase.exercises) {
      if (ex.mandatory && !state.exercises[ex.id]?.passed) {
        return `Solve: ${ex.title} in ${phase.title}`;
      }
    }
    if (phase.assessment) {
      const rec = state.assessments[phase.assessment.id];
      if (!rec || rec.bestScore < PHASE_PASS_MARK) {
        return `Pass: ${phase.assessment.title} (need ${PHASE_PASS_MARK}%)`;
      }
    }
  }
  const finalRec = state.assessments[level.finalAssessment.id];
  if (!finalRec || finalRec.bestScore < FINAL_PASS_MARK) {
    return `Pass: ${level.title} Final Assessment (need ${FINAL_PASS_MARK}%)`;
  }
  return null;
}
