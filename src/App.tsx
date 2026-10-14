import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { LearnPage } from './pages/LearnPage';
import { ExercisesPage } from './pages/ExercisesPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LeetCodePage } from './pages/LeetCodePage';
import { RevisionPage } from './pages/RevisionPage';
import { SettingsPage } from './pages/SettingsPage';
import { ToastContainer } from './components/Toast';
import './styles/globals.css';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/assessments" element={<AssessmentsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/leetcode" element={<LeetCodePage />} />
        <Route path="/revision" element={<RevisionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
