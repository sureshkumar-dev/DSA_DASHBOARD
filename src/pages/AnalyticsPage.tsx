import { Layout } from '../components/Layout/Layout';
import { useApp } from '../store/AppContext';
import { ALL_LEVELS } from '../curriculum';
import { BarChart3, CheckCircle, Clock } from 'lucide-react';

export function AnalyticsPage() {
  const { state } = useApp();

  // Aggregate stats
  const totalPhases = ALL_LEVELS.reduce((acc, lvl) => acc + lvl.phases.length, 0);
const completedPhases = ALL_LEVELS.reduce((acc, lvl) => {
  const completed = lvl.phases.filter(p => {
    const topicsDone = p.topics.filter(t => t.mandatory).every(t => state.topics[t.id]?.completed);
    const exercisesDone = p.exercises.filter(e => e.mandatory).every(e => state.exercises[e.id]?.passed);
    let assessmentOk = true;
    if (p.assessment) {
      const rec = state.assessments[p.assessment.id];
      assessmentOk = !!rec && rec.bestScore >= 70;
    }
    return topicsDone && exercisesDone && assessmentOk;
  }).length;
  return acc + completed;
}, 0);

  const totalExercises = ALL_LEVELS.reduce((sum, lvl) => sum + lvl.phases.reduce((s,p) => s + p.exercises.filter(e => e.mandatory).length,0),0);
  const passedExercises = Object.values(state.exercises).filter(e => e.passed).length;

  const totalAssessments = ALL_LEVELS.reduce((sum,lvl) => sum + lvl.phases.filter(p=>p.assessment).length + 1,0); // +1 final each level
  const passedAssessments = Object.values(state.assessments).filter(a => a.passed).length;

  const avgScore = (() => {
    const scores = Object.values(state.assessments).map(a=>a.bestScore).filter(Boolean);
    return scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
  })();

  return (
    <Layout title="Analytics & Progress">
      <div className="analytics-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><BarChart3 size={22} /></div>
          <div>
            <div className="stat-card-value">{completedPhases}/{totalPhases}</div>
            <div className="stat-card-label">Phases Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle size={22} /></div>
          <div>
            <div className="stat-card-value">{passedExercises}/{totalExercises}</div>
            <div className="stat-card-label">Exercises Passed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><Clock size={22} /></div>
          <div>
            <div className="stat-card-value">{passedAssessments}/{totalAssessments}</div>
            <div className="stat-card-label">Assessments Passed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><BarChart3 size={22} /></div>
          <div>
            <div className="stat-card-value">{avgScore}%</div>
            <div className="stat-card-label">Average Assessment Score</div>
          </div>
        </div>
      </div>
      {/* Optional detailed breakdown could be added later */}
    </Layout>
  );
}
