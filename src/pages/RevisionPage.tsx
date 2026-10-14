import { Layout } from '../components/Layout/Layout';
import { useApp } from '../store/AppContext';
import { Calendar } from 'lucide-react';

export function RevisionPage() {
  const { state } = useApp();
  const items = state.revisionItems || [];

  const getStatusBadge = (completed: boolean) => {
    return completed ? (
      <span className="status-badge solved">Completed</span>
    ) : (
      <span className="status-badge todo">Pending</span>
    );
  };

  return (
    <Layout title="Revision Center">
      <div className="card">
        <div className="card-header">
          <h3>Revision Items</h3>
        </div>
        <div className="card-body">
          {items.length === 0 ? (
            <div className="empty-state">
              <Calendar size={48} />
              <h3>No revision items</h3>
              <p>Tasks will appear here when you schedule revisions.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className={item.completed ? 'revision-item completed' : 'revision-item'}>
                    <td>{item.referenceId}</td>
                    <td>{item.type}</td>
                    <td>{new Date(item.dueAt).toLocaleDateString()}</td>
                    <td>{getStatusBadge(item.completed)}</td>
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
