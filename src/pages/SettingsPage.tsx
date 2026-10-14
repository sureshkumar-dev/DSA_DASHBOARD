import { Layout } from '../components/Layout/Layout';
import { useApp } from '../store/AppContext';
import { Sun, Moon, XCircle } from 'lucide-react';

export function SettingsPage() {
  const { dispatch } = useApp();

  // Placeholder toggles; actual implementation can be expanded
  const toggleTheme = () => {
    // Example: toggle a hypothetical theme value in state
    // dispatch({ type: 'SET_THEME', theme: state.theme === 'light' ? 'dark' : 'light' });
    // For now just show a toast
    // showToast('Theme toggled (placeholder)', 'info');
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
      dispatch({ type: 'RESET_ALL' });
      // showToast('All progress reset', 'success');
    }
  };

  return (
    <Layout title="Settings">
      <div className="card">
        <div className="card-header">
          <h3>Application Settings</h3>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label">Theme</label>
            <button className="btn btn-primary" onClick={toggleTheme}>
              <Sun size={16} /> Light / <Moon size={16} /> Dark
            </button>
          </div>
          <hr />
          <div className="form-group">
            <label className="form-label">Data Management</label>
            <button className="btn btn-danger" onClick={resetProgress}>
              <XCircle size={16} /> Reset All Progress
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
