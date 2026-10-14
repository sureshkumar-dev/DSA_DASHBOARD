import { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { useApp } from '../store/AppContext';
import { ALL_LEVELS, LEVEL_ORDER } from '../curriculum';
import { ChevronDown, ChevronRight, Lock, CheckCircle, Circle, BookOpen, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Phase, LevelId } from '../types';

const LEVEL_COLORS: Record<string, string> = {
  beginner: '#16a34a', intermediate: '#2563eb', advanced: '#7c3aed', interviewMaster: '#b45309',
};

export function RoadmapPage() {
  const { state, unlockStatus } = useApp();
  const navigate = useNavigate();
  const [expandedLevels, setExpandedLevels] = useState<Set<LevelId>>(new Set([state.currentLevel]));
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const toggleLevel = (id: LevelId) => setExpandedLevels(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const togglePhase = (id: string) => setExpandedPhases(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  function getPhaseCompletion(phase: Phase): { done: number; total: number } {
    const mandatoryTopics = phase.topics.filter(t => t.mandatory);
    const mandatoryExercises = phase.exercises.filter(e => e.mandatory);
    const total = mandatoryTopics.length + mandatoryExercises.length;
    const done = mandatoryTopics.filter(t => state.topics[t.id]?.completed).length +
                 mandatoryExercises.filter(e => state.exercises[e.id]?.passed).length;
    return { done, total };
  }

  return (
    <Layout title="Learning Roadmap">
      <div style={{ maxWidth: 860 }}>
        <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 20 }}>
          Browse the complete curriculum. Locked levels are visible but require completing previous levels to begin.
        </p>

        <div className="roadmap-levels">
          {LEVEL_ORDER.map((levelId, idx) => {
            const level = ALL_LEVELS.find(l => l.id === levelId)!;
            const status = unlockStatus[levelId];
            const isUnlocked = status.unlocked;
            const color = LEVEL_COLORS[levelId];
            const isExpanded = expandedLevels.has(levelId);

            return (
              <div key={levelId} className="roadmap-level" style={{ opacity: isUnlocked ? 1 : 0.7 }}>
                <div
                  className="roadmap-level-header"
                  onClick={() => toggleLevel(levelId)}
                  style={{ borderLeft: `4px solid ${isUnlocked ? color : '#cbd5e1'}` }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: isUnlocked ? color : '#e2e8f0',
                    color: isUnlocked ? 'white' : '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 14, flexShrink: 0, marginRight: 14,
                  }}>{idx + 1}</div>
                  <div className="roadmap-level-title">
                    <h3 style={{ color: isUnlocked ? 'var(--gray-900)' : 'var(--gray-500)' }}>
                      {level.title} — {level.tagline}
                      {!isUnlocked && <Lock size={14} style={{ marginLeft: 8, verticalAlign: 'middle', color: '#94a3b8' }} />}
                    </h3>
                    <p>{level.phases.length} phases • {level.phases.reduce((s,p) => s + p.topics.length, 0)} topics • {level.phases.reduce((s,p) => s + p.exercises.length, 0)} exercises</p>
                  </div>
                  {isExpanded ? <ChevronDown size={18} style={{ color: 'var(--gray-400)' }} /> : <ChevronRight size={18} style={{ color: 'var(--gray-400)' }} />}
                </div>

                {isExpanded && (
                  <div className="roadmap-phases">
                    {level.phases.map(phase => {
                      const { done, total } = getPhaseCompletion(phase);
                      const phaseDone = total > 0 && done === total;
                      const isPhaseExpanded = expandedPhases.has(phase.id);

                      return (
                        <div key={phase.id} className="roadmap-phase">
                          <div className="roadmap-phase-header" onClick={() => togglePhase(phase.id)}>
                            <div className={`phase-number ${phaseDone ? 'done' : state.activePhaseId === phase.id ? 'current' : ''}`}>
                              {phaseDone ? <CheckCircle size={14} /> : phase.order}
                            </div>
                            <div className="roadmap-phase-info">
                              <h4>{phase.title}</h4>
                              <p>{phase.description} • {done}/{total} complete</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 60 }}>
                                <div className="progress-bar-wrap" style={{ height: 4 }}>
                                  <div className="progress-bar-fill" style={{ width: total > 0 ? `${(done/total)*100}%` : '0%', background: color }} />
                                </div>
                              </div>
                              {isPhaseExpanded ? <ChevronDown size={16} style={{ color: 'var(--gray-400)' }} /> : <ChevronRight size={16} style={{ color: 'var(--gray-400)' }} />}
                            </div>
                          </div>

                          {isPhaseExpanded && (
                            <div className="roadmap-topics">
                              {phase.topics.map(topic => {
                                const isDone = state.topics[topic.id]?.completed;
                                return (
                                  <div
                                    key={topic.id}
                                    className={`roadmap-topic-item ${isDone ? 'done' : ''} ${!isUnlocked ? 'locked-item' : ''}`}
                                    onClick={() => isUnlocked && navigate(`/learn?topic=${topic.id}`)}
                                  >
                                    {isDone ? <CheckCircle size={14} /> : <Circle size={14} style={{ color: 'var(--gray-300)' }} />}
                                    <span>{topic.title}</span>
                                    <BookOpen size={12} style={{ marginLeft: 'auto', color: 'var(--gray-400)' }} />
                                  </div>
                                );
                              })}
                              {phase.exercises.map(ex => {
                                const isPassed = state.exercises[ex.id]?.passed;
                                return (
                                  <div
                                    key={ex.id}
                                    className={`roadmap-topic-item ${isPassed ? 'done' : ''} ${!isUnlocked ? 'locked-item' : ''}`}
                                    onClick={() => isUnlocked && navigate(`/exercises?ex=${ex.id}`)}
                                    style={{ color: isPassed ? 'var(--green)' : 'var(--gray-600)' }}
                                  >
                                    {isPassed ? <CheckCircle size={14} /> : <Circle size={14} style={{ color: 'var(--gray-300)' }} />}
                                    <span>{ex.title}</span>
                                    <span style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 6px', borderRadius: 99, background: 'var(--gray-100)', color: 'var(--gray-500)', fontWeight: 600 }}>
                                      {ex.difficulty}
                                    </span>
                                    <Code2 size={12} style={{ color: 'var(--gray-400)' }} />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {/* Final Assessment */}
                    <div style={{ padding: '12px 20px', background: 'var(--gray-50)', borderTop: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                        🏁 Final Assessment: {level.finalAssessment.title} (Pass mark: {level.finalAssessment.passMark}%)
                        {state.assessments[level.finalAssessment.id]?.passed && (
                          <span style={{ marginLeft: 8, color: 'var(--green)', fontWeight: 700 }}>✓ Passed ({state.assessments[level.finalAssessment.id].bestScore}%)</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
