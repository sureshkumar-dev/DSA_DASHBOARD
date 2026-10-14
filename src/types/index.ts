// ── Primitives ────────────────────────────────────────────────────────────────
export type Difficulty = 'Beginner' | 'Easy' | 'Medium' | 'Hard';
export type LevelId = 'beginner' | 'intermediate' | 'advanced' | 'interviewMaster';
export type PhaseStage = 'learn' | 'guided' | 'independent' | 'assessment' | 'revision';

// ── Curriculum ────────────────────────────────────────────────────────────────
export interface TestCase {
  id: string;
  description: string;
  input: string;       // JSON-stringified array of args
  expected: string;    // JSON-stringified expected output
}

export interface Topic {
  id: string;
  phaseId: string;
  levelId: LevelId;
  title: string;
  description: string;
  content: string;      // Markdown-ish rich text
  mandatory: boolean;
  stage: PhaseStage;
  order: number;
}

export interface Exercise {
  id: string;
  phaseId: string;
  levelId: LevelId;
  title: string;
  description: string;
  difficulty: Difficulty;
  mandatory: boolean;
  starterCode: string;
  testCases: TestCase[];
  hints: string[];
  explanation: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Assessment {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passMark: number;     // 0–100
  timeLimit?: number;   // seconds
  isFinal: boolean;
}

export interface Phase {
  id: string;
  levelId: LevelId;
  title: string;
  description: string;
  topics: Topic[];
  exercises: Exercise[];
  assessment?: Assessment;
  mandatory: boolean;
  order: number;
}

export interface Level {
  id: LevelId;
  title: string;
  tagline: string;
  description: string;
  color: string;         // CSS colour
  phases: Phase[];
  finalAssessment: Assessment;
  unlockRequires?: LevelId;
}

// ── Progress Records ──────────────────────────────────────────────────────────
export interface TopicRecord {
  topicId: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  bookmarked?: boolean;
}

export interface ExerciseAttempt {
  timestamp: string;
  code: string;
  passed: boolean;
  score: number;        // # test cases passed
  total: number;        // # test cases total
}

export interface ExerciseRecord {
  exerciseId: string;
  attempts: ExerciseAttempt[];
  bestScore: number;
  passed: boolean;      // true once ≥1 attempt fully passes
  lastCode: string;
}

export interface AssessmentAttempt {
  timestamp: string;
  answers: number[];
  score: number;        // 0–100
  passed: boolean;
}

export interface AssessmentRecord {
  assessmentId: string;
  attempts: AssessmentAttempt[];
  bestScore: number;
  passed: boolean;
}

export interface LevelRecord {
  levelId: LevelId;
  unlocked: boolean;
  unlockedAt?: string;
  completed: boolean;
  finalAssessmentPassed: boolean;
}

// ── App State ─────────────────────────────────────────────────────────────────
export interface AppState {
  version: string;
  currentLevel: LevelId;
  activePhaseId: string | null;
  activeTopicId: string | null;
  activeExerciseId: string | null;
  levels: Record<LevelId, LevelRecord>;
  topics: Record<string, TopicRecord>;
  exercises: Record<string, ExerciseRecord>;
  assessments: Record<string, AssessmentRecord>;
  lastStudied: string | null;
  leetcodeProblems: LeetCodeProblem[];
  revisionItems: RevisionItem[];
}

// ── LeetCode Tracker ─────────────────────────────────────────────────────────
export interface LeetCodeProblem {
  id: string;
  number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  status: 'todo' | 'attempted' | 'solved' | 'needs-revision';
  notes: string;
  solvedAt?: string;
  url: string;
  tags: string[];
}

// ── Revision ─────────────────────────────────────────────────────────────────
export interface RevisionItem {
  id: string;
  type: 'topic' | 'exercise' | 'assessment';
  referenceId: string;
  levelId: LevelId;
  addedAt: string;
  dueAt: string;
  completed: boolean;
}

// ── Derived / UI helpers ──────────────────────────────────────────────────────
export interface UnlockRequirement {
  label: string;
  met: boolean;
}

export interface LevelUnlockStatus {
  levelId: LevelId;
  unlocked: boolean;
  requirements: UnlockRequirement[];
}

export interface LevelProgressSummary {
  levelId: LevelId;
  totalPhases: number;
  completedPhases: number;
  totalMandatoryTopics: number;
  completedMandatoryTopics: number;
  totalMandatoryExercises: number;
  passedMandatoryExercises: number;
  finalAssessmentScore: number | null;
  overallPercent: number;
}
