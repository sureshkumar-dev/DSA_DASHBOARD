import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout/Layout';
import { useApp } from '../store/AppContext';
import { ALL_LEVELS, LEVEL_ORDER } from '../curriculum';
import { runCode, buildExerciseAttempt } from '../engine/assessmentEngine';
import { Play, CheckCircle, XCircle, Lightbulb, ChevronDown, ChevronRight, Lock, RefreshCw } from 'lucide-react';
import type { Exercise, LevelId } from '../types';
import { showToast } from '../components/Toast';
import { useSearchParams } from 'react-router-dom';

const LEVEL_COLORS: Record<string, string> = {
  beginner: '#16a34a', intermediate: '#2563eb', advanced: '#7c3aed', interviewMaster: '#b45309',
};

const DIFF_COLORS: Record<string, string> = {
  Beginner: 'var(--green)', Easy: 'var(--green)', Medium: 'var(--amber)', Hard: 'var(--red)',
};

export function ExercisesPage() {
  const { state, dispatch, unlockStatus } = useApp();
  const [params] = useSearchParams();
  const [activeLevelId, setActiveLevelId] = useState<LevelId>(state.currentLevel);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<ReturnType<typeof runCode> | null>(null);
  const [shownHints, setShownHints] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const currentLevel = ALL_LEVELS.find(l => l.id === activeLevelId)!;
  const allExercises = currentLevel.phases.flatMap(p => p.exercises);

  useEffect(() => {
    const exId = params.get('ex');
    if (exId) {
      for (const level of ALL_LEVELS) {
        for (const phase of level.phases) {
          const found = phase.exercises.find(e => e.id === exId);
          if (found) {
            setActiveLevelId(level.id);
            setActiveExercise(found);
            setCode(state.exercises[found.id]?.lastCode ?? found.starterCode);
            setRunResult(null);
            return;
          }
        }
      }
    }
  }, [params]);

  function selectExercise(ex: Exercise) {
    setActiveExercise(ex);
    setCode(state.exercises[ex.id]?.lastCode ?? ex.starterCode);
    setRunResult(null);
    setShownHints(new Set());
    setShowExplanation(false);
    dispatch({ type: 'SET_LAST_STUDIED', id: ex.id });
  }

  function handleRun() {
    if (!activeExercise) return;
    setRunning(true);
    setRunResult(null);
    setTimeout(() => {
      const result = runCode(code, activeExercise.testCases);
      setRunResult(result);
      const attempt = buildExerciseAttempt(code, result);
      dispatch({ type: 'SUBMIT_EXERCISE', exerciseId: activeExercise.id, attempt });
      if (result.allPassed) showToast('All test cases passed! 🎉', 'success');
      else showToast(`${result.passed}/${result.total} test cases passed`, 'info');
      setRunning(false);
    }, 50);
  }

  return (
    <Layout
      title="Coding Exercises"
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          {LEVEL_ORDER.map(id => {
            const lv = ALL_LEVELS.find(l => l.id === id)!;
            const locked = !unlockStatus[id]?.unlocked;
            return (
              <button key={id} className={`btn btn-sm ${activeLevelId === id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setActiveLevelId(id); setActiveExercise(null); }}
                style={{ opacity: locked ? 0.5 : 1, background: activeLevelId === id ? LEVEL_COLORS[id] : undefined }}
                disabled={locked}>
                {locked && <Lock size={11} />}{lv.title}
              </button>
            );
          })}
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Exercise List */}
        <div className="topic-list-panel">
          <div className="topic-list-header">
            <h3>Exercises — {currentLevel.title}</h3>
            <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
              {allExercises.filter(e => state.exercises[e.id]?.passed).length}/{allExercises.length} passed
            </p>
          </div>
          <div className="topic-list-scroll">
            {currentLevel.phases.filter(p => p.exercises.length > 0).map(phase => {
              const isExpanded = expandedPhases.has(phase.id);
              const phasePassed = phase.exercises.filter(e => state.exercises[e.id]?.passed).length;
              return (
                <div key={phase.id}>
                  <button
                    className="topic-list-item"
                    style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--gray-700)', width: '100%', background: 'var(--gray-50)', borderRadius: 6, marginBottom: 2 }}
                    onClick={() => setExpandedPhases(prev => { const n = new Set(prev); n.has(phase.id) ? n.delete(phase.id) : n.add(phase.id); return n; })}
                  >
                    {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    <span style={{ flex: 1, textAlign: 'left', fontSize: 12 }}>{phase.title.replace(/Phase \d+ — /, '')}</span>
                    <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{phasePassed}/{phase.exercises.length}</span>
                  </button>
                  {isExpanded && phase.exercises.map(ex => {
                    const passed = state.exercises[ex.id]?.passed;
                    const attempted = (state.exercises[ex.id]?.attempts.length ?? 0) > 0;
                    return (
                      <div key={ex.id}
                        className={`topic-list-item ${activeExercise?.id === ex.id ? 'active' : ''}`}
                        style={{ paddingLeft: 24, color: passed ? 'var(--green)' : attempted ? 'var(--amber)' : 'var(--gray-700)' }}
                        onClick={() => selectExercise(ex)}
                      >
                        {passed ? <CheckCircle size={13} /> : <XCircle size={13} style={{ color: 'var(--gray-300)' }} />}
                        <span style={{ flex: 1, fontSize: 12.5 }}>{ex.title}</span>
                        <span style={{ fontSize: 10, padding: '2px 5px', borderRadius: 99, background: 'var(--gray-100)', color: DIFF_COLORS[ex.difficulty], fontWeight: 700 }}>
                          {ex.difficulty[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor + Results */}
        <div style={{ minWidth: 0 }}>
          {!activeExercise ? (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>💻</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8 }}>Select an exercise to start coding</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>Pick an exercise from the left panel.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Exercise Header */}
              <div className="card">
                <div className="card-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <span className={`difficulty-badge ${activeExercise.difficulty}`}>{activeExercise.difficulty}</span>
                      {activeExercise.mandatory && <span className="tag blue">Mandatory</span>}
                      {state.exercises[activeExercise.id]?.passed && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>
                          <CheckCircle size={13} /> Solved
                        </span>
                      )}
                    </div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)' }}>{activeExercise.title}</h2>
                  </div>
                  <button className="btn btn-sm btn-secondary" onClick={() => { setCode(activeExercise.starterCode); setRunResult(null); }}>
                    <RefreshCw size={13} /> Reset
                  </button>
                </div>
                <div className="card-body">
                  <p style={{ color: 'var(--gray-700)', fontSize: 14, marginBottom: 12 }}>{activeExercise.description}</p>

                  {/* Hints */}
                  {activeExercise.hints.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6 }}>Hints ({shownHints.size}/{activeExercise.hints.length} revealed)</div>
                      {activeExercise.hints.map((hint, hi) => (
                        <div key={hi} className="hint-accordion">
                          {!shownHints.has(hi) ? (
                            <button className="hint-trigger" onClick={() => setShownHints(prev => new Set([...prev, hi]))}>
                              <Lightbulb size={13} /> Hint {hi + 1} (click to reveal)
                            </button>
                          ) : (
                            <div>
                              <div className="hint-trigger" style={{ cursor: 'default' }}><Lightbulb size={13} /> Hint {hi + 1}</div>
                              <div className="hint-content">{hint}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Test Cases */}
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6 }}>Test Cases ({activeExercise.testCases.length})</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {activeExercise.testCases.map((tc, i) => (
                      <div key={tc.id} style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 6, padding: '6px 10px', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                        <div style={{ color: 'var(--gray-500)', marginBottom: 2 }}>Test {i + 1}: {tc.description}</div>
                        <div>Input: <span style={{ color: 'var(--blue-600)' }}>{tc.input}</span></div>
                        <div>Expected: <span style={{ color: 'var(--green)' }}>{tc.expected}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="editor-wrap">
                <div className="editor-toolbar">
                  <span className="editor-lang-tag">JavaScript</span>
                  <button className="btn btn-primary" onClick={handleRun} disabled={running}>
                    {running ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={14} />}
                    {running ? 'Running...' : 'Run Code'}
                  </button>
                </div>
                <textarea
                  className="code-editor"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                  onKeyDown={e => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const start = e.currentTarget.selectionStart;
                      const end = e.currentTarget.selectionEnd;
                      const newCode = code.substring(0, start) + '  ' + code.substring(end);
                      setCode(newCode);
                      setTimeout(() => e.currentTarget.setSelectionRange(start + 2, start + 2), 0);
                    }
                  }}
                />
              </div>

              {/* Test Results */}
              {runResult && (
                <div className="card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700 }}>Test Results</h3>
                    <span style={{ fontWeight: 700, color: runResult.allPassed ? 'var(--green)' : 'var(--red)', fontSize: 14 }}>
                      {runResult.passed}/{runResult.total} passed
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="test-results">
                      {runResult.results.map((r, i) => (
                        <div key={i} className={`test-result-item ${r.passed ? 'passed' : 'failed'}`}>
                          {r.passed ? <CheckCircle size={15} style={{ color: 'var(--green)' }} /> : <XCircle size={15} style={{ color: 'var(--red)' }} />}
                          <div>
                            <div className="test-result-label">Test {i + 1}: {r.description}</div>
                            {!r.passed && (
                              <div className="test-result-details">
                                Expected: <code>{r.expected}</code> | Got: <code>{r.actual}</code>
                                {r.error && <div style={{ color: 'var(--red)', marginTop: 2 }}>{r.error}</div>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {runResult.allPassed && (
                      <div style={{ marginTop: 16 }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setShowExplanation(!showExplanation)}
                        >
                          {showExplanation ? 'Hide' : 'Show'} Explanation
                        </button>
                        {showExplanation && (
                          <div style={{ marginTop: 12, padding: '14px 16px', background: 'var(--blue-50)', borderRadius: 8, fontSize: 13.5, color: 'var(--gray-700)', borderLeft: '3px solid var(--blue)' }}>
                            {activeExercise.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Attempt History */}
              {(state.exercises[activeExercise.id]?.attempts.length ?? 0) > 0 && (
                <div className="card">
                  <div className="card-header"><h3 style={{ fontSize: 14, fontWeight: 700 }}>Attempt History</h3></div>
                  <div className="card-body">
                    {[...state.exercises[activeExercise.id].attempts].reverse().slice(0, 5).map((attempt, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                        <div style={{ fontSize: 13 }}>
                          {attempt.passed ? <CheckCircle size={14} style={{ color: 'var(--green)', marginRight: 6, verticalAlign: 'middle' }} /> : <XCircle size={14} style={{ color: 'var(--red)', marginRight: 6, verticalAlign: 'middle' }} />}
                          {attempt.score}/{attempt.total} tests passed
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{new Date(attempt.timestamp).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
