import { Layout } from '../components/Layout/Layout';
import { useApp } from '../store/AppContext';
import { BarChart3, XCircle, CheckCircle } from 'lucide-react';

export function LeetCodePage() {
  const { state, dispatch } = useApp();
  const problems = state.leetcodeProblems || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'solved':
        return <span className="status-badge solved">Solved</span>;
      case 'attempted':
        return <span className="status-badge attempted">Attempted</span>;
      case 'needs-revision':
        return <span className="status-badge needs-revision">Revise</span>;
      default:
        return <span className="status-badge todo">Todo</span>;
    }
  };

  return (
    <Layout title="LeetCode Tracker">
      <div className="card">
        <div className="card-header">
          <h3>My LeetCode Problems</h3>
        </div>
        <div className="card-body">
          {problems.length === 0 ? (
            <div className="empty-state">
              <BarChart3 size={48} />
              <h3>No problems added yet</h3>
              <p>Add problems from the Learn page to start tracking.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {problems.map(p => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td><span className={`difficulty-badge ${p.difficulty}`}>{p.difficulty}</span></td>
                    <td>{getStatusBadge(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
