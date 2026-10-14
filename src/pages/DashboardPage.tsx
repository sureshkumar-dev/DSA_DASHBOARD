
import { Layout } from '../components/Layout/Layout';
import { useApp } from '../store/AppContext';
import { ALL_LEVELS, LEVEL_ORDER } from '../curriculum';
import { Lock, ArrowRight, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LEVEL_COLORS: Record<string, string> = {
  beginner: '#16a34a',
  intermediate: '#2563eb',
  advanced: '#7c3aed',
  interviewMaster: '#b45309',
};

export function DashboardPage() {
  const { state, unlockStatus, getLevelProgressSummary } = useApp();
  const navigate = useNavigate();

  return (
    <Layout title="Dashboard — Learning Overview">
      <div style={{ maxWidth: 1100 }}>
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
          borderRadius: 16, padding: '28px 32px', marginBottom: 28, color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.75, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Your Learning Journey</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>DSA Zero-to-Hero</h1>
            <p style={{ opacity: 0.85, fontSize: 14, lineHeight: 1.6 }}>
              Master Data Structures & Algorithms step by step — from zero to interview-ready.
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 4 }}>Current Level</div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 10, padding: '8px 18px', fontWeight: 700, fontSize: 16,
            }}>
              {ALL_LEVELS.find(l => l.id === state.currentLevel)?.title ?? 'Beginner'}
            </div>
          </div>
        </div>

        {/* Level Cards */}
        <div className="levels-grid">
          {LEVEL_ORDER.map((levelId, idx) => {
            const level = ALL_LEVELS.find(l => l.id === levelId)!;
            const status = unlockStatus[levelId];
            const progress = getLevelProgressSummary(levelId);
            const isUnlocked = status.unlocked;
            const isCurrent = state.currentLevel === levelId;
            const color = LEVEL_COLORS[levelId];

            return (
              <div key={levelId} className={`level-card ${!isUnlocked ? 'locked' : ''}`}>
                <div className="level-card-accent" style={{ background: isUnlocked ? color : '#cbd5e1' }} />

                <div className="level-card-header" style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: isUnlocked ? color : '#e2e8f0',
                      color: isUnlocked ? 'white' : '#94a3b8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                    }}>{idx + 1}</span>
                    <span className={`level-card-badge ${isCurrent ? 'current' : isUnlocked ? 'unlocked' : 'locked-badge'}`}>
                      {isCurrent ? '▶ Current' : isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
                    </span>
                  </div>
                  {!isUnlocked && <Lock size={18} style={{ color: '#94a3b8' }} />}
                  {isUnlocked && progress.overallPercent === 100 && <Trophy size={18} style={{ color: color }} />}
                </div>

                <div className="level-card-title">{level.title}</div>
                <div className="level-card-tagline">{level.tagline}</div>
                <div className="level-card-desc">{level.description}</div>

                <div className="level-stats">
                  <div className="level-stat">
                    <div className="level-stat-value">{progress.completedPhases}/{progress.totalPhases}</div>
                    <div className="level-stat-label">Phases Done</div>
                  </div>
                  <div className="level-stat">
                    <div className="level-stat-value">{progress.completedMandatoryTopics}/{progress.totalMandatoryTopics}</div>
                    <div className="level-stat-label">Topics Done</div>
                  </div>
                  <div className="level-stat">
                    <div className="level-stat-value">{progress.passedMandatoryExercises}/{progress.totalMandatoryExercises}</div>
                    <div className="level-stat-label">Exercises Passed</div>
                  </div>
                  <div className="level-stat">
                    <div className="level-stat-value">{progress.finalAssessmentScore != null ? `${progress.finalAssessmentScore}%` : '—'}</div>
                    <div className="level-stat-label">Final Score</div>
                  </div>
                </div>

                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${progress.overallPercent}%`, background: isUnlocked ? color : '#cbd5e1' }} />
                </div>
                <div className="progress-label">
                  <span>Progress</span>
                  <span style={{ fontWeight: 700, color: isUnlocked ? color : '#94a3b8' }}>{progress.overallPercent}%</span>
                </div>

                {!isUnlocked && status.requirements.length > 0 && (
                  <div className="level-requirements">
                    <h4>To unlock this level:</h4>
                    {status.requirements.filter(r => !r.met).slice(0, 3).map((req, ri) => (
                      <div key={ri} className="requirement-item unmet">
                        <Lock size={13} style={{ marginTop: 2 }} />
                        <span>{req.label}</span>
                      </div>
                    ))}
                    {status.requirements.filter(r => !r.met).length > 3 && (
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                        +{status.requirements.filter(r => !r.met).length - 3} more requirements
                      </div>
                    )}
                  </div>
                )}

                {isUnlocked && (
                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => navigate('/learn')}
                    style={{ background: color, marginTop: 4 }}
                  >
                    {isCurrent ? 'Continue Learning' : 'Review Level'}
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
