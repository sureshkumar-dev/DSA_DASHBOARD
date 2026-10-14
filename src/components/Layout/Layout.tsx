import { Sidebar } from './Sidebar';

interface Props { children: React.ReactNode; title: string; actions?: React.ReactNode; }

export function Layout({ children, title, actions }: Props) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <header className="page-header">
          <h2>{title}</h2>
          {actions && <div className="page-header-actions">{actions}</div>}
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
