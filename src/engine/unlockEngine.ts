import type {
  AppState,
  LevelId,
  LevelUnlockStatus,
  LevelProgressSummary,
} from '../types';

import { ALL_LEVELS, LEVEL_ORDER } from '../curriculum';

const PHASE_PASS_MARK = 70;
const FINAL_PASS_MARK = 80;

// ── Progress Helpers ──────────────────────────────────────────────────────────

export function getLevelProgress(
  levelId: LevelId,
  state: AppState
): LevelProgressSummary {
  const level = ALL_LEVELS.find((l) => l.id === levelId)!;

  let totalPhases = 0;
  let completedPhases = 0;

  let totalMandatoryTopics = 0;
  let completedMandatoryTopics = 0;

  let totalMandatoryExercises = 0;
  let passedMandatoryExercises = 0;

  for (const phase of level.phases) {
    if (!phase.mandatory) continue;

    totalPhases++;

    const mandatoryTopics = phase.topics.filter(
      (t) => t.mandatory
    );

    const mandatoryExercises = phase.exercises.filter(
      (e) => e.mandatory
    );

    totalMandatoryTopics += mandatoryTopics.length;
    totalMandatoryExercises += mandatoryExercises.length;

    const topicsDone = mandatoryTopics.filter(
      (t) => state.topics[t.id]?.completed
    ).length;

    const exercisesDone = mandatoryExercises.filter(
      (e) => state.exercises[e.id]?.passed
    ).length;

    completedMandatoryTopics += topicsDone;
    passedMandatoryExercises += exercisesDone;

    // Phase complete =
    // all mandatory topics completed
    // + all mandatory exercises passed
    // + phase assessment passed (if it exists)

    let phaseAssessmentOk = true;

    if (phase.assessment) {
      const rec = state.assessments[phase.assessment.id];

      phaseAssessmentOk =
        !!rec && rec.bestScore >= PHASE_PASS_MARK;
    }

    if (
      topicsDone === mandatoryTopics.length &&
      exercisesDone === mandatoryExercises.length &&
      phaseAssessmentOk
    ) {
      completedPhases++;
    }
  }

  // ── Final Assessment ────────────────────────────────────────────────────────

  const finalRec =
    state.assessments[level.finalAssessment.id];

  const finalScore =
    finalRec ? finalRec.bestScore : null;

  // ── Overall Progress ────────────────────────────────────────────────────────
  //
  // Topics     = 40%
  // Exercises  = 40%
  // Final      = 20%

  const topicWeight =
    totalMandatoryTopics > 0
      ? (completedMandatoryTopics / totalMandatoryTopics) * 40
      : 40;

  const exerciseWeight =
    totalMandatoryExercises > 0
      ? (passedMandatoryExercises / totalMandatoryExercises) * 40
      : 40;

  const finalWeight =
    finalScore !== null
      ? (finalScore / 100) * 20
      : 0;

  const overallPercent = Math.round(
    topicWeight +
    exerciseWeight +
    finalWeight
  );

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
//
// ALL COURSES ARE ALWAYS UNLOCKED.
//
// Previous course completion is NOT required.
// Previous final assessment is NOT required.
//

export function calculateUnlockStatus(
  _state: AppState
): Record<LevelId, LevelUnlockStatus> {
  const result: Record<string, LevelUnlockStatus> = {};

  for (const levelId of LEVEL_ORDER) {
    result[levelId] = {
      levelId,
      unlocked: true,
      requirements: [],
    };
  }

  return result as Record<LevelId, LevelUnlockStatus>;
}

// ── Level Unlock Check ────────────────────────────────────────────────────────

export function isLevelUnlocked(
  _levelId: LevelId,
  _state: AppState
): boolean {
  // Every course is always unlocked.
  return true;
}

// ── Next Required Action ─────────────────────────────────────────────────────
//
// This controls progress INSIDE a course.
// It does NOT control whether the course is unlocked.
//

export function getNextRequiredAction(
  levelId: LevelId,
  state: AppState
): string | null {
  const level = ALL_LEVELS.find(
    (l) => l.id === levelId
  )!;

  // ── Mandatory Phases ───────────────────────────────────────────────────────

  for (const phase of level.phases) {
    if (!phase.mandatory) continue;

    // ── Mandatory Topics ──────────────────────────────────────────────────────

    for (const topic of phase.topics) {
      if (
        topic.mandatory &&
        !state.topics[topic.id]?.completed
      ) {
        return `Learn: ${topic.title} in ${phase.title}`;
      }
    }

    // ── Mandatory Exercises ──────────────────────────────────────────────────

    for (const exercise of phase.exercises) {
      if (
        exercise.mandatory &&
        !state.exercises[exercise.id]?.passed
      ) {
        return `Solve: ${exercise.title} in ${phase.title}`;
      }
    }

    // ── Phase Assessment ──────────────────────────────────────────────────────

    if (phase.assessment) {
      const rec =
        state.assessments[phase.assessment.id];

      if (
        !rec ||
        rec.bestScore < PHASE_PASS_MARK
      ) {
        return `Pass: ${phase.assessment.title} (need ${PHASE_PASS_MARK}%)`;
      }
    }
  }

  // ── Final Assessment ───────────────────────────────────────────────────────

  const finalRec =
    state.assessments[level.finalAssessment.id];

  if (
    !finalRec ||
    finalRec.bestScore < FINAL_PASS_MARK
  ) {
    return `Pass: ${level.title} Final Assessment (need ${FINAL_PASS_MARK}%)`;
  }

  // Course completely completed
  return null;
}