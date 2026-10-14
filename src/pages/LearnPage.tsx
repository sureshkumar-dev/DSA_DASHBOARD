import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout/Layout';
import { useApp } from '../store/AppContext';
import { ALL_LEVELS, LEVEL_ORDER } from '../curriculum';
import { ContentRenderer } from '../components/ContentRenderer';
import { CheckCircle, Circle, Bookmark, BookmarkCheck, Lock, ChevronRight, ChevronDown } from 'lucide-react';
import type { Topic, Phase, LevelId } from '../types';
import { showToast } from '../components/Toast';
import { useSearchParams } from 'react-router-dom';

export function LearnPage() {
  const { state, dispatch, unlockStatus } = useApp();
  const [params] = useSearchParams();
  const [activeLevelId, setActiveLevelId] = useState<LevelId>(state.currentLevel);
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [noteText, setNoteText] = useState('');

  const LEVEL_COLORS: Record<string, string> = {
    beginner: '#16a34a', intermediate: '#2563eb', advanced: '#7c3aed', interviewMaster: '#b45309',
  };

  useEffect(() => {
    const topicId = params.get('topic');
    if (topicId) {
      for (const level of ALL_LEVELS) {
        for (const phase of level.phases) {
          const found = phase.topics.find(t => t.id === topicId);
          if (found) {
            setActiveLevelId(level.id);
            setActivePhaseId(phase.id);
            setActiveTopic(found);
            setExpandedPhases(new Set([phase.id]));
            setNoteText(state.topics[topicId]?.notes ?? '');
            return;
          }
        }
      }
    }
  }, [params]);

  useEffect(() => {
    if (activeTopic) {
      setNoteText(state.topics[activeTopic.id]?.notes ?? '');
    }
  }, [activeTopic?.id]);

  const currentLevel = ALL_LEVELS.find(l => l.id === activeLevelId)!;
  const isUnlocked = unlockStatus[activeLevelId]?.unlocked;

  function selectTopic(topic: Topic, phase: Phase) {
    setActiveTopic(topic);
    setActivePhaseId(phase.id);
    dispatch({ type: 'SET_LAST_STUDIED', id: topic.id });
  }

  function markComplete() {
    if (!activeTopic) return;
    dispatch({ type: 'COMPLETE_TOPIC', topicId: activeTopic.id });
    showToast('Topic marked as complete! 🎉', 'success');
  }

  function toggleBookmark() {
    if (!activeTopic) return;
    const current = state.topics[activeTopic.id]?.bookmarked ?? false;
    dispatch({ type: 'SET_BOOKMARK', topicId: activeTopic.id, bookmarked: !current });
  }

  function saveNote() {
    if (!activeTopic) return;
    dispatch({ type: 'SET_NOTE', topicId: activeTopic.id, note: noteText });
    showToast('Note saved!', 'success');
  }

  return (
    <Layout
      title="Learn"
      actions={
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {LEVEL_ORDER.map(id => {
            const lv = ALL_LEVELS.find(l => l.id === id)!;
            const locked = !unlockStatus[id]?.unlocked;
            return (
              <button
                key={id}
                className={`btn btn-sm ${activeLevelId === id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setActiveLevelId(id); setActiveTopic(null); }}
                style={{ opacity: locked ? 0.5 : 1, background: activeLevelId === id ? LEVEL_COLORS[id] : undefined }}
                disabled={locked}
              >
                {locked && <Lock size={11} />}
                {lv.title}
              </button>
            );
          })}
        </div>
      }
    >
      <div className="learning-layout">
        {/* Left Panel: Topic List */}
        <div className="topic-list-panel">
          <div className="topic-list-header">
            <h3>{currentLevel.title} — Topics</h3>
            <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{currentLevel.phases.reduce((s,p) => s + p.topics.length, 0)} topics</p>
          </div>
          <div className="topic-list-scroll">
            {currentLevel.phases.map(phase => {
              const isExpanded = expandedPhases.has(phase.id);
              const done = phase.topics.filter(t => state.topics[t.id]?.completed).length;
              return (
                <div key={phase.id}>
                  <button
                    className="topic-list-item"
                    style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--gray-700)', width: '100%', background: 'var(--gray-50)', borderRadius: 6, marginBottom: 2 }}
                    onClick={() => {
                      setExpandedPhases(prev => {
                        const n = new Set(prev);
                        n.has(phase.id) ? n.delete(phase.id) : n.add(phase.id);
                        return n;
                      });
                    }}
                  >
                    {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    <span style={{ flex: 1, textAlign: 'left' }}>{phase.title.replace(/Phase \d+ — /, '')}</span>
                    <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{done}/{phase.topics.length}</span>
                  </button>
                  {isExpanded && phase.topics.map(topic => {
                    const isDone = state.topics[topic.id]?.completed;
                    const isActive = activeTopic?.id === topic.id;
                    const isBookmarked = state.topics[topic.id]?.bookmarked;
                    return (
                      <div
                        key={topic.id}
                        className={`topic-list-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                        style={{ paddingLeft: 24 }}
                        onClick={() => selectTopic(topic, phase)}
                      >
                        {isDone ? <CheckCircle size={13} /> : <Circle size={13} style={{ color: 'var(--gray-300)' }} />}
                        <span style={{ flex: 1 }}>{topic.title}</span>
                        {isBookmarked && <Bookmark size={12} style={{ color: 'var(--amber)' }} />}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Content */}
        <div className="topic-content-panel">
          {!activeTopic ? (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📚</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 8 }}>Select a topic to start learning</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: 14, maxWidth: 400, margin: '0 auto 20px' }}>
                Choose any topic from the panel on the left. Topics are organized by phase and difficulty.
              </p>
              {!isUnlocked && (
                <div style={{ background: 'var(--gray-100)', borderRadius: 8, padding: '12px 18px', fontSize: 13, color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <Lock size={14} /> This level is locked. Complete previous level to unlock it.
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="topic-header">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h1>{activeTopic.title}</h1>
                    <p>{activeTopic.description}</p>
                    <div className="topic-header-meta">
                      <span className="tag">{currentLevel.title}</span>
                      <span className="tag">{activePhaseId ? currentLevel.phases.find(p => p.id === activePhaseId)?.title.replace(/Phase \d+ — /, '') : ''}</span>
                      {activeTopic.mandatory && <span className="tag blue">Mandatory</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button className="btn btn-outline btn-sm" onClick={toggleBookmark}>
                      {state.topics[activeTopic.id]?.bookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                      {state.topics[activeTopic.id]?.bookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                    {!state.topics[activeTopic.id]?.completed ? (
                      <button className="btn btn-success btn-sm" onClick={markComplete}>
                        <CheckCircle size={14} /> Mark Complete
                      </button>
                    ) : (
                      <button className="btn btn-sm" style={{ background: 'var(--green-50)', color: 'var(--green)', border: '1px solid var(--green-100)' }}
                        onClick={() => { dispatch({ type: 'UNCOMPLETE_TOPIC', topicId: activeTopic.id }); showToast('Marked as incomplete'); }}>
                        <CheckCircle size={14} /> Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <ContentRenderer content={activeTopic.content} />

              {/* Notes Section */}
              <div className="card" style={{ marginTop: 20 }}>
                <div className="card-header">
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)' }}>📝 My Notes</h3>
                </div>
                <div className="card-body">
                  <textarea
                    className="form-textarea"
                    placeholder="Add your own notes, insights, or questions about this topic..."
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    rows={4}
                  />
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={saveNote}>Save Notes</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
