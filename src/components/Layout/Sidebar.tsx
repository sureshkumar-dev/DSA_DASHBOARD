import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, BookOpen, Code2, Brain, BarChart3, ExternalLink, RotateCcw, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', path: '/', icon: LayoutDashboard, group: 'main' },
  { label: 'Roadmap', path: '/roadmap', icon: Map, group: 'main' },
  { label: 'Learn', path: '/learn', icon: BookOpen, group: 'study' },
  { label: 'Exercises', path: '/exercises', icon: Code2, group: 'study' },
  { label: 'Assessments', path: '/assessments', icon: Brain, group: 'study' },
  { label: 'Analytics', path: '/analytics', icon: BarChart3, group: 'progress' },
  { label: 'LeetCode Tracker', path: '/leetcode', icon: ExternalLink, group: 'progress' },
  { label: 'Revision Center', path: '/revision', icon: RotateCcw, group: 'progress' },
  { label: 'Settings', path: '/settings', icon: Settings, group: 'settings' },
];

const GROUPS: { key: string; label: string }[] = [
  { key: 'main', label: 'Dashboard' },
  { key: 'study', label: 'Study' },
  { key: 'progress', label: 'Progress' },
  { key: 'settings', label: 'Settings' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>DSA Zero-to-Hero</h1>
        <p>Level-Gated Learning Roadmap</p>
      </div>
      <nav className="sidebar-nav">
        {GROUPS.map(group => {
          const items = NAV_ITEMS.filter(i => i.group === group.key);
          return (
            <div key={group.key} className="sidebar-nav-group">
              <div className="sidebar-nav-group-label">{group.label}</div>
              {items.map(item => {
                const Icon = item.icon;
                const active = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                return (
                  <button
                    key={item.path}
                    className={`sidebar-nav-item ${active ? 'active' : ''}`}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon />
                    {item.label}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
