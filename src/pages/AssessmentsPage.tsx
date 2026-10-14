import { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { useApp } from '../store/AppContext';
import { ALL_LEVELS, LEVEL_ORDER } from '../curriculum';
import { gradeQuiz, buildAssessmentAttempt } from '../engine/assessmentEngine';
import { CheckCircle, XCircle, Clock, Trophy, AlertCircle, Lock } from 'lucide-react';
import type { Assessment, LevelId } from '../types';
import { showToast } from '../components/Toast';

const LEVEL_COLORS: Record<string, string> = {
  beginner: '#16a34a', intermediate: '#2563eb', advanced: '#7c3aed', interviewMaster: '#b45309',
};

export function AssessmentsPage() {
  const { state, dispatch, unlockStatus } = useApp();
  const [activeLevelId, setActiveLevelId] = useState<LevelId>(state.currentLevel);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [quizState, setQuizState] = useState<'idle' | 'taking' | 'done'>('idle');
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [showResult, setShowResult] = useState<{ score: number; passed: boolean; correct: number; total: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRef, setTimerRef] = useState<ReturnType<typeof setInterval> | null>(null);

  const currentLevel = ALL_LEVELS.find(l => l.id === activeLevelId)!;
  const isUnlocked = unlockStatus[activeLevelId]?.unlocked;

  // Gather all assessments for this level
  const phaseAssessments = currentLevel.phases.filter(p => p.assessment).map(p => ({ phase: p, assessment: p.assessment! }));
  const finalAssessment = currentLevel.finalAssessment;

  function startAssessment(assessment: Assessment) {
    setActiveAssessment(assessment);
    setAnswers(new Array(assessment.questions.length).fill(-1));
    setCurrentQ(0);
    setQuizState('taking');
    setShowResult(null);

    if (assessment.timeLimit) {
      setTimeLeft(assessment.timeLimit);
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            submitAssessment(assessment, answers);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerRef(interval);
    }
  }

  function submitAssessment(assessment: Assessment, currentAnswers: number[]) {
    if (timerRef) clearInterval(timerRef);
    const result = gradeQuiz(currentAnswers, assessment.questions);
    const attempt = buildAssessmentAttempt(currentAnswers, assessment.questions, assessment.passMark);
    dispatch({ type: 'SUBMIT_ASSESSMENT', assessmentId: assessment.id, attempt });
    setShowResult({ score: result.score, passed: attempt.passed, correct: result.correct, total: result.total });
    setQuizState('done');
    if (attempt.passed) showToast(`Assessment passed! Score: ${result.score}% 🎉`, 'success');
    else showToast(`Score: ${result.score}% — need ${assessment.passMark}% to pass`, 'error');
  }

  function handleAnswer(optionIdx: number) {
    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIdx;
    setAnswers(newAnswers);
  }

  const formatTime = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  return (
    <Layout
      title="Assessments"
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          {LEVEL_ORDER.map(id => {
            const lv = ALL_LEVELS.find(l => l.id === id)!;
            const locked = !unlockStatus[id]?.unlocked;
            return (
              <button key={id} className={`btn btn-sm ${activeLevelId === id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setActiveLevelId(id); setActiveAssessment(null); setQuizState('idle'); }}
                style={{ opacity: locked ? 0.5 : 1, background: activeLevelId === id ? LEVEL_COLORS[id] : undefined }}
                disabled={locked}>{locked && <Lock size={11} />}{lv.title}</button>
            );
          })}
        </div>
      }
    >
      {quizState === 'idle' && (
        <div style={{ maxWidth: 800 }}>
          {!isUnlocked && (
            <div style={{ background: 'var(--gray-100)', borderRadius: 10, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gray-600)', fontSize: 14 }}>
              <Lock size={16} /> This level is locked. Complete previous level to access assessments.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {phaseAssessments.map(({ phase, assessment }) => {
              const rec = state.assessments[assessment.id];
              const passed = rec?.passed;
              return (
                <div key={assessment.id} className="card">
                  <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 600, marginBottom: 4 }}>PHASE ASSESSMENT</div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>{assessment.title}</h3>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--gray-500)' }}>
                        <span>{assessment.questions.length} questions</span>
                        <span>Pass mark: {assessment.passMark}%</span>
                        {assessment.timeLimit && <span><Clock size={11} style={{ verticalAlign: 'middle' }} /> {formatTime(assessment.timeLimit)}</span>}
                        {rec && <span>Best: {rec.bestScore}% ({rec.attempts.length} attempts)</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      {passed ? <CheckCircle size={20} style={{ color: 'var(--green)' }} /> : rec ? <XCircle size={20} style={{ color: 'var(--red)' }} /> : null}
                      <button className="btn btn-primary btn-sm"
                        disabled={!isUnlocked}
                        onClick={() => startAssessment(assessment)}
                        style={{ background: LEVEL_COLORS[activeLevelId] }}>
                        {rec ? 'Retake' : 'Start'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Final Assessment */}
            <div className="card" style={{ border: `2px solid ${LEVEL_COLORS[activeLevelId]}20` }}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: LEVEL_COLORS[activeLevelId], fontWeight: 700, marginBottom: 4 }}>🏁 FINAL ASSESSMENT</div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 4 }}>{finalAssessment.title}</h3>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--gray-500)' }}>
                    <span>{finalAssessment.questions.length} questions</span>
                    <span>Pass mark: {finalAssessment.passMark}%</span>
                    {finalAssessment.timeLimit && <span><Clock size={11} style={{ verticalAlign: 'middle' }} /> {formatTime(finalAssessment.timeLimit)}</span>}
                    {state.assessments[finalAssessment.id] && (
                      <span>Best: {state.assessments[finalAssessment.id].bestScore}%</span>
                    )}
                  </div>
                  {!state.assessments[finalAssessment.id]?.passed && (
                    <div style={{ marginTop: 6, fontSize: 12, color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <AlertCircle size={12} /> Passing this unlocks the next level
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {state.assessments[finalAssessment.id]?.passed
                    ? <Trophy size={22} style={{ color: LEVEL_COLORS[activeLevelId] }} />
                    : state.assessments[finalAssessment.id] ? <XCircle size={20} style={{ color: 'var(--red)' }} /> : null}
                  <button className="btn btn-lg"
                    disabled={!isUnlocked}
                    style={{ background: LEVEL_COLORS[activeLevelId], color: 'white' }}
                    onClick={() => startAssessment(finalAssessment)}>
                    {state.assessments[finalAssessment.id] ? 'Retake Final' : 'Take Final Assessment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {quizState === 'taking' && activeAssessment && (
        <div className="quiz-wrap">
          {/* Quiz Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{activeAssessment.title}</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: 13 }}>Question {currentQ + 1} of {activeAssessment.questions.length}</p>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {activeAssessment.timeLimit && timeLeft > 0 && (
                <div className={`quiz-timer ${timeLeft < 60 ? 'warning' : ''}`}>
                  <Clock size={15} /> {formatTime(timeLeft)}
                </div>
              )}
              <div style={{ background: 'var(--gray-100)', borderRadius: 99, height: 8, width: 120, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: LEVEL_COLORS[activeLevelId], width: `${((currentQ+1)/activeAssessment.questions.length)*100}%`, transition: 'width 0.3s' }} />
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="quiz-question-card">
            <div className="quiz-question-number">Question {currentQ + 1}</div>
            <div className="quiz-question-text">{activeAssessment.questions[currentQ].question}</div>
            <div className="quiz-options">
              {activeAssessment.questions[currentQ].options.map((opt, oi) => (
                <div key={oi} className={`quiz-option ${answers[currentQ] === oi ? 'selected' : ''}`}
                  onClick={() => handleAnswer(oi)}>
                  <span className="quiz-option-letter">{String.fromCharCode(65 + oi)}</span>
                  {opt}
                </div>
              ))}
            </div>
          </div>

          {/* Nav Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <button className="btn btn-secondary" disabled={currentQ === 0} onClick={() => setCurrentQ(q => q - 1)}>← Previous</button>
            <div style={{ display: 'flex', gap: 8 }}>
              {currentQ < activeAssessment.questions.length - 1 ? (
                <button className="btn btn-primary" onClick={() => setCurrentQ(q => q + 1)}>Next →</button>
              ) : (
                <button className="btn btn-success" onClick={() => submitAssessment(activeAssessment, answers)}>
                  <CheckCircle size={15} /> Submit Assessment
                </button>
              )}
            </div>
          </div>

          {/* Question dots */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 20, justifyContent: 'center' }}>
            {activeAssessment.questions.map((_, qi) => (
              <button key={qi} onClick={() => setCurrentQ(qi)}
                style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 11,
                  background: qi === currentQ ? LEVEL_COLORS[activeLevelId] : answers[qi] >= 0 ? 'var(--green-100)' : 'var(--gray-200)',
                  color: qi === currentQ ? 'white' : answers[qi] >= 0 ? 'var(--green)' : 'var(--gray-600)',
                }}>
                {qi + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {quizState === 'done' && showResult && activeAssessment && (
        <div className="quiz-wrap">
          <div className="score-card">
            <div className={`score-circle ${showResult.passed ? 'pass' : 'fail'}`}>
              <div className="score-percent">{showResult.score}%</div>
              <div className="score-label">{showResult.passed ? 'PASSED' : 'FAILED'}</div>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
              {showResult.passed ? '🎉 Congratulations!' : '📚 Keep Practicing!'}
            </h2>
            <p style={{ color: 'var(--gray-600)', fontSize: 14, marginBottom: 24 }}>
              You got {showResult.correct} out of {showResult.total} questions correct.
              {!showResult.passed && ` You need ${activeAssessment.passMark}% to pass.`}
            </p>

            {/* Review answers */}
            <div style={{ textAlign: 'left', marginBottom: 24 }}>
              {activeAssessment.questions.map((q, qi) => {
                const userAnswer = answers[qi];
                const isCorrect = userAnswer === q.correctIndex;
                return (
                  <div key={qi} style={{ padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      {isCorrect ? <CheckCircle size={16} style={{ color: 'var(--green)', flexShrink: 0, marginTop: 2 }} /> : <XCircle size={16} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 2 }} />}
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{q.question}</span>
                    </div>
                    {!isCorrect && (
                      <>
                        <div style={{ fontSize: 13, color: 'var(--red)', marginLeft: 24 }}>Your answer: {userAnswer >= 0 ? q.options[userAnswer] : 'Not answered'}</div>
                        <div style={{ fontSize: 13, color: 'var(--green)', marginLeft: 24 }}>Correct: {q.options[q.correctIndex]}</div>
                      </>
                    )}
                    <div className="quiz-explanation">{q.explanation}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => { setQuizState('idle'); setActiveAssessment(null); }}>
                Back to Assessments
              </button>
              <button className="btn btn-primary" onClick={() => startAssessment(activeAssessment)}
                style={{ background: LEVEL_COLORS[activeLevelId] }}>
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
